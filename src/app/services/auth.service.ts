import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public static logStore: string | null = null;
  loggedIn = false;
  private readonly _destroying$ = new Subject<void>();
  private readonly userSubject: BehaviorSubject<AccountInfo | null>;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer) {
      this.userSubject = new BehaviorSubject<AccountInfo | null>(authService.instance.getActiveAccount());
    }

  updateLoggedInStatus() {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoggedIn();
        this.checkAndSetActiveAccount();
      });
  }

  private checkAndSetActiveAccount() {
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
    this.userSubject.next(this.authService.instance.getActiveAccount());
  }

  private setLoggedIn() {
    this.loggedIn = this.authService.instance.getAllAccounts().length > 0;
  }

  get user() {
    return this.userSubject.asObservable();
  }

  logout() {
    return this.authService.logoutRedirect({
      onRedirectNavigate: (url) => {
        this.userSubject.next(null);
        return false;
      }
    });
  }

  getProfilePhoto() {
    return this.httpClient.get('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
      headers: { 'Content-Type': 'image/*' },
      responseType: 'arraybuffer'
    }).pipe(
      map(data => {
        const TYPED_ARRAY: any = new Uint8Array(data);
        // converts the typed array to string of characters
        const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);

        //converts string of characters to base64String
        let base64String = btoa(STRING_CHAR);

        return this.sanitizer.bypassSecurityTrustUrl(
          'data:image/*;base64, ' + base64String
        );
      })
    );
  }


  destroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
