import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../infrastructure/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {
  role: string = '';
  hasUnreadNotifications: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.userState.subscribe((result) => {
      console.log(result);
      this.role = result;
    })
  }

  logout(): void {
    localStorage.removeItem('user');
    this.authService.setUser();
    this.router.navigate(['login']);
  }

}
