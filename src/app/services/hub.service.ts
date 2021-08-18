import { Injectable } from '@angular/core';
import {
  HubConnection, HubConnectionBuilder, IRetryPolicy, JsonHubProtocol, LogLevel, RetryContext
} from '@microsoft/signalr';
import { from, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

class CustomRetryPolicy implements IRetryPolicy {
  nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null {
    return Math.random() * 1000;
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


@Injectable({
  providedIn: 'root'
})
export class HubService {
  private connection: HubConnection;

  constructor(private authService: AuthService) {
    this.connection = new HubConnectionBuilder()
      .withUrl('/api/access/signalr', {
        accessTokenFactory: () => {
          return this.authService.getAccessToken().toPromise();
        }
      })
      .withAutomaticReconnect(new CustomRetryPolicy())
      .withHubProtocol(new JsonHubProtocol())
      .configureLogging(environment.production ? LogLevel.None : LogLevel.Debug)
      .build();
  }

  start() {
    return from(
      this.connection.start()
    );
  }

  stop() {
    return from(
      this.connection.stop()
    );
  }

  subscribe<T>(event: string) {
    const subject = new Subject<T>();
    const obs = subject.asObservable();
    const fctRef = (p: any) => {
      subject.next(p);
    };
    this.connection.on(event, fctRef);
    return new SignalrObservableWrapper(obs, event, fctRef, this.connection);
  }

  publish<T>(methodName: string, model: T) {
    return from(this.connection.send(methodName, model));
  }

  rpc<T, TR>(methodName: string, model: T) {
    return from(this.connection.invoke(methodName, model)).pipe(map(x => x as TR));
  }
}
