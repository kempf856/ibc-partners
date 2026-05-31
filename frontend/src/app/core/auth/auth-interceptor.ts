import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';
import { NotificationService } from '../notification/notification'
import {catchError, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  if (req.url.startsWith('/api/auth/')) {
    return next(req).pipe(
      catchError(err => {
        const msg = err?.error?.detail || 'Ismeretlen hiba!';
        notification.error(msg);
        return throwError(() => err);
      })
    );
  }

  const authService = inject(Auth);

  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        authService.logout();
      }
      return throwError(() => err);
    })
  );
};
