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
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {MatTreeModule} from '@angular/material/tree';
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
import {MatSelectModule} from '@angular/material/select';
import { CreateReportDataSourceAddComponent } from './create-report-data-source-add/create-report-data-source-add.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import { QuillModule } from 'ngx-quill'
import {MatExpansionModule} from '@angular/material/expansion';
import { PaymentsMyInvoicesComponent } from './payments-my-invoices/payments-my-invoices.component';
import { PaymentsAdminPricesComponent } from './payments-admin-prices/payments-admin-prices.component';
import { PaymentsAdminInvoicesComponent } from './payments-admin-invoices/payments-admin-invoices.component';
import { PaymentsSettingsComponent } from './payments-settings/payments-settings.component';
import { PaymentsAdminPriceAddComponent } from './payments-admin-price-add/payments-admin-price-add.component';
import { PaymentsAdminInvoiceDetalisComponent } from './payments-admin-invoice-detalis/payments-admin-invoice-detalis.component';
import { PaymentsAdminInvoiceAddComponent } from './payments-admin-invoice-add/payments-admin-invoice-add.component';
import { FormsCalendarComponent } from './forms-calendar/forms-calendar.component';
import { FormsListComponent } from './forms-list/forms-list.component';
import { FormsAdminComponent } from './forms-admin/forms-admin.component';
import { FormsAddComponent } from './forms-add/forms-add.component';
import { AdminPcComponent } from './admin-pc/admin-pc.component';
import { ProfileComponent } from './profile/profile.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import { FormsAdminResultsComponent } from './forms-admin-results/forms-admin-results.component'; // a plugin!



FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

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
    PaymentsMyInvoicesComponent,
    PaymentsAdminPricesComponent,
    PaymentsAdminInvoicesComponent,
    PaymentsSettingsComponent,
    PaymentsAdminPriceAddComponent,
    PaymentsAdminInvoiceDetalisComponent,
    PaymentsAdminInvoiceAddComponent,
    FormsCalendarComponent,
    FormsListComponent,
    FormsAdminComponent,
    FormsAddComponent,
    AdminPcComponent,
    ProfileComponent,
    FormsAdminResultsComponent,
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
    MatTreeModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatPaginatorModule,
    QuillModule.forRoot(),
    MatExpansionModule,
    MatCardModule,
    FullCalendarModule,


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
            ["https://graph.microsoft.com", ["user.read"]],
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
