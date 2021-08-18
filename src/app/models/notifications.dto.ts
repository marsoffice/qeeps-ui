import { NotificationDto } from './notification.dto';

export interface NotificationsDto {
  total: number;
  unread: number;
  notifications: NotificationDto[];
}
