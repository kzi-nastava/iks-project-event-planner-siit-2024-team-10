import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivateComponent} from './activate/activate.component';
import { NotificationService } from '../../notification/notification.service';



@NgModule({
  declarations: [
    ActivateComponent
  ],
  imports: [
    CommonModule,
    NotificationService
  ]
})
export class AuthModule { }
