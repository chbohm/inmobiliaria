import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { WorkbenchNavItem, WorkbenchShellComponent } from '../../../core/layout/workbench-shell.component';

@Component({
  selector: 'app-system-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, WorkbenchShellComponent],
  templateUrl: './system-layout.component.html',
  styleUrl: './system-layout.component.scss'
})
export class SystemLayoutComponent {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);

  readonly user = this.authStore.user;
  readonly userLabel = computed(() => this.user()?.email ?? 'Sin sesion');

  readonly primaryNav: WorkbenchNavItem[] = [
    { label: 'Inmuebles', route: '/system/properties', icon: 'IN' },
    { label: 'Dashboard', route: '/system/dashboard', icon: 'DB' },
    { label: 'Tenants', route: '/system/tenants', icon: 'TN' }
  ];

  readonly secondaryNav: WorkbenchNavItem[] = [
    { label: 'Mi usuario', route: '/system/profile', icon: 'US' },
    { label: 'Settings sistema', route: '/system/settings', icon: 'ST' }
  ];

  public logout(): void {
    this.authService.logout().subscribe();
  }
}