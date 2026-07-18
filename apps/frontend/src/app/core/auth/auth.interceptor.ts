import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthStore } from './auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const accessToken = authStore.accessToken();

  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const authorizedRequest = accessToken ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    }) : req;

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || !authStore.refreshToken()) {
        return throwError(() => error);
      }

      return authService.refreshSession().pipe(
        switchMap((session) => {
          const nextAccessToken = session.accessToken;
          if (!nextAccessToken) {
            authService.handleAuthFailure();
            return throwError(() => error);
          }

          return next(req.clone({
            setHeaders: {
              Authorization: `Bearer ${nextAccessToken}`
            }
          }));
        }),
        catchError((refreshError) => {
          authService.handleAuthFailure();
          return throwError(() => refreshError);
        })
      );
    })
  );
};