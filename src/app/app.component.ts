import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MsalService } from '@azure/msal-angular';
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

  constructor(private msalService: MsalService, private mediaObserver: MediaObserver, public authService: AuthService) {

  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    this.authService.updateLoggedInStatus();
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
}
