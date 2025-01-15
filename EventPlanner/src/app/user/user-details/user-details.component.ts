import {Component, inject, OnInit} from '@angular/core';
import { AuthService } from '../../infrastructure/auth/auth.service';
import {UserService} from '../user.service';
import {GetUserDTO} from '../model/get-user-dto.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  user:GetUserDTO;
  snackBar:MatSnackBar = inject(MatSnackBar)

  constructor(private authService:AuthService,
              private userService: UserService){

  }

  ngOnInit() {
    this.userService.getUser(this.authService.getAccountId()).subscribe({
      next: (user:GetUserDTO) => {
        this.user=user;
      },
      error: (err) => {
        this.snackBar.open('Error fetching account details','OK',{duration:5000});
        console.error('Error fetching account details:', err);
      }
    });
  }

  getRole():string{
    if(this.user?.role=='EVENT_ORGANIZER')
      return "EVENT ORGANIZER";
    else
      return this.user?.role;
  }

  getProfilePhoto():string{
    if(this.user?.profilePhoto==null)
      return "profile_photo.png"
    else
      return this.user?.profilePhoto;
  }

  hasPersonalDetails():boolean{
    return this.user?.role == "EVENT_ORGANIZER" || this.user?.role == "PROVIDER";
  }

  hasCompanyDetails():boolean{
    return this.user?.role == "PROVIDER";
  }

}
