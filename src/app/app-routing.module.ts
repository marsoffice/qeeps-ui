import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { HealthcheckComponent } from './healthcheck/healthcheck.component';
import { HomeComponent } from './home/home.component';
import { LoggedOutComponent } from './logged-out/logged-out.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';

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
