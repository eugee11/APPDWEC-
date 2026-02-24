import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BootService } from '../services/boot.service';
import { Boot } from '../models/boot.model';

@Component({
  selector: 'app-boot-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './boot-form.component.html'
})
export class BootFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bootService = inject(BootService);

  loading = false;
  submitting = false;
  isEditMode = false;
  bootId = '';
  alertMessage = '';
  alertType: 'success' | 'danger' = 'success';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    brand: ['', [Validators.required]],
    color: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [30, [Validators.required, Validators.min(30), Validators.max(500)]],
    releaseDate: ['', [Validators.required]],
    inStock: [true, [Validators.required]],
    stock: [1, [Validators.required, Validators.min(0)]],
    size: [40, [Validators.required, Validators.min(36), Validators.max(47)]],
    surface: ['FG', [Validators.required]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEditMode = true;
    this.bootId = id;
    this.loading = true;

    this.bootService.getById(id).subscribe({
      next: (response) => {
        const boot = response.data;
        this.form.patchValue({
          ...boot,
          releaseDate: boot.releaseDate?.slice(0, 10)
        });
        this.loading = false;
      },
      error: (error) => {
        this.alertType = 'danger';
        this.alertMessage = error?.error?.message || 'No se pudo cargar la bota';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.form.value as Boot;

    const request$ = this.isEditMode
      ? this.bootService.update(this.bootId, payload)
      : this.bootService.create(payload);

    request$.subscribe({
      next: (response) => {
        this.alertType = 'success';
        this.alertMessage = response.message || 'Operación realizada correctamente';
        this.submitting = false;
        setTimeout(() => this.router.navigateByUrl('/'), 700);
      },
      error: (error) => {
        this.alertType = 'danger';
        this.alertMessage = error?.error?.message || 'No se pudo guardar la bota';
        this.submitting = false;
      }
    });
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(errorType);
  }
}
