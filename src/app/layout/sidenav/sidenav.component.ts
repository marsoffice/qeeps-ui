import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Claims } from 'src/app/models/claims';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() sidenav: MatDrawer | null = null;
  @Input() user: Claims | null = null;
  constructor() { }

  ngOnInit(): void {
  }

  closeSidenavIfMobile() {
    if (this.sidenav?.mode === 'side') {
      return;
    }
    this.sidenav?.close();
  }
}
