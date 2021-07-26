import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(private authService: MsalService) {

  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;


  }

  ngOnDestroy(): void {

  }
}
