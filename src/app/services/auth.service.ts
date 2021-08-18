import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Claims } from '../models/claims';

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
    return this.userSubject.asObservable().pipe(
      map(x => {
        if (x == null) {
          return null;
        }
        return {
          id: x.localAccountId,
          email: x.username,
          name: x.name,
          groups: (x.idTokenClaims as any).groups,
          roles: (x.idTokenClaims as any).roles
        } as Claims;
      })
    );
  }

  logout() {
    return this.authService.logoutRedirect();
  }

  getProfilePhoto(size = 48) {
    return this.httpClient.get(`https://graph.microsoft.com/beta/me/photos/${size}x${size}/$value`, {
      headers: { 'Content-Type': 'image/*' },
      responseType: 'arraybuffer'
    }).pipe(
      map(data => {
        const TYPED_ARRAY: any = new Uint8Array(data);
        const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);
        let base64String = btoa(STRING_CHAR);
        return this.sanitizer.bypassSecurityTrustUrl(
          'data:image/*;base64, ' + base64String
        );
      })
    );
  }

  getAccessToken() {
    return this.authService.acquireTokenSilent({
      scopes: [environment.adclientid + '/.default'],
    }).pipe(
      map(x => x.accessToken)
    );
  }

  destroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
