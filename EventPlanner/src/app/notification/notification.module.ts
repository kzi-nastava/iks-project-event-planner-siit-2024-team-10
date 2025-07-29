import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationCardComponent } from './notification-card/notification-card.component';
import { NotificationsPageComponent } from './notifications-page/notifications-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    NotificationCardComponent,
    NotificationsPageComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggle
  ]
})
export class NotificationModule { }
