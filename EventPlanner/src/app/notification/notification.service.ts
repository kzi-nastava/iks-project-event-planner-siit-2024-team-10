import { Injectable } from '@angular/core';
import { AppNotification } from './model/notification.model'
import { Observable, of } from 'rxjs';

const NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    title: 'New Rating',
    content: 'User1 has rated your event "Concert at the Park" 4 stars.',
    date: new Date('2024-11-01T12:00:00'),
    isRead: false,
  },
  {
    id: 2,
    title: 'New Comment',
    content: 'User2 has commented on your event "Charity Run". "Looking forward to it!"',
    date: new Date('2024-11-02T14:00:00'),
    isRead: false,
  },
  {
    id: 3,
    title: 'New Rating',
    content: 'User3 has rated your event "Music Festival" 5 stars.',
    date: new Date('2024-11-03T16:00:00'),
    isRead: true,
  },
  {
    id: 4,
    title: 'Service Reminder',
    content: 'Reminder: The service "Live Band" is due 1 hour.',
    date: new Date('2024-11-04T10:00:00'),
    isRead: true,
  },
  {
    id: 5,
    title: 'New Comment',
    content: 'User4 has commented on your event "Outdoor Movie Night". "Can’t wait for the movie to start!"',
    date: new Date('2024-11-05T18:30:00'),
    isRead: true,
  },
  {
    id: 6,
    title: 'New Rating',
    content: 'User5 has rated your event "Food Festival" 3 stars.',
    date: new Date('2024-11-06T09:00:00'),
    isRead: true,
  },
  {
    id: 7,
    title: 'New Rating',
    content: 'User6 has rated your event "Holiday Party" 2 stars.',
    date: new Date('2024-11-07T11:30:00'),
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
