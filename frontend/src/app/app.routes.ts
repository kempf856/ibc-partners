import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Home } from './features/dashboard/home/home';
import { authGuard } from './core/auth/auth-guard';
import {AppShell} from './features/core/app-shell/app-shell';
import {UserList} from './features/dashboard/user/user-list/user-list';
import {UserCreate} from './features/dashboard/user/user-create/user-create';
import {ChangePassword} from './features/auth/change-password/change-password';
import {roleGuard} from './core/auth/role-guard';
import {Role} from './shared/role';
import {Application} from './features/auth/application/application';
import {ApplicationList} from './features/dashboard/application/application-list/application-list';
import {ApplicationWorkflow} from './features/dashboard/application/application-workflow/application-workflow';
import {Profile} from './features/dashboard/user/profile/profile';
import {ForgottenPassword} from './features/auth/forgotten-password/forgotten-password';
import {PartnerList} from './features/dashboard/partner/partner-list/partner-list';
import {PartnerEdit} from './features/dashboard/partner/partner-edit/partner-edit';
import {ActivityList} from './features/core/activity/activity-list';
import {SettingList} from './features/core/setting/setting-list';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: 'login', component: Login },
      { path: 'change-password', component: ChangePassword },
      { path: 'forgotten-password', component: ForgottenPassword },
      { path: 'applicant', component: Application },
      { path: 'applicant/:referralCode', component: Application },
      {
        path: '',
        canActivateChild: [authGuard],
        children: [
          { path: 'dashboard', component: Home },
          {
            path: 'partners',
            children: [
              { path: '', component: PartnerList },
              { path: 'create', component: PartnerEdit, data: { mode: 'create' }},
              { path: 'create/:applicationId', component: PartnerEdit, data: { mode: 'create' }},
              { path: 'view/:partnerId', component: PartnerEdit, data: { mode: 'view' }},
              { path: 'edit/:partnerId', component: PartnerEdit, data: { mode: 'edit' }}
            ]
          },
          {
            path: 'users',
            canActivateChild: [roleGuard],
            data: {
              roles: [Role.ADMIN]
            },
            children: [
              { path: '', component: UserList },
              { path: 'create', component: UserCreate },
              { path: 'create/:applicationId', component: UserCreate }
            ]
          },
          {
            path: 'applications',
            canActivateChild: [roleGuard],
            data: {
              roles: [Role.ADMIN]
            },
            children: [
              { path: '', component: ApplicationList },
              { path: ':id', component: ApplicationWorkflow },
            ]
          },
          {
            path: 'activities',
            component: ActivityList,
            canActivate: [roleGuard],
            data: {
              roles: [Role.ADMIN]
            }
          },
          {
            path: 'settings',
            component: SettingList,
            canActivate: [roleGuard],
            data: {
              roles: [Role.ADMIN]
            }
          },
          { path: 'profile', component: Profile },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
