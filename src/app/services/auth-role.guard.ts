import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRoleGuard implements CanActivate {

  constructor(private authService: AuthService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const roles: string[] = route.data.roles;
    if (roles == null || roles.length === 0) {
      return of(true);
    }
    return this.authService.user.pipe(
      map(u => {
        if (u == null) {
          return false;
        }
        const userRoles: string[] = u.roles;
        if (userRoles == null || userRoles.length === 0) {
          return false;
        }
        return userRoles.some(ur => roles.indexOf(ur) > -1);
      })
    );
  }

}
