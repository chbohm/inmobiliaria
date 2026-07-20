import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { WorkbenchNavItem, WorkbenchShellComponent } from '../../../core/layout/workbench-shell.component';

@Component({
  selector: 'app-tenant-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, WorkbenchShellComponent],
  templateUrl: './tenant-layout.component.html',
  styleUrl: './tenant-layout.component.scss'
})
export class TenantLayoutComponent {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);

  readonly user = this.authStore.user;
  readonly userLabel = computed(() => this.user()?.email ?? 'Sin sesion');
  readonly inmobiliariaId = computed(() => this.user()?.inmobiliariaId ?? 'Sin inmobiliaria');

  readonly primaryNav: WorkbenchNavItem[] = [
    { label: 'Inmuebles', route: '/tenant/properties', icon: 'IN' },
    { label: 'Dashboard', route: '/tenant/dashboard', icon: 'DB' },
    { label: 'Contratos', route: '/tenant/contracts', icon: 'CT' }
  ];

  readonly secondaryNav: WorkbenchNavItem[] = [
    { label: 'Mi usuario', route: '/tenant/profile', icon: 'US' },
    { label: 'Settings inmobiliaria', route: '/tenant/settings', icon: 'ST' }
  ];

  public logout(): void {
    this.authService.logout().subscribe();
  }
}