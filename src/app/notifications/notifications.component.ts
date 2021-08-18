import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Claims } from '../models/claims';
import { NotificationDto } from '../models/notification.dto';
import { HubService, SignalrObservableWrapper } from '../services/hub.service';
import { NotificationsService } from '../services/notifications.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Input() user: Claims | null = null;
  notifications: NotificationDto[] = [];
  total = 0;
  unread = 0;
  private currentPage = 1;
  private realTimeNotifObs: SignalrObservableWrapper<NotificationDto> | null = null;

  constructor(private notificationsService: NotificationsService, private hubService: HubService,
    private toastService: ToastService, private router: Router) { }

  ngOnInit(): void {
    this.load();
    this.realTimeNotifObs = this.hubService.subscribe('notificationReceived');
    this.realTimeNotifObs.observable.subscribe(notif => {
      this.notifications = [notif, ...this.notifications];
      this.total++;
      this.unread++;
      const snack = this.toastService.showInfo(`${notif.title} > ${notif.message}`);
      snack.onAction().subscribe(() => {
        this.markAsRead(notif);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.realTimeNotifObs != null) {
      this.realTimeNotifObs.kill();
    }
  }

  notificationClicked(notif: NotificationDto, event: MouseEvent) {
  //  if (notif.absoluteRouteUrl == null) {
      event.stopPropagation();
      event.preventDefault();
  //  }
    this.markAsRead(notif);
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.unread = 0;
    });
  }

  loadMore(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.currentPage++;
    this.load();
  }

  private load() {
    this.notificationsService.get(this.currentPage, environment.notificationsElementsPerPage).subscribe(dto => {
      this.total = dto.total;
      this.unread = dto.unread;
      this.notifications = [...this.notifications, ...dto.notifications];
    });
  }

  private markAsRead(notif: NotificationDto) {
    if (notif.absoluteRouteUrl) {
      this.router.navigateByUrl(notif.absoluteRouteUrl);
    }
    this.unread--;
    notif.isRead = true;
    this.notificationsService.markAsRead(notif.id).subscribe();
  }
}
