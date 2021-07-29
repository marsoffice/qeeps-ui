import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
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
        const jwt = request.headers.get('authorization');
        if (user != null && jwt != null) {
          let headers = request.headers;
          headers = headers.append( 'X-MS-CLIENT-PRINCIPAL-IDP', 'aad');
          headers = headers.append( 'X-MS-CLIENT-PRINCIPAL', jwt as string);
          headers = headers.append( 'X-MS-CLIENT-PRINCIPAL-ID', user.localAccountId);
          headers = headers.append( 'X-MS-CLIENT-PRINCIPAL-NAME', user.name as string);
          const newRequest = request.clone({headers: headers});
          return next.handle(newRequest);
        }
        return next.handle(request);
      })
    );
  }
}
