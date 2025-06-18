import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppNotification } from '../model/notification.model';
import { NotificationService } from '../notification.service';
import { AuthService } from '../../infrastructure/auth/auth.service';

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

  constructor(private notificationService: NotificationService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.accountId = this.authService.getAccountId();
    this.fetchNotifications();
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
    if (this.notifications.some(notification => !notification.read)) {
      this.notificationService.readAll(this.accountId).subscribe({
        next: () => {
          console.log('Notifications marked as read');
        },
        error: (error) => {
          console.error('Error marking notifications as read:', error);
        }
      });
    }
  }
}
