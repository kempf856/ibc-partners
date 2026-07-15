import {Routes} from '@angular/router';
import {Login} from './features/auth/login/login';
import {Home} from './features/dashboard/home/home';
import {authGuard} from './core/auth/auth-guard';
import {AppShell} from './features/core/app-shell/app-shell';
import {UserList} from './features/dashboard/user/user-list/user-list';
import {UserEdit} from './features/dashboard/user/user-edit/user-edit';
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
import {PartnerView} from './features/dashboard/partner/partner-view/partner-view';
import {AuditLogList} from './features/dashboard/audit-log/audit-log-list/audit-log-list';
import {CommissionAdmin} from './features/dashboard/user/profile/commission/commission-admin/commission-admin';
import {InvoiceView} from './features/dashboard/user/profile/invoice/invoice-view/invoice-view';

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
        path: 'invoices',
        children: [
          { path: ':invoiceId', component: InvoiceView, data: { mode: 'admin'} },
          { path: ':invoiceId/my', component: InvoiceView, data: { mode: 'my'} }
        ]
      },

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
        children: [
          { path: 'admin', component: PartnerList, data: { mode: 'admin', roles: [Role.ADMIN] } },
          { path: '', component: PartnerList, data: { mode: 'global', roles: [Role.ADMIN, Role.PARTNER, Role.SALES] } },
          { path: 'create', component: PartnerEdit, data: { mode: 'create', roles: [Role.ADMIN] } },
          { path: 'create/:applicationId', component: PartnerEdit, data: { mode: 'create', roles: [Role.ADMIN] } },
          { path: 'view/:partnerId', component: PartnerView, data: { mode: 'view', roles: [Role.ADMIN, Role.PARTNER, Role.SALES] } },
          { path: 'edit/:partnerId', component: PartnerEdit, data: { mode: 'edit', roles: [Role.ADMIN] } }
        ]
      },
      {
        path: 'users',
        canActivateChild: [roleGuard],
        data: { roles: [Role.ADMIN] },
        children: [
          { path: '', component: UserList },
          { path: 'create', component: UserEdit, data: { mode: 'create' }},
          { path: 'create/:applicationId', component: UserEdit, data: { mode: 'create' }},
          { path: 'view/:userId', component: UserEdit, data: { mode: 'view' }},
          { path: 'edit/:userId', component: UserEdit, data: { mode: 'edit' }}
        ]
      },
      {
        path: 'transactions',
        canActivateChild: [roleGuard],
        children: [
          { path: '', component: TransactionList, data: { mode: 'admin', roles: [Role.ADMIN] } },
          { path: 'my', component: TransactionList, data: { mode: 'my', roles: [Role.PARTNER] } },
          { path: 'create', component: TransactionCreate, data: { mode: 'admin', roles: [Role.ADMIN] } },
          { path: 'sell', component: TransactionCreate, data: { mode: 'sell', roles: [Role.PARTNER] } },
          { path: 'buy', component: TransactionCreate, data: { mode: 'buy', roles: [Role.PARTNER] } },
          { path: ':id', component: TransactionWorkflow, data: { mode: 'admin', roles: [Role.ADMIN] } },
          { path: 'my/:id', component: TransactionWorkflow, data: { mode: 'my', roles: [Role.ADMIN, Role.PARTNER, Role.SALES] } },
          { path: 'view/:id', component: TransactionWorkflow, data: { mode: 'view', roles: [Role.ADMIN, Role.PARTNER, Role.SALES] } },
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
        canActivateChild: [roleGuard],
        children: [
          { path: '', component: CommissionSetting, data: { mode: 'edit', roles: [Role.ADMIN] } },
          { path: 'view', component: CommissionSetting, data: { mode: 'view', roles: [Role.ADMIN] } },
        ]
      },
      {
        path: 'commission-admin',
        component: CommissionAdmin,
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'audit-logs',
        component: AuditLogList,
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN] },
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
