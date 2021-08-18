import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PushSubscriptionDto } from '../models/push-subscription.dto';

@Injectable({
  providedIn: 'root'
})
export class PushSubscriptionsService {

  constructor(private http: HttpClient) { }

  addPushSubscription(model: PushSubscriptionDto) {
    return this.http.post(`/api/notifications/pushSubscriptions/add`, model);
  }

  deletePushSubscription(model: PushSubscriptionDto) {
    return this.http.post(`/api/notifications/pushSubscriptions/delete`, model);
  }
}
