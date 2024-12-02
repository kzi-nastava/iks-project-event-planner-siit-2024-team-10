import { Component, OnInit } from '@angular/core';
import { AppNotification } from '../model/notification.model';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.css'
})
export class NotificationsPageComponent implements OnInit {
  notifications: AppNotification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.notificationService.getAll().subscribe((data) => {
      this.notifications = data;
    });
  }
}
