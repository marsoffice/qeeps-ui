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

  constructor( private mediaObserver: MediaObserver,translate: TranslateService) {
    translate.setDefaultLang('ro');
    const localStorageLanguage = localStorage.getItem('lang');
    translate.use(localStorageLanguage == null ? translate.getBrowserLang() : localStorageLanguage);
  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

  }

  ngOnDestroy(): void {
    this._destroy.forEach(x => x.unsubscribe());
  }
}
