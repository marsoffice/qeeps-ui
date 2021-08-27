import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationsDto } from '../models/notifications.dto';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private markAsReadSubject = new Subject<string>();

  constructor(private http: HttpClient) { }

  get(page: number, elementsPerPage: number) {
    return this.http.get<NotificationsDto>(`/api/notifications/all?page=${page}&elementsPerPage=${elementsPerPage}`);
  }

  markAsRead(notificationId: string, emit = false) {
    return this.http.put(`/api/notifications/${notificationId}/markAsRead`, null).pipe(
      tap(() => {
        if (emit) {
          this.markAsReadSubject.next(notificationId);
        }
      })
    );
  }

  markAllAsRead() {
    return this.http.put(`/api/notifications/markAllAsRead`, null);
  }

  get markAsReadExternal() {
    return this.markAsReadSubject.asObservable();
  }
}
