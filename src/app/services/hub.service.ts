import { Injectable } from '@angular/core';
import {
  HubConnection, HubConnectionBuilder, IRetryPolicy, JsonHubProtocol, LogLevel, RetryContext
} from '@microsoft/signalr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';


class CustomRetryPolicy implements IRetryPolicy {
  nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null {
    return 1000;
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
}
