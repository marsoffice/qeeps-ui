import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AdminPcComponent } from './admin-pc/admin-pc.component';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { FormsAddComponent } from './forms-add/forms-add.component';
import { FormsAdminResultsComponent } from './forms-admin-results/forms-admin-results.component';
import { FormsAdminComponent } from './forms-admin/forms-admin.component';
import { FormsCalendarComponent } from './forms-calendar/forms-calendar.component';
import { FormsCompleteComponent } from './forms-complete/forms-complete.component';
import { FormsListComponent } from './forms-list/forms-list.component';
import { HealthcheckComponent } from './healthcheck/healthcheck.component';
import { HomeComponent } from './home/home.component';
import { LoggedOutComponent } from './logged-out/logged-out.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PaymentsAdminInvoicesComponent } from './payments-admin-invoices/payments-admin-invoices.component';
import { PaymentsAdminPricesComponent } from './payments-admin-prices/payments-admin-prices.component';
import { PaymentsMyInvoicesComponent } from './payments-my-invoices/payments-my-invoices.component';
import { PaymentsSettingsComponent } from './payments-settings/payments-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportHistoryComponent } from './report-history/report-history.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'logged-out',
    component: LoggedOutComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'auth-error',
    component: AuthErrorComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'healthcheck',
    component: HealthcheckComponent,
  },
  {
    path:'create-report',
    component: CreateReportComponent,
    canActivate: [MsalGuard],
  },

  {
    path:'report-history',
    component:ReportHistoryComponent,
    canActivate: [MsalGuard],
  },

  {
    path:'my-invoices',
    component:PaymentsMyInvoicesComponent,
    canActivate: [MsalGuard],

  },
  {
    path:'admin-prices',
    component:PaymentsAdminPricesComponent

  },
  {
    path:'admin-invoices',
    component:PaymentsAdminInvoicesComponent,
    canActivate: [MsalGuard],

  },
  {
    path:'payment-settings',
    component:PaymentsSettingsComponent,
    canActivate: [MsalGuard],

  },

  {
    path:'forms-calendar',
    component: FormsCalendarComponent,
    canActivate: [MsalGuard],

  },

  {
    path:'forms-list',
    component: FormsListComponent

  },

  {
    path:'forms-admin',
    component: FormsAdminComponent,
    canActivate: [MsalGuard],

  },
  {
    path:'forms-admin-results',
    component: FormsAdminResultsComponent,
    canActivate: [MsalGuard],

  },

  {
    path:'forms-add',
    component:FormsAddComponent,
    canActivate: [MsalGuard],

  },

  {
    path:'forms-complete/:id',
    component:FormsCompleteComponent,
    canActivate: [MsalGuard],

  },

  {
    path:'admin-pc',
    component:AdminPcComponent,
    canActivate: [MsalGuard],

  },

  {
    path:'notifications',
    component:NotificationsComponent,
    canActivate: [MsalGuard],

  },




  {
    path:'downloads',
    component:DownloadsComponent,
    canActivate: [MsalGuard],

  },







  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
  },
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: !isIframe ? 'enabled' : 'disabled', // Don't perform initial navigation in iframes
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
