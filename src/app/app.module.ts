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
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { AuthErrorComponent } from './auth-error/auth-error.component';
import { AuthService } from './services/auth.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EasyAuthInterceptor } from './services/easy-auth.interceptor';
import { HealthcheckComponent } from './healthcheck/healthcheck.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { ReportHistoryComponent } from './report-history/report-history.component';
import { CreateReportGeneralComponent } from './create-report-general/create-report-general.component';
import { CreateReportFilteringGroupingComponent } from './create-report-filtering-grouping/create-report-filtering-grouping.component';
import { CreateReportEditExportComponent } from './create-report-edit-export/create-report-edit-export.component';
import { CreateReportDataSourcesComponent } from './create-report-data-sources/create-report-data-sources.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import { CreateReportDataSourceAddComponent } from './create-report-data-source-add/create-report-data-source-add.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DragDropModule} from '@angular/cdk/drag-drop';

// AoT requires an exported function for factories
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
    CreateReportComponent,
    ReportHistoryComponent,
    CreateReportGeneralComponent,
    CreateReportFilteringGroupingComponent,
    CreateReportEditExportComponent,
    CreateReportDataSourcesComponent,
    CreateReportDataSourceAddComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatStepperModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    DragDropModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,

    TranslateModule.forRoot({
      defaultLanguage: 'ro',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    }),

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
            piiLoggingEnabled: true
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
            ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
            ["/api", [environment.adclientid + '/.default']]
          ]
        ),
      }
    ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    ...additionalProviders,
    MsalGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule { }
