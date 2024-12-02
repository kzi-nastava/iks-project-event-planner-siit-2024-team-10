import { Injectable } from '@angular/core';
import { AppNotification } from './model/notification.model'
import { Observable, of } from 'rxjs';

const NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    title: 'New Rating',
    content: 'User1 has rated your notification "Event1" 4 stars.',
    date: new Date('2024-11-01T12:00:00'),
    isRead: false,
  },
  {
    id: 2,
    title: 'New Comment',
    content: 'User1 has commented on your notification.',
    date: new Date('2024-11-01T12:00:00'),
    isRead: false,
  },
  {
    id: 3,
    title: 'New Rating',
    content: 'User2 has rated your notification.',
    date: new Date('2024-11-01T12:00:00'),
    isRead: false,
  },
  {
    id: 4,
    title: 'New Comment',
    content: 'User4 has commented on your notification.',
    date: new Date('2024-11-01T12:00:00'),
    isRead: true,
  },
  {
    id: 5,
    title: 'New Rating',
    content: 'User5 has rated your notification.',
    date: new Date('2024-11-01T12:00:00'),
    isRead: true,
  },
];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationList: AppNotification[];

  constructor() {this.notificationList = [...NOTIFICATIONS];}

  getAll(): Observable<AppNotification[]> {
    return of(this.notificationList);
  }
}
