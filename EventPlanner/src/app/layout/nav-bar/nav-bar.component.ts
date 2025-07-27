import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../infrastructure/auth/auth.service';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {
  role: string = '';
  hasUnreadNotifications: boolean = false;
  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.authService.userState.subscribe((result) => {
      this.role = result;
    })

    if(this.notificationService.hasUnreadNotifications){
      this.hasUnreadNotifications = true;
    }

    this.notificationService.hasUnreadNotifications$.subscribe(
      (hasUnread) => {
        this.hasUnreadNotifications = hasUnread;
      }
    );
  }
  onNotificationClick(): void{
    this.hasUnreadNotifications = false;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.authService.setUser();
    this.notificationService.disconnectSocket();
    this.router.navigate(['login']);
  }

}
