import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth-service';
import {Role} from '../../shared/role';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const roles = route.data['roles'] as Role[];

  return roles.some(role => authService.hasRole(role));
};
