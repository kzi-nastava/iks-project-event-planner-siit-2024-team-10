import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {UserService} from '../../../user/user.service';
import {CreateCompanyDTO} from '../model/create-company-dto.model';
import {RegisterDTO} from '../model/register-dto.model';
import {Organizer} from '../../../user/model/organizer.model';
import {LoginResponseDTO} from '../model/login-response-dto.model';
import {AuthService} from '../auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    profilePhoto: new FormControl(''),
    country: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    street: new FormControl('',Validators.required),
    houseNumber: new FormControl('',Validators.required),
    phone: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    companyEmail: new FormControl('', [Validators.required, Validators.email]),
    companyName: new FormControl('', Validators.required),
    companyCountry: new FormControl('', Validators.required),
    companyCity: new FormControl('', Validators.required),
    companyStreet: new FormControl('',Validators.required),
    companyHouseNumber: new FormControl('',Validators.required),
    companyPhone: new FormControl('', Validators.required),
    companyDescription: new FormControl('',Validators.required),
    companyPhotos: new FormControl('')
  },
    { validators: MatchValidator('password', 'confirmPassword') });
  snackBar:MatSnackBar = inject(MatSnackBar);
  roleUpgrade:boolean;

  constructor(
    private authService:AuthService,
    private router:Router) {}

  ngOnInit():void{
    this.roleUpgrade=this.authService.getEmail()!=null;
    if(this.roleUpgrade){
      this.registerForm.removeControl('password');
      this.registerForm.removeControl('confirmPassword');
      this.registerForm.patchValue({email: this.authService.getEmail()});
      this.registerForm.clearValidators();
    }
  }

  companyInfoRequired(): boolean {
    return this.registerForm.get('role')?.value === 'provider';
  }

  register() {
    let company:CreateCompanyDTO=null;
    if(this.companyInfoRequired()){
      if(!this.registerForm.valid)
        return;
      company={
        email: this.registerForm.value.companyEmail,
        name: this.registerForm.value.companyName,
        location:
          {country: this.registerForm.value.companyCountry,
          city: this.registerForm.value.companyCity,
          street: this.registerForm.value.companyStreet,
          houseNumber: this.registerForm.value.companyHouseNumber
          },
        phoneNumber: this.registerForm.value.companyPhone,
        description: this.registerForm.value.companyDescription,
        photos: this.registerForm.value.companyPhotos.split(" ")
      }
    }
    if(!this.isOrganizerFormValid())
      return;
    let registerDTO:RegisterDTO={
      email: this.registerForm.value.email,
      password: this.roleUpgrade? null : this.registerForm.value.password,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      profilePhoto: this.registerForm.value.profilePhoto,
      location:{
        country: this.registerForm.value.country,
        city: this.registerForm.value.city,
        street: this.registerForm.value.street,
        houseNumber: this.registerForm.value.houseNumber
      },
      phoneNumber: this.registerForm.value.phone,
      company:company,
      role:this.companyInfoRequired()?'PROVIDER':'EVENT_ORGANIZER'
    }

    this.authService.register(registerDTO,this.roleUpgrade).subscribe({
      next: (response: RegisterDTO) => {
        this.snackBar.open('Registration successful!','OK',{duration:5000});
        localStorage.removeItem('user');
        this.authService.setUser();
        this.router.navigate(['home'])
      },
      error:(err:HttpErrorResponse)=>{
        if(err.status===409)
          this.registerForm.controls.email.setErrors({'conflict':true})
      }
    })
  }

  isOrganizerFormValid():boolean{
    const fieldNames:string[]=['firstName','lastName','profilePhoto','country','city','street'];
    if(!this.roleUpgrade){
      fieldNames.push('email');
      fieldNames.push('password');
    }

    for(let fieldName of fieldNames){
      if(!this.registerForm.get(fieldName).valid)
        return false;
    }
    return true;
  }
}

export function MatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null; // Return null if controls are missing
    }

    if (matchingControl.errors && !matchingControl.errors['mismatch']) {
      return null; // Skip if another validator has found an error
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      matchingControl.setErrors(null); // Clear mismatch error if values match
    }

    return null;
  };
}
