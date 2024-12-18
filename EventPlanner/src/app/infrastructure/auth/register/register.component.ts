import {Component} from '@angular/core';
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
import {Provider} from '../../../user/model/provider.model'
import {Organizer} from '../../../user/model/organizer.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
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
  },
    { validators: MatchValidator('password', 'confirmPassword') });

  constructor(private userService: UserService) {}

  companyInfoRequired(): boolean {
    return this.registerForm.get('role')?.value === 'provider';
  }

  register() {

    if(this.companyInfoRequired()){
      if(!this.registerForm.valid)
        return;
      const provider:Provider ={
        _id: Math.random(),
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        profilePhoto: this.registerForm.value.profilePhoto,
        country: this.registerForm.value.country,
        city: this.registerForm.value.city,
        street: this.registerForm.value.street,
        houseNumber: this.registerForm.value.houseNumber,
        phone: this.registerForm.value.phone,
        companyEmail: this.registerForm.value.companyEmail,
        companyName: this.registerForm.value.companyName,
        companyCountry: this.registerForm.value.companyCountry,
        companyCity: this.registerForm.value.companyCity,
        companyStreet: this.registerForm.value.companyStreet,
        companyHouseNumber: this.registerForm.value.companyHouseNumber,
        companyPhone: this.registerForm.value.companyPhone,
        companyDescription: this.registerForm.value.companyDescription,
        companyPhotos: this.registerForm.value.companyPhotos
      };
      this.userService.registerProvider(provider);
    }
    else{
      if(!this.isOrganizerFormValid())
        return;
      const organizer:Organizer ={
        _id: Math.random(),
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        profilePhoto: this.registerForm.value.profilePhoto,
        country: this.registerForm.value.country,
        city: this.registerForm.value.city,
        street: this.registerForm.value.street,
        houseNumber: this.registerForm.value.houseNumber,
        phone: this.registerForm.value.phone,
      };
      this.userService.registerOrganizer(organizer);
    }
  }

  isOrganizerFormValid():boolean{
    const fieldNames:string[]=['email','password','firstName','lastName','profilePhoto','country','city','street'];
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
