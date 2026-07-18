import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { AuthStore } from '../../../core/auth/auth.store';

@Component({
  selector: 'app-tenant-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './tenant-layout.component.html',
  styleUrl: './tenant-layout.component.scss'
})
export class TenantLayoutComponent {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);

  readonly user = this.authStore.user;
  readonly inmobiliariaId = computed(() => this.user()?.inmobiliariaId ?? 'Sin inmobiliaria');

  public logout(): void {
    this.authService.logout().subscribe();
  }
}