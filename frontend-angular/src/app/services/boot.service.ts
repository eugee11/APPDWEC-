import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Boot } from '../models/boot.model';

interface PaginatedResponse {
  ok: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Boot[];
}

interface SingleResponse {
  ok: boolean;
  data: Boot;
  message?: string;
}

interface GenericResponse {
  ok: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class BootService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl =
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:4000/api/v1/boots'
      : '/api/v1/boots';

  private normalizeBoot(boot: Boot): Boot {
    const normalizedPrice = Number((boot as any).price ?? (boot as any).precio ?? 0);
    const normalizedStock = Number((boot as any).stock ?? (boot as any).existencias ?? 0);
    const normalizedSize = Number((boot as any).size ?? (boot as any).talla ?? 0);
    const normalizedSurface =
      (boot as any).surface ||
      (boot as any).superficie ||
      (boot as any).surfaceType ||
      'FG';

    return {
      ...boot,
      name: boot.name || boot.model || boot.title || 'Modelo sin nombre',
      brand: boot.brand || (boot as any).marca || 'Marca no indicada',
      color: boot.color || 'No indicado',
      description: boot.description || (boot as any).descripcion || 'Sin descripción',
      price: Number.isFinite(normalizedPrice) ? normalizedPrice : 0,
      releaseDate: boot.releaseDate || (boot as any).fechaLanzamiento || new Date().toISOString(),
      inStock: typeof boot.inStock === 'boolean' ? boot.inStock : normalizedStock > 0,
      stock: Number.isFinite(normalizedStock) ? normalizedStock : 0,
      size: Number.isFinite(normalizedSize) ? normalizedSize : 0,
      surface: normalizedSurface
    };
  }

  getAll(page: number, limit: number, search: string, surface: string): Observable<PaginatedResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit)
    });

    if (search.trim()) params.set('search', search.trim());
    if (surface.trim()) params.set('surface', surface.trim());

    return this.http.get<PaginatedResponse>(`${this.apiUrl}/get/all?${params.toString()}`).pipe(
      map((response) => ({
        ...response,
        data: response.data.map((boot) => this.normalizeBoot(boot))
      }))
    );
  }

  getById(id: string): Observable<SingleResponse> {
    return this.http.get<SingleResponse>(`${this.apiUrl}/get/${id}`).pipe(
      map((response) => ({
        ...response,
        data: this.normalizeBoot(response.data)
      }))
    );
  }

  create(payload: Boot): Observable<SingleResponse> {
    return this.http.post<SingleResponse>(`${this.apiUrl}/post`, payload);
  }

  update(id: string, payload: Boot): Observable<SingleResponse> {
    return this.http.put<SingleResponse>(`${this.apiUrl}/update/${id}`, payload);
  }

  remove(id: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${this.apiUrl}/delete/${id}`);
  }
}
