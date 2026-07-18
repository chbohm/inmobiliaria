import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { AuthStore } from '../../../core/auth/auth.store';

@Component({
  selector: 'app-system-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './system-layout.component.html',
  styleUrl: './system-layout.component.scss'
})
export class SystemLayoutComponent {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);

  readonly user = this.authStore.user;
  readonly userLabel = computed(() => this.user()?.email ?? 'Sin sesion');

  public logout(): void {
    this.authService.logout().subscribe();
  }
}