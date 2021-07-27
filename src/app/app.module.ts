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

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

  export function loggerCallback(logLevel: LogLevel, message: string) {
    console.log(message);
  }

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoggedOutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.adClientId,
          authority: `https://login.microsoftonline.com/${environment.adTenantId}`,
          redirectUri: window.location.origin,
          navigateToLoginRequestUrl: true,
          postLogoutRedirectUri: '/logged-out'
        },
        cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
          storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
        },
        system: {
          loggerOptions: {
            loggerCallback: environment.production ? loggerCallback : () => {},
            piiLoggingEnabled: false
          }
        }
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['.default'],
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
  bootstrap: [AppComponent],
})
export class AppModule {}
