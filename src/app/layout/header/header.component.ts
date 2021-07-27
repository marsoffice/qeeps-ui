import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isMobile = false;
  @Input() sidenav: MatDrawer | undefined;
  private _destroy: Subscription[] = [];

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
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
}
