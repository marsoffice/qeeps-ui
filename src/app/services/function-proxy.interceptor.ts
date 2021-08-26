import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FunctionProxyInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (environment.usefunctionproxy === 'false') {
      return next.handle(request);
    }
    if (!request.headers.has('Authorization')) {
      return next.handle(request);
    }
    let newHeaders = new HttpHeaders();
    for (const key of request.headers.keys()) {
      if (key === 'Authorization') {
        newHeaders = newHeaders.append('XAuthorization', request.headers.get(key)!);
        continue;
      }
      newHeaders = newHeaders.append(key, request.headers.get(key)!);
    }
    const clone = request.clone({
      headers: newHeaders
    });
    return next.handle(clone);
  }
}
