import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-from-notification',
  templateUrl: './from-notification.component.html',
  styleUrls: ['./from-notification.component.scss']
})
export class FromNotificationComponent implements OnInit {

  constructor(private actRoute: ActivatedRoute, private notificationsService: NotificationsService,
    private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user.pipe(
      filter(x => x != null),
      take(1),
      switchMap(() => this.actRoute.queryParams),
      switchMap(qp => this.notificationsService.markAsRead(qp['nid']).pipe(
        map(() => qp['returnTo'])
      ))
    ).subscribe(returnTo => {
      this.router.navigateByUrl(returnTo);
    });
  }

}
