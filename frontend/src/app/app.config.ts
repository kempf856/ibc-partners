import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor} from './core/auth/auth-interceptor';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {HungarianPaginatorIntl} from './core/hungarian/hungarian-paginator-intl';
import {errorInterceptor} from './core/notification/error-interceptor';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    { provide: MatPaginatorIntl, useClass: HungarianPaginatorIntl },
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },
  ]
};
