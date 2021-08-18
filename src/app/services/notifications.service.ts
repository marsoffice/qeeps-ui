import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsDto } from '../models/notifications.dto';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) { }

  get(page: number, elementsPerPage: number) {
    return this.http.get<NotificationsDto>(`/api/notifications?page=${page}&elementsPerPage=${elementsPerPage}`);
  }

  markAsRead(notificationId: string) {
    return this.http.put(`/api/notifications/${notificationId}/markAsRead`, null);
  }

  markAllAsRead() {
    return this.http.put(`/api/notifications/markAllAsRead`, null);
  }
}
