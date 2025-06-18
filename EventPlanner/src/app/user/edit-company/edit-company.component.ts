import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../infrastructure/auth/auth.service';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {GetUserDTO} from '../model/get-user-dto.model';
import {UpdateCompanyDTO} from '../model/update-company-dto.model';
import {UpdatedCompanyDTO} from '../model/updated-company-dto.model';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.css'
})
export class EditCompanyComponent implements OnInit{
  editForm = new FormGroup({
    companyCountry: new FormControl('', Validators.required),
    companyCity: new FormControl('', Validators.required),
    companyStreet: new FormControl('',Validators.required),
    companyHouseNumber: new FormControl('',Validators.required),
    companyPhone: new FormControl('', Validators.required),
    companyDescription: new FormControl('',Validators.required),
  });

  snackBar:MatSnackBar = inject(MatSnackBar);

  constructor(private authService:AuthService,
              private userService:UserService,
              private router:Router)
  {}

  ngOnInit() {
    this.userService.getUser(this.authService.getAccountId()).subscribe({
      next: (user:GetUserDTO) => {
        this.editForm.patchValue(
          {companyCountry: user.company?.location?.country,
          companyCity: user?.company?.location?.city,
          companyStreet: user?.company?.location?.street,
          companyHouseNumber: user?.company?.location?.houseNumber,
            companyPhone: user?.company?.phoneNumber,
            companyDescription: user?.company?.description,
          }
        )
      },
      error: (err) => {
        this.snackBar.open('Error fetching account details','OK',{duration:5000});
        console.error('Error fetching account details:', err);
      }
    });
  }

  submit(){
    if(this.editForm.invalid)
      return;
    const company:UpdateCompanyDTO = {
      description:this.editForm.value.companyDescription,
      phoneNumber:this.editForm.value.companyPhone,
      location:{
        country:this.editForm.value.companyCountry,
        city:this.editForm.value.companyCity,
        street:this.editForm.value.companyStreet,
        houseNumber:this.editForm.value.companyHouseNumber
      }
    }
    this.userService.updateCompany(this.authService.getAccountId(),company).subscribe({
      next: (updatedCompany:UpdatedCompanyDTO) => {
        this.snackBar.open('Successfully updated company details!','OK',{duration:5000});
        this.router.navigate(['user-details']);
      },
      error: (err) => {
        this.snackBar.open('Error updating company details','OK',{duration:5000});
        console.error('Error updating company details', err);
      }
    });
  }
}
