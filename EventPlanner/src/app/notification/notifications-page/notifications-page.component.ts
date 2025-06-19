import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppNotification } from '../model/notification.model';
import { NotificationService } from '../notification.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { Subscription } from 'rxjs';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.css'
})
export class NotificationsPageComponent implements OnInit, OnDestroy  {
  notifications: AppNotification[] = [];
  accountId: number;
  noNotificationsMessage :string;
  notificationPageProperties = {
    page: 0,
    pageSize: 5,
    totalPages: 0,
    totalElements: 0
  };

    private notificationSubscription: Subscription;

  constructor(private notificationService: NotificationService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.accountId = this.authService.getAccountId();
    this.fetchNotifications();

    this.notificationService.connectToNotificationSocket(this.accountId);

    this.notificationSubscription = this.notificationService.notifications$.subscribe((updated) => {
      this.notifications = updated;
      this.noNotificationsMessage = this.notifications.length ? '' : 'No notifications to show.';
    });
  }

  fetchNotifications(): void {
    const { page, pageSize } = this.notificationPageProperties;
    this.notificationService.getAll(page, pageSize, this.accountId).subscribe({
      next: (response) => {
        this.notifications = response.content;
        this.notificationPageProperties.totalPages = response.totalPages;
        this.notificationPageProperties.totalElements = response.totalElements;
        this.noNotificationsMessage = this.notifications.length ? '' : 'No notifications to show.';
      },
      error:() =>{
        this.noNotificationsMessage = 'An error occurred while fetching events.';
      }
    });
  }
  nextPage(): void {
    if (this.notificationPageProperties.page < this.notificationPageProperties.totalPages - 1) {
      this.notificationPageProperties.page++;
      this.fetchNotifications();
    }
  }
  previousPage(): void {
    if (this.notificationPageProperties.page > 0) {
      this.notificationPageProperties.page--;
      this.fetchNotifications();
    }
  }
  ngOnDestroy(): void {
    this.notificationSubscription?.unsubscribe();
    const unread = this.notifications.some(n => !n.read);
    if (unread) {
      this.notificationService.readAll(this.accountId).subscribe();
    }
  }
}
