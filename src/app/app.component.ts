import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { SwPush } from '@angular/service-worker';
import { MsalService } from '@azure/msal-angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Claims } from './models/claims';
import { Events } from './models/events';
import { AccessService } from './services/access.service';
import { AuthService } from './services/auth.service';
import { EventsService } from './services/events.service';
import { HubService } from './services/hub.service';
import { LocaleService } from './services/locale.service';
import { PushSubscriptionsService } from './services/push-subscriptions.service';
import { StateService } from './services/state.service';
import { UpdateService } from './services/update.service';
import { UserPreferencesService } from './services/user-preferences.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('drawerContent', { static: true, read: ElementRef }) private drawerContent!: ElementRef<HTMLElement>;

  isIframe = false;
  loginDisplay = false;
  isMobile = true;
  private _destroy: Subscription[] = [];
  user: Claims | undefined;

  private windowResizeTimeout: any | undefined;

  constructor(private msalService: MsalService, private mediaObserver: MediaObserver,
    private userPreferencesService: UserPreferencesService,
    private authService: AuthService, private translateService: TranslateService, private accessService: AccessService,
    private hubService: HubService,
    private pushSubscriptionsService: PushSubscriptionsService,
    private swPush: SwPush,
    private eventsService: EventsService,
    private updateService: UpdateService,
    private localeService: LocaleService,
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.initHub();

    this.initUserPreferences();

    this.initMediaObserver();

    this.initEvents();
  }


  ngAfterViewInit() {
    this.stateService.set('contentHeight', Math.floor(this.drawerContent.nativeElement.clientHeight));
    window.addEventListener('resize', this.onWindowResize);
  }
  private onWindowResize = () => {
    if (this.windowResizeTimeout != null) {
      clearTimeout(this.windowResizeTimeout);
    }
    this.windowResizeTimeout = setTimeout(() => {
      this.stateService.set('contentHeight', Math.floor(this.drawerContent.nativeElement.clientHeight));
    }, 500);
  };

  private initEvents() {
    this._destroy.push(
      this.eventsService.subscribe(Events.ScrollPageToTop).subscribe(() => {
        this.drawerContent.nativeElement.scrollTop = 0;
      })
    );
  }

  private initMediaObserver() {
    this._destroy.push(
      this.mediaObserver.asObservable().subscribe(() => {
        this.isMobile = this.mediaObserver.isActive('xs');
      })
    );
  }

  private initUserPreferences() {
    this._destroy.push(this.userPreferencesService.userPreferences.subscribe(up => {
      if (up.useDarkTheme) {
        document.body.classList.add('theme-alternate');
      } else {
        document.body.classList.remove('theme-alternate');
      }
      const newLang = up.preferredLanguage == null ? (this.translateService.getBrowserLang() || environment.defaultLanguage) : up.preferredLanguage;
      if (newLang !== this.translateService.currentLang) {
        this.translateService.use(newLang);
      }
      this.localeService.initLocale(newLang, newLang);
    }));
  }

  private initHub() {
    this._destroy.push(
      this.authService.user.subscribe(u => {
        this.user = u;
        if (this.user != null) {
          this.hubService.start().subscribe();
          this.initPush();
          this.userPreferencesService.read().subscribe();
        } else {
          this.hubService.stop().subscribe();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.authService.destroy();
    this._destroy.forEach(x => x.unsubscribe());
    window.removeEventListener('resize', this.onWindowResize);
  }

  private initPush() {
    if (!this.swPush.isEnabled) {
      return;
    }
    this.swPush.subscription.subscribe(currentSub => {
      if (currentSub == null) {
        this.swPush.requestSubscription({
          serverPublicKey: environment.publicvapidkey
        }).then(ps => {
          this.pushSubscriptionsService.addPushSubscription({
            userId: this.user?.id,
            subscriptionJson: JSON.stringify(ps.toJSON())
          }).subscribe();
        });
      }
    });
  }
}
