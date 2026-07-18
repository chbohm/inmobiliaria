import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { AuthenticatedUser, LoginRequest, LoginResponse, RefreshRequest } from '@inmobiliaria/contracts';

import { API_BASE_URL } from '../config/api.config';

type MeResponse = {
  success: true;
  user: AuthenticatedUser;
};

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  public login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiBaseUrl}/auth/login`, payload);
  }

  public me() {
    return this.http.get<MeResponse>(`${this.apiBaseUrl}/auth/me`);
  }

  public refresh(payload: RefreshRequest) {
    return this.http.post<LoginResponse>(`${this.apiBaseUrl}/auth/refresh`, payload);
  }

  public logout() {
    return this.http.post<{ success: true }>(`${this.apiBaseUrl}/auth/logout`, {});
  }
}