import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountInfo } from '@azure/msal-browser';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private _destroy: Subscription[] = [];
  user: AccountInfo | null = null;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this._destroy.push(
      this.authService.user.subscribe(u => {
        this.user = u;
      })
    );
  }

  ngOnDestroy(): void {

  }

}
