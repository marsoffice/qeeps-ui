import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountInfo } from '@azure/msal-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isMobile = false;
  @Input() sidenav: MatDrawer | undefined;
  user: AccountInfo | null = null;
  private _destroy: Subscription[] = [];
  languages = environment.languages;
  photo: SafeUrl | null = null;

  constructor(private authService: AuthService, private router: Router, public translateService: TranslateService) { }

  ngOnInit(): void {
    this._destroy.push(
      this.authService.user.subscribe(u => {
        this.user = u;
        if (this.user == null) {
          return;
        }
        this.authService.getProfilePhoto().subscribe(p => {
          this.photo = p;
        });
      })
    );
  }

  ngOnDestroy(): void {
    this._destroy.forEach(x => x.unsubscribe());
  }

  toggleSidenav(): void {
    if (!this.sidenav) {
      return;
    }
    this.sidenav.toggle();
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/logged-out']);
    });
  }

  changeLanguage(lang: string): void {
    this.translateService.use(lang);
    localStorage.setItem('lang', lang);
  }
}
