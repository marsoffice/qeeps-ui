import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logged-out',
  templateUrl: './logged-out.component.html',
  styleUrls: ['./logged-out.component.scss']
})
export class LoggedOutComponent implements OnInit, OnDestroy {
  private _destroy: Subscription[] = [];
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this._destroy.push(
      this.authService.user.subscribe(u => {
        if (u != null) {
          this.router.navigate(['']);
        }
      })
    );
  }

  ngOnDestroy() {
    this._destroy.forEach(x => x.unsubscribe());
  }

}
