import { Component, Input } from '@angular/core';
import { AppNotification } from '../model/notification.model';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent {
  @Input()
  notification: AppNotification;

}
