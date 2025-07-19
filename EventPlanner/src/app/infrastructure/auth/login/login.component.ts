import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../user/user.service';
import {LoginRequestDto} from '../model/login-request-dto.model';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginResponseDTO} from '../model/login-response-dto.model';
import { NotificationService } from '../../../notification/notification.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])});
  invalidCredentials=false;
  inviteToken: string;
  suspensionMessage: string | null = null;

  constructor(private authService:AuthService, private router:Router, private route: ActivatedRoute, private notificationService: NotificationService, private dialog: MatDialog) {}

    ngOnInit(): void{
      this.inviteToken = this.route.snapshot.queryParamMap.get('invitation-token');
    }

  login(){
    if(this.loginForm.valid){
      const loginRequest: LoginRequestDto = {
        email: this.loginForm.value.email || "",
        password: this.loginForm.value.password || ""
      }
      this.authService.login(loginRequest).subscribe({
        next: (response: LoginResponseDTO) => {
          localStorage.setItem('user', response.accessToken);
          this.authService.setUser()

          const accountId = this.authService.getAccountId();
          this.notificationService.connectToNotificationSocket(accountId);
          if (this.inviteToken) {
            this.router.navigate(['/accept-invite'], {
              queryParams: { 'invitation-token': this.inviteToken }
            });
          } else {
            this.router.navigate(['home']);
          }
        },
        error: (err) => {
          this.invalidCredentials = false;
          this.suspensionMessage = null;

          if (err.error?.includes("suspended")) {
            this.suspensionMessage = err.error.replace(/\n/g, '<br>');
          } else {
            this.invalidCredentials = true;
          }
        }
      })
      console.log(this.authService.getUserId)
    }

  }
}
