import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class EasyAuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authService.user.pipe(
      switchMap(user => {
        if (user != null) {
          const claims = {
            auth_typ: 'aad',
            claims: [
              {
                typ: 'name',
                val: user.name
              },
              {
                typ: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
                val: user.email
              },
              {
                typ: 'http://schemas.microsoft.com/identity/claims/objectidentifier',
                val: user.id
              }
            ]
          };
          if (user.roles != null) {
            for (let role of user.roles) {
              claims.claims.push({
                typ: 'roles',
                val: role
              });
            }
          }
          if (user.groups != null) {
            for (let group of user.groups) {
              claims.claims.push({
                typ: 'groups',
                val: group
              });
            }
          }

          const b64Principal = btoa(JSON.stringify(claims));
          let headers = request.headers;
          headers = headers.append( 'X-MS-CLIENT-PRINCIPAL-IDP', 'aad');
          headers = headers.append( 'X-MS-CLIENT-PRINCIPAL', b64Principal);
          headers = headers.append( 'X-MS-CLIENT-PRINCIPAL-ID', user.id);
          headers = headers.append( 'X-MS-CLIENT-PRINCIPAL-NAME', user.name as string);
          const newRequest = request.clone({headers: headers});
          return next.handle(newRequest);
        }
        return next.handle(request);
      })
    );
  }
}
