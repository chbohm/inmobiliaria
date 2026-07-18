import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, firstValueFrom, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';

import type { LoginRequest, LoginResponse } from '@inmobiliaria/contracts';

import { AuthApiService } from './auth-api.service';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private refreshRequest$: Observable<LoginResponse> | null = null;

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

  public async initializeSession(): Promise<void> {
    if (!this.authStore.isAuthenticated()) {
      return;
    }

    const rehydration$ = this.authApi.me().pipe(
      tap((response) => {
        this.authStore.updateUser(response.user);
      }),
      catchError(() => this.refreshSession().pipe(
        switchMap(() => this.authApi.me()),
        tap((response) => {
          this.authStore.updateUser(response.user);
        }),
        catchError(() => {
          this.handleAuthFailure();
          return of(null);
        })
      ))
    );

    await firstValueFrom(rehydration$);
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

  public refreshSession(): Observable<LoginResponse> {
    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    const refreshToken = this.authStore.refreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    this.refreshRequest$ = this.authApi.refresh({ refreshToken }).pipe(
      tap((response) => {
        this.authStore.setSession(response);
      }),
      finalize(() => {
        this.refreshRequest$ = null;
      }),
      shareReplay(1)
    );

    return this.refreshRequest$;
  }

  public logout() {
    return this.authApi.logout().pipe(
      tap(() => {
        this.handleAuthFailure();
      }),
      catchError(() => {
        this.handleAuthFailure();
        return of({ success: true as const });
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

  public handleAuthFailure(): void {
    this.authStore.clear();
    void this.router.navigateByUrl('/login');
  }

  private redirectByScope(scope: 'SYSTEM' | 'TENANT'): Promise<boolean> {
    return this.router.navigateByUrl(scope === 'SYSTEM' ? '/system/dashboard' : '/tenant/dashboard');
  }
}