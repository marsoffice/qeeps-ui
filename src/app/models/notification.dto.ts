import { Severity } from './severity';

export interface NotificationDto {
  id: string;
  userId: string;
  message: string;
  title: string;
  absoluteRouteUrl?: string;
  isRead: boolean;
  severity: Severity;
  createdDate: string;
  readDate?: string;
}
