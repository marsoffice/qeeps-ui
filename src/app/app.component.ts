import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

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
  user: AccountInfo | null = null;

  constructor(private msalService: MsalService, private mediaObserver: MediaObserver, private authService: AuthService, translate: TranslateService) {
    translate.setDefaultLang('ro');
    const localStorageLanguage = localStorage.getItem('lang');
    translate.use(localStorageLanguage == null ? translate.getBrowserLang() : localStorageLanguage);
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
  }

  ngOnDestroy(): void {
    this.authService.destroy();
    this._destroy.forEach(x => x.unsubscribe());
  }
}
