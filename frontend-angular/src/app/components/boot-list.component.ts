import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BootService } from '../services/boot.service';
import { Boot } from '../models/boot.model';

@Component({
  selector: 'app-boot-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './boot-list.component.html'
})
export class BootListComponent implements OnInit {
  private readonly bootService = inject(BootService);

  boots: Boot[] = [];
  loading = false;
  alertMessage = '';
  alertType: 'success' | 'danger' = 'success';

  page = 1;
  limit = 5;
  totalPages = 1;
  total = 0;

  search = '';
  surface = '';
  deleteId = '';

  ngOnInit(): void {
    this.fetchBoots();
  }

  private sanitizeBoot(boot: any): Boot {
    return {
      _id: boot?._id,
      name: boot?.name || boot?.model || boot?.title || 'Modelo sin nombre',
      brand: boot?.brand || boot?.marca || 'Marca no indicada',
      color: boot?.color || 'No indicado',
      description: boot?.description || boot?.descripcion || 'Sin descripción',
      price: Number(boot?.price ?? boot?.precio ?? 0),
      releaseDate: boot?.releaseDate || boot?.fechaLanzamiento || new Date().toISOString(),
      inStock: typeof boot?.inStock === 'boolean' ? boot.inStock : Number(boot?.stock ?? 0) > 0,
      stock: Number(boot?.stock ?? boot?.existencias ?? 0),
      size: Number(boot?.size ?? boot?.talla ?? 0),
      surface: (boot?.surface || boot?.superficie || 'FG') as 'FG' | 'AG' | 'TF' | 'IC',
      createdAt: boot?.createdAt,
      updatedAt: boot?.updatedAt
    };
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(value || 0));
  }

  fetchBoots(): void {
    this.loading = true;
    this.bootService.getAll(this.page, this.limit, this.search, this.surface).subscribe({
      next: (response) => {
        this.boots = (response.data || []).map((item) => this.sanitizeBoot(item));
        this.total = response.total;
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        this.alertType = 'danger';
        this.alertMessage = error?.error?.message || 'No se pudieron cargar las botas';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.fetchBoots();
  }

  clearFilters(): void {
    this.search = '';
    this.surface = '';
    this.page = 1;
    this.fetchBoots();
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page -= 1;
      this.fetchBoots();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page += 1;
      this.fetchBoots();
    }
  }

  openDeleteModal(id: string | undefined): void {
    if (!id) return;
    this.deleteId = id;
  }

  closeDeleteModal(): void {
    this.deleteId = '';
  }

  confirmDelete(): void {
    if (!this.deleteId) return;

    this.bootService.remove(this.deleteId).subscribe({
      next: (response) => {
        this.alertType = 'success';
        this.alertMessage = response.message;
        this.deleteId = '';
        this.fetchBoots();
      },
      error: (error) => {
        this.alertType = 'danger';
        this.alertMessage = error?.error?.message || 'No se pudo eliminar la bota';
        this.deleteId = '';
      }
    });
  }

  getSurfaceLabel(surface: string): string {
    const labels: Record<string, string> = {
      FG: 'Césped natural (FG)',
      AG: 'Césped artificial (AG)',
      TF: 'Turf / Moqueta (TF)',
      IC: 'Interior / Sala (IC)'
    };

    return labels[surface] || surface;
  }
}
