import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Claims } from '../models/claims';
import { NotificationDto } from '../models/notification.dto';
import { Severity } from '../models/severity';
import { HubService, SignalrObservableWrapper } from '../services/hub.service';
import { NotificationsService } from '../services/notifications.service';
import { ToastService } from '../shared/toast/services/toast.service';

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
  severities = Severity;
  private _destroy: Subscription[] = [];
  private notificationsLoadedSub = new Subject<void>();

  constructor(private notificationsService: NotificationsService, private hubService: HubService,
    private toastService: ToastService, private router: Router) { }

  ngOnInit(): void {
    this.load();
    this.realTimeNotifObs = this.hubService.subscribe('notificationReceived');
    this.realTimeNotifObs.observable.subscribe(notif => {
      this.notifications = [notif, ...this.notifications];
      this.total++;
      this.unread++;
      let snackBar: Observable<void>;
      switch (notif.severity) {
        default:
        case Severity.Info:
          snackBar = this.toastService.showInfo(notif.message, notif.title);
          break;
        case Severity.Success:
          snackBar = this.toastService.showSuccess(notif.message, notif.title);
          break;
        case Severity.Warn:
          snackBar = this.toastService.showWarn(notif.message, notif.title);
          break;
        case Severity.Error:
          snackBar = this.toastService.showError(notif.message, notif.title);
          break;
      }
      snackBar.subscribe(() => {
        this.markAsRead(notif);
      });
    });

    this._destroy.push(
      this.notificationsLoadedSub.asObservable().pipe(
        take(1),
        switchMap(() => this.notificationsService.markAsReadExternal)
      ).subscribe(nid => {
        setTimeout(() => {
          if (this.notifications == null || this.notifications.length === 0) {
            return;
          }
          const foundNotif = this.notifications.find(x => x.id === nid);
          if (foundNotif != null) {
            foundNotif.isRead = true;
            this.unread--;
            if (this.unread < 0) {
              this.unread = 0;
            }
          }
        }, 10);
      }));
  }

  ngOnDestroy(): void {
    if (this.realTimeNotifObs != null) {
      this.realTimeNotifObs.kill();
    }
    this._destroy.forEach(s => s.unsubscribe());
  }

  notificationClicked(notif: NotificationDto, event: MouseEvent) {
    if (notif.absoluteRouteUrl == null) {
      event.stopPropagation();
      event.preventDefault();
    }
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
      this.notificationsLoadedSub.next();
    });
  }

  private markAsRead(notif: NotificationDto) {
    if (notif.absoluteRouteUrl) {
      this.router.navigateByUrl(notif.absoluteRouteUrl);
    }
    if (!notif.isRead) {
      this.unread--;
      notif.isRead = true;
      this.notificationsService.markAsRead(notif.id).subscribe();
    }
  }
}
