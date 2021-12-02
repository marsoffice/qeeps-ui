import { NgModule, Provider } from '@angular/core';
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
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoggedOutComponent } from './logged-out/logged-out.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { AuthService } from './services/auth.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EasyAuthInterceptor } from './services/easy-auth.interceptor';
import { HealthcheckComponent } from './healthcheck/healthcheck.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SharedModule } from './shared/shared.module';
import { FromNotificationComponent } from './notifications/from-notification/from-notification.component';
import { FunctionProxyInterceptor } from './services/function-proxy.interceptor';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { LegalComponent } from './layout/legal/legal.component';
import { ContractComponent } from './contract/contract.component';
import { ConfirmationModule } from './shared/confirmation/confirmation.module';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

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
  AuthService.logStore = message;
}

const additionalProviders: Provider[] = [];

if (!environment.production) {
  additionalProviders.push({
    provide: HTTP_INTERCEPTORS,
    useClass: EasyAuthInterceptor,
    multi: true,
  });
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
    HealthcheckComponent,
    ProfileComponent,
    NotificationsComponent,
    FromNotificationComponent,
    LegalComponent,
    ContractComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatCardModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatBadgeModule,
    MatBottomSheetModule,
    ConfirmationModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'ro'
    }),

    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.adclientid,
          authority: `https://login.microsoftonline.com/${environment.adtenantid}`,
          redirectUri: window.location.origin + "/",
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
            logLevel: !environment.production ? LogLevel.Info : LogLevel.Error,
            piiLoggingEnabled: !environment.production
          },
        }
      }),
      {
        interactionType: InteractionType.Redirect,
        loginFailedRoute: '/auth-error',
        authRequest: {
          scopes: [],
        },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map<
          string,
          (string | ProtectedResourceScopes)[] | null
        >(
          [
            ["https://graph.microsoft.com", ["user.read"]],
            ["/api", [environment.adclientid + '/.default']]
          ]
        ),
      }
    ),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FunctionProxyInterceptor,
      multi: true,
    },
    ...additionalProviders,
    MsalGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule { }
