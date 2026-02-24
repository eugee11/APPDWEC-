import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BootService } from '../services/boot.service';
import { Boot } from '../models/boot.model';

@Component({
  selector: 'app-boot-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './boot-detail.component.html'
})
export class BootDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bootService = inject(BootService);

  loading = false;
  errorMessage = '';
  boot: Boot | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.bootService.getById(id).subscribe({
        next: (response) => {
          this.boot = response.data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'No se pudo cargar el detalle';
          this.loading = false;
        }
      });
    }
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
