import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Home } from './features/dashboard/home/home';
import { authGuard } from './core/auth/auth-guard';
import {AppShell} from './features/dashboard/app-shell/app-shell';
import {UserList} from './features/dashboard/user/user-list/user-list';
import {UserCreate} from './features/dashboard/user/user-create/user-create';
import {Register} from './features/auth/register/register';
import {roleGuard} from './core/auth/role-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: AppShell,
    canActivateChild: [authGuard],
    children: [
      { path: 'dashboard', component: Home },
      {
        path: 'users',
        canActivateChild: [roleGuard],
        data: {
          roles: ['ADMIN']
        },
        children: [
          { path: '', component: UserList },
          { path: 'create', component: UserCreate }
        ]
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
