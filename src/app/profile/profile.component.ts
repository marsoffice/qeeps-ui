import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Claims } from '../models/claims';
import { OrganisationDto } from '../models/organisation.dto';
import { AccessService } from '../services/access.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private _destroy: Subscription[] = [];
  user: Claims | null = null;
  userRoles: string[] | null = null;
  organisations: OrganisationDto[] | null = null;
  photo: SafeUrl | null = null;

  constructor(private authService: AuthService, private accessService: AccessService) { }

  ngOnInit(): void {
    this._destroy.push(
      this.authService.user.subscribe(u => {
        this.user = u;
        if (this.user != null) {
          this.userRoles = this.user.roles;
          //this.authService.getProfilePhoto(240).subscribe(s => {
            //this.photo = s;
          //});
        }
      })
    );
    this._destroy.push(
      this.accessService.organisationsTree().subscribe(o => {
        this.organisations = o;
      })
    );
  }

  ngOnDestroy(): void {
    this._destroy.forEach(x => x.unsubscribe());
  }
}
