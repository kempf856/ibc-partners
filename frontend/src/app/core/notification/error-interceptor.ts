import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {NotificationService} from './notification';

export const SKIP_ERROR = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const skip = req.context.get(SKIP_ERROR);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status >= 400 && error.status < 500) {
        if (skip) {
          return throwError(() => error);
        }
        notificationService.error(error.error?.detail || 'Ismeretlen hiba!');
      } else if (error.status >= 500) {
        notificationService.error('Váratlan hiba történt!');
      } else if (error.status === 0) {
        notificationService.error('A szerver nem érhető el!');
      }
      return throwError(() => error);
    })
  );
};
