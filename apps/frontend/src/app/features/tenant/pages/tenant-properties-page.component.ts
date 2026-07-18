import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type { Inmueble } from '@inmobiliaria/contracts';

import { PropertiesApiService } from '../data/properties-api.service';

@Component({
  selector: 'app-tenant-properties-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tenant-properties-page.component.html',
  styleUrl: './tenant-properties-page.component.scss'
})
export class TenantPropertiesPageComponent {
  private readonly propertiesApi = inject(PropertiesApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly items = signal<Inmueble[]>([]);

  public constructor() {
    this.load();
  }

  public reload(): void {
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.propertiesApi.list().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.items.set(response.items ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No fue posible cargar inmuebles.');
        this.isLoading.set(false);
      }
    });
  }
}