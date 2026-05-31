import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {Auth} from './auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const roles = route.data['roles'] as string[];

  return roles.some(role => authService.hasRole(role));
};
