import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MsalGuard,
  MsalInterceptor,
  MsalModule,
  MsalRedirectComponent,
  ProtectedResourceScopes,
} from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  InteractionType,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoggedOutComponent } from './logged-out/logged-out.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { AuthService } from './services/auth.service';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

  export function loggerCallback(logLevel: LogLevel, message: string) {
    if (!environment.production) {
      console.log(message);
    }
    if (logLevel !== LogLevel.Error) {
      return;
    }
    if (AuthService.logStore.length === 10) {
      AuthService.logStore.splice(0, 1);
    }
    AuthService.logStore.push(message);
  }

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoggedOutComponent,
    SidenavComponent,
    AuthErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,

    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.adclientid,
          authority: `https://login.microsoftonline.com/${environment.adtenantid}`,
          redirectUri: window.location.origin,
          navigateToLoginRequestUrl: true,
          postLogoutRedirectUri: '/logged-out',
        },
        cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
          storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
        },
        system: {
          loggerOptions: {
            loggerCallback: loggerCallback,
            logLevel: environment.production ? LogLevel.Info : LogLevel.Error,
            piiLoggingEnabled: !environment.production
          },
        }
      }),
      {
        interactionType: InteractionType.Redirect,
        loginFailedRoute: '/auth-error',
        authRequest: {
          scopes: [environment.adclientid + '/.default'],
        },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map<
          string,
          (string | ProtectedResourceScopes)[] | null
        >(),
      }
    ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
