import {Component, inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../infrastructure/auth/auth.service';
import {ChangePasswordDto} from '../model/change-password-dto.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  passwordForm: FormGroup= new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  },
    { validators: MatchValidator('newPassword', 'confirmPassword') });
  errorMessage:string;
  snackBar:MatSnackBar = inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private userService:UserService,
    private authService:AuthService,
    private router:Router
  ){}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if(!this.passwordForm.valid)
      return;
    const changePasswordDto:ChangePasswordDto={
      oldPassword:this.passwordForm.value.oldPassword,
      newPassword:this.passwordForm.value.newPassword
    }
    this.userService.changePassword(this.authService.getAccountId(), changePasswordDto).subscribe({
      next: () => {
        this.snackBar.open('Successfully changed password!','OK',{duration:5000});
        localStorage.removeItem('user');
        this.authService.setUser();
        this.router.navigate(['/login'])
        this.dialogRef.close();
      },
      error: (err) => {
        this.errorMessage=err.error;
        this.passwordForm.controls['oldPassword'].setErrors({"incorrect-old-password":true});
      },
    });
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
