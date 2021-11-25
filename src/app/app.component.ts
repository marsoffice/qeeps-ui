import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { MsalService } from '@azure/msal-angular';
import { TranslateService } from '@ngx-translate/core';
import { interval, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Claims } from './models/claims';
import { AccessService } from './services/access.service';
import { AuthService } from './services/auth.service';
import { HubService } from './services/hub.service';
import { PushSubscriptionsService } from './services/push-subscriptions.service';
import { UserPreferencesService } from './services/user-preferences.service';
import { ToastService } from './shared/toast/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isIframe = false;
  loginDisplay = false;
  isMobile = true;
  private _destroy: Subscription[] = [];
  user: Claims | null = null;
  private checkUpdateInterval: Observable<number>;

  constructor(private msalService: MsalService, private mediaObserver: MediaObserver,
    private userPreferencesService: UserPreferencesService,
    private authService: AuthService, private translateService: TranslateService, private accessService: AccessService,
    private hubService: HubService,
    private pushSubscriptionsService: PushSubscriptionsService,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private toastService: ToastService
  ) {
    this.checkUpdateInterval = interval(15 * 60 * 1000);
  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
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


    this._destroy.push(this.userPreferencesService.userPreferences.subscribe(up => {
      if (up.useDarkTheme) {
        document.body.classList.add('theme-alternate');
      } else {
        document.body.classList.remove('theme-alternate');
      }
      const newLang = up.preferredLanguage == null ? (this.translateService.getBrowserLang() || environment.defaultLanguage) : up.preferredLanguage;
      this.translateService.use(newLang);
    }));

    if (this.swUpdate.isEnabled) {
      this.updatePwa();
      this._destroy.push(
        this.checkUpdateInterval.subscribe(() => {
          this.updatePwa();
        })
      );
    }

    this._destroy.push(
      this.mediaObserver.asObservable().subscribe(() => {
        this.isMobile = this.mediaObserver.isActive('xs');
      })
    );
  }

  updatePwa() {
    this.swUpdate.checkForUpdate().then(e => {
      if (e) {
        this.swUpdate.activateUpdate().then(e2 => {
          if (e2) {
            this.toastService.showInfo(this.translateService.instant('ui.update.updateIsAvailable'));
            setTimeout(() => {
              location.reload();
            }, 1000);
          }
        });
      }
    });
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
      }
    });
  }
}
