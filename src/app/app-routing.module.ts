import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { ContractComponent } from './contract/contract.component';
import { HealthcheckComponent } from './healthcheck/healthcheck.component';
import { HomeComponent } from './home/home.component';
import { LoggedOutComponent } from './logged-out/logged-out.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FromNotificationComponent } from './notifications/from-notification/from-notification.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthRoleGuard } from './services/auth-role.guard';
import { ContractGuard } from './services/contract.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [MsalGuard, ContractGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [MsalGuard, ContractGuard],
  },
  {
    path: 'contract',
    component: ContractComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'from-notification',
    component: FromNotificationComponent,
    canActivate: [MsalGuard, ContractGuard],
  },
  {
    path: 'logged-out',
    component: LoggedOutComponent,
  },
  {
    path: 'auth-error',
    component: AuthErrorComponent,
  },
  {
    path: 'healthcheck',
    component: HealthcheckComponent,
  },
  {
    path: 'forms',
    loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule),
    canActivate: [MsalGuard, ContractGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [MsalGuard, ContractGuard, AuthRoleGuard],
    data: {
      roles: ["Owner"]
    }
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
export class AppRoutingModule { }
