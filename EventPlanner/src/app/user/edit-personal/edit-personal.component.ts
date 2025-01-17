import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatchValidator} from '../../infrastructure/auth/register/register.component';
import { AuthService } from '../../infrastructure/auth/auth.service';
import {UserService} from '../user.service';
import {GetUserDTO} from '../model/get-user-dto.model';

@Component({
  selector: 'app-edit-personal',
  templateUrl: './edit-personal.component.html',
  styleUrl: './edit-personal.component.css'
})
export class EditPersonalComponent implements OnInit{
  editForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      street: new FormControl('',Validators.required),
      houseNumber: new FormControl('',Validators.required),
      phone: new FormControl('', Validators.required),
    });
  snackBar:MatSnackBar = inject(MatSnackBar);

  constructor(private authService:AuthService,
              private userService:UserService,) {}

  ngOnInit() {
    this.userService.getUser(this.authService.getAccountId()).subscribe({
      next: (user:GetUserDTO) => {
        this.editForm.patchValue(
          {firstName: user.firstName,
          lastName: user.lastName,
          country: user.location?.country,
          city: user.location?.city,
          street: user.location?.street,
          houseNumber: user.location?.houseNumber,
          phone: user.phoneNumber}
        )
      },
      error: (err) => {
        this.snackBar.open('Error fetching account details','OK',{duration:5000});
        console.error('Error fetching account details:', err);
      }
    });
  }
}
