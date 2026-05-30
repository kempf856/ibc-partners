import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Home } from './features/dashboard/home/home';
import { authGuard } from './core/auth/auth-guard';
import {AppShell} from './features/dashboard/app-shell/app-shell';
import {UserList} from './features/dashboard/user/user-list/user-list';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: AppShell,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Home },
      { path: 'users', component: UserList },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
