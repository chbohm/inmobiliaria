import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { PropertyListResponse } from '@inmobiliaria/contracts';

import { API_BASE_URL } from '../../../core/config/api.config';

@Injectable({ providedIn: 'root' })
export class PropertiesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  public list() {
    return this.http.get<PropertyListResponse>(`${this.apiBaseUrl}/properties`);
  }
}