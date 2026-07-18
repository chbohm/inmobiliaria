import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import type { LoginRequest, LoginResponse } from '@inmobiliaria/contracts';

import { AuthApiService } from './auth-api.service';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  public login(payload: LoginRequest) {
    return this.authApi.login(payload).pipe(
      tap((response) => {
        this.authStore.setSession(response);
        if (response.user?.scope) {
          void this.redirectByScope(response.user.scope);
        }
      })
    );
  }

  public hydrateCurrentUser() {
    if (!this.authStore.isAuthenticated()) {
      return null;
    }

    return this.authApi.me().pipe(
      tap((response) => {
        this.authStore.updateUser(response.user);
      })
    );
  }

  public logout() {
    return this.authApi.logout().pipe(
      tap(() => {
        this.authStore.clear();
        void this.router.navigateByUrl('/login');
      })
    );
  }

  public restoreRoute(): string {
    if (this.authStore.isSystem()) {
      return '/system/dashboard';
    }

    if (this.authStore.isTenant()) {
      return '/tenant/dashboard';
    }

    return '/login';
  }

  private redirectByScope(scope: 'SYSTEM' | 'TENANT'): Promise<boolean> {
    return this.router.navigateByUrl(scope === 'SYSTEM' ? '/system/dashboard' : '/tenant/dashboard');
  }
}