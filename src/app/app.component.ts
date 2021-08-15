import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MsalService } from '@azure/msal-angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Claims } from './models/claims';
import { AccessService } from './services/access.service';
import { AuthService } from './services/auth.service';
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
    private authService: AuthService, private translate: TranslateService, private accessService: AccessService) {

  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    this.authService.updateLoggedInStatus();
    this._destroy.push(
      this.mediaObserver.asObservable().subscribe(() => {
        this.isMobile = this.mediaObserver.isActive('xs');
      })
    );
    this._destroy.push(
      this.authService.user.subscribe(u => {
        this.user = u;
      })
    );
    this._destroy.push(this.userPreferencesService.userPreferences.subscribe(up => {
      if (up.useDarkTheme) {
        document.body.classList.add('theme-alternate');
      } else {
        document.body.classList.remove('theme-alternate');
      }

      let lang = localStorage.getItem('lang');
      if (lang == null) {
        lang = up.preferredLanguage as (string | null);
      }
      this.translate.use(lang == null ? this.translate.getBrowserLang() : lang);
    }, () => {
      const localStorageLanguage = localStorage.getItem('lang');
      this.translate.use(localStorageLanguage == null ? this.translate.getBrowserLang() : localStorageLanguage);
    }));
  }

  ngOnDestroy(): void {
    this.authService.destroy();
    this._destroy.forEach(x => x.unsubscribe());
  }
}
