import { Injectable } from '@angular/core';
import {
  DefaultHttpClient,
  HttpRequest,
  HubConnection, HubConnectionBuilder, IRetryPolicy, JsonHubProtocol, LogLevel, MessageHeaders, RetryContext
} from '@microsoft/signalr';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { firstValueFrom, from, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

class CustomRetryPolicy implements IRetryPolicy {
  nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null {
    return Math.random() * 1000 + 2000;
  }
}

export class SignalrObservableWrapper<T> {
  constructor(private obs: Observable<T>, private event: string, private fctRef: any, private connection: HubConnection) {

  }

  get observable() {
    return this.obs;
  }

  kill() {
    this.connection.off(this.event, this.fctRef);
  }
}

class CustomHttpClient extends DefaultHttpClient {
  constructor() {
    super(new ConsoleLogger(environment.production ? LogLevel.None : LogLevel.Information));
  }

  send(request: HttpRequest) {
    if (environment.production && request.headers != null && request.headers['Authorization'] != null && request.url?.includes(window.location.origin)) {
      request.headers['x-authorization'] = request.headers['Authorization'];
      delete request.headers['Authorization'];
    }
    return super.send(request);
  }
}


@Injectable({
  providedIn: 'root'
})
export class HubService {
  private connection: HubConnection | undefined;

  constructor(private authService: AuthService) {
    this.authService.user.pipe(
      filter(x => x != null)
    ).subscribe(u => {
      let msgHeaders: MessageHeaders = {};

      if (!environment.production) {
        msgHeaders['x-ms-client-principal-id'] = u!.id;
      }

      this.connection = new HubConnectionBuilder()
        .withUrl('/api/access/signalr', {
          headers: msgHeaders,
          httpClient: new CustomHttpClient(),
          accessTokenFactory: () => {
            return firstValueFrom(this.authService.getAccessToken());
          }
        })
        .withAutomaticReconnect(new CustomRetryPolicy())
        .withHubProtocol(new JsonHubProtocol())
        .configureLogging(environment.production ? LogLevel.None : LogLevel.Debug)
        .build();
    });
  }

  start() {
    if (this.connection == null) {
      return of<void>();
    }
    let startObs = of<void>();
    if (this.connection!.state === 'Connected') {
      startObs = this.stop();
    }
    return startObs.pipe(
      switchMap(() => from(this.connection!.start()))
    );
  }

  stop() {
    if (this.connection == null) {
      return of<void>();
    }
    return from(
      this.connection.stop()
    );
  }

  subscribe<T>(event: string) {
    const subject = new Subject<T>();
    const obs = subject.asObservable();
    const fctRef = (p: any) => {
      subject.next(this.toCamelCase(p));
    };
    this.connection!.on(event, fctRef);
    return new SignalrObservableWrapper(obs, event, fctRef, this.connection!);
  }

  publish<T>(methodName: string, model: T) {
    return from(this.connection!.send(methodName, model));
  }

  rpc<T, TR>(methodName: string, model: T) {
    return from(this.connection!.invoke(methodName, model)).pipe(map(x => x as TR));
  }

  private toCamelCase(p: any): any {
    const keys = Object.keys(p);
    const newObj: any = {};
    for (const key of keys) {
      newObj[key.charAt(0).toLowerCase() + key.substring(1)] = p[key];
    }
    return newObj;
  }
}
