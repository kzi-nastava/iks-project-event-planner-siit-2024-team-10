import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    profilePhoto: new FormControl('',Validators.required),
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
  });

  comanyInfoRequired(): boolean {
    return this.registerForm.get('role')?.value === 'provider';
  }

}
