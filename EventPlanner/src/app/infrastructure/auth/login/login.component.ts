import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../user/user.service';
import {LoginRequestDto} from '../model/login-request-dto.model';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {LoginResponseDTO} from '../model/login-response-dto.model';

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

  constructor(private authService:AuthService, private router:Router) {}

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
          this.router.navigate(['home'])
        },
        error:(err)=>{
          this.invalidCredentials = true;
        }
      })
    }

  }
}
