import { computed, Injectable, signal } from '@angular/core';

import type { AuthenticatedUser, LoginResponse } from '@inmobiliaria/contracts';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthenticatedUser | null;
};

const STORAGE_KEY = 'inmobiliaria.auth';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly state = signal<AuthState>(this.readInitialState());

  readonly user = computed(() => this.state().user);
  readonly accessToken = computed(() => this.state().accessToken);
  readonly refreshToken = computed(() => this.state().refreshToken);
  readonly isAuthenticated = computed(() => Boolean(this.state().accessToken && this.state().user));
  readonly scope = computed(() => this.state().user?.scope ?? null);
  readonly isSystem = computed(() => this.scope() === 'SYSTEM');
  readonly isTenant = computed(() => this.scope() === 'TENANT');

  public setSession(session: LoginResponse): void {
    this.setState({
      accessToken: session.accessToken ?? null,
      refreshToken: session.refreshToken ?? null,
      user: session.user ?? null
    });
  }

  public updateUser(user: AuthenticatedUser): void {
    this.setState({
      ...this.state(),
      user
    });
  }

  public clear(): void {
    this.setState({
      accessToken: null,
      refreshToken: null,
      user: null
    });
  }

  private setState(next: AuthState): void {
    this.state.set(next);
    this.persist(next);
  }

  private readInitialState(): AuthState {
    if (typeof localStorage === 'undefined') {
      return { accessToken: null, refreshToken: null, user: null };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { accessToken: null, refreshToken: null, user: null };
      }

      return JSON.parse(raw) as AuthState;
    } catch {
      return { accessToken: null, refreshToken: null, user: null };
    }
  }

  private persist(state: AuthState): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}