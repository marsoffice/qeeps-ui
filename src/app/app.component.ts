import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { MsalService } from '@azure/msal-angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Claims } from './models/claims';
import { AccessService } from './services/access.service';
import { AuthService } from './services/auth.service';
import { HubService } from './services/hub.service';
import { PushSubscriptionsService } from './services/push-subscriptions.service';
import { UserPreferencesService } from './services/user-preferences.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isIframe = false;
  loginDisplay = false;
  isMobile = false;
  private _destroy: Subscription[] = [];
  user: Claims | null = null;

  constructor(private msalService: MsalService, private mediaObserver: MediaObserver,
    private userPreferencesService: UserPreferencesService,
    private authService: AuthService, private translateService: TranslateService, private accessService: AccessService,
    private hubService: HubService,
    private updates: SwUpdate,
    private pushSubscriptionsService: PushSubscriptionsService,
    private swPush: SwPush
  ) {
  }

  ngOnInit(): void {
    if (this.updates.isEnabled) {
      this.updates.checkForUpdate().then(() => { });
      this.updates.available.subscribe(() => {
        this.updates.activateUpdate().then(() => {
          location.reload();
        });
      });
    }

    this.isIframe = window !== window.parent && !window.opener;
    this.authService.updateLoggedInStatus(() => {
      this._destroy.push(
        this.authService.user.subscribe(u => {
          this.user = u;
          if (this.user != null) {
            this.hubService.start().subscribe();
            this.initPush();
          } else {
            this.hubService.stop().subscribe();
          }
        })
      );

      this._destroy.push(this.userPreferencesService.userPreferences.subscribe(up => {
        if (up.useDarkTheme) {
          document.body.classList.add('theme-alternate');
        } else {
          document.body.classList.remove('theme-alternate');
        }
        const newLang = up.preferredLanguage == null ? this.translateService.getBrowserLang() : up.preferredLanguage;
        this.translateService.use(newLang);
      }));
    });


    this._destroy.push(
      this.mediaObserver.asObservable().subscribe(() => {
        this.isMobile = this.mediaObserver.isActive('xs');
      })
    );
  }

  ngOnDestroy(): void {
    this.authService.destroy();
    this._destroy.forEach(x => x.unsubscribe());
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
        return;
      }
    });
  }
}
