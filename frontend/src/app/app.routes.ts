import {Routes} from '@angular/router';
import {Login} from './features/auth/login/login';
import {Home} from './features/dashboard/home/home';
import {authGuard} from './core/auth/auth-guard';
import {AppShell} from './features/core/app-shell/app-shell';
import {UserList} from './features/dashboard/user/user-list/user-list';
import {UserCreate} from './features/dashboard/user/user-create/user-create';
import {ChangePassword} from './features/auth/change-password/change-password';
import {roleGuard} from './core/auth/role-guard';
import {Role} from './shared/role';
import {Application} from './features/auth/application/application';
import {ApplicationList} from './features/dashboard/application/application-list/application-list';
import {ApplicationWorkflow} from './features/dashboard/application/application-workflow/application-workflow';
import {ForgottenPassword} from './features/auth/forgotten-password/forgotten-password';
import {PartnerList} from './features/dashboard/partner/partner-list/partner-list';
import {PartnerEdit} from './features/dashboard/partner/partner-edit/partner-edit';
import {ActivityList} from './features/core/activity/activity-list';
import {CommissionSetting} from './features/core/commission-setting/commission-setting';
import {TransactionList} from './features/dashboard/transaction/transaction-list/transaction-list';
import {TransactionCreate} from './features/dashboard/transaction/transaction-create/transaction-create';
import {TransactionWorkflow} from './features/dashboard/transaction/transaction-workflow/transaction-workflow';
import {Profile} from './features/dashboard/user/profile/profile/profile';
import {PublicShell} from './features/core/public-shell/public-shell';

export const routes: Routes = [
  {
    path: 'public',
    component: PublicShell,
    children: [
      { path: 'login', component: Login },
      { path: 'change-password', component: ChangePassword },
      { path: 'forgotten-password', component: ForgottenPassword },
      { path: 'applicant', component: Application },
      { path: 'applicant/:referralCode', component: Application }
    ]
  },
  {
    path: '',
    component: AppShell,
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Home },
      { path: 'profile', component: Profile },

      {
        path: 'applications',
        canActivateChild: [roleGuard],
        data: { roles: [Role.SALES, Role.ADMIN] },
        children: [
          { path: '', component: ApplicationList },
          { path: ':id', component: ApplicationWorkflow },
        ]
      },

      {
        path: 'partners',
        canActivateChild: [roleGuard],
        data: { roles: [Role.ADMIN] },
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
        data: { roles: [Role.ADMIN] },
        children: [
          { path: '', component: UserList },
          { path: 'create', component: UserCreate },
          { path: 'create/:applicationId', component: UserCreate }
        ]
      },
      {
        path: 'transactions',
        canActivateChild: [roleGuard],
        data: { roles: [Role.ADMIN] },
        children: [
          { path: '', component: TransactionList },
          { path: 'create', component: TransactionCreate },
          { path: ':id', component: TransactionWorkflow },
        ]
      },
      {
        path: 'activities',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN] },
        component: ActivityList
      },
      {
        path: 'settings',
        component: CommissionSetting,
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'commission-setting',
        component: CommissionSetting,
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN] },
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
