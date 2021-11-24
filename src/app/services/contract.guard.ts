import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserProfileService } from './user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class ContractGuard implements CanActivate {
  constructor(private router: Router, private userProfileService: UserProfileService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userProfileService.profile.pipe(
      map(x => {
        if (!x.hasSignedContract) {
          this.router.navigate(['contract']);
          return false;
        }
        return true;
      })
    );
  }

}
