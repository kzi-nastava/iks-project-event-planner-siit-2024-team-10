import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'getEmail', 'setUser']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        MatIconModule,
        MatSnackBarModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set roleUpgrade to false when no email exists', () => {
      authService.getEmail.and.returnValue(null);

      component.ngOnInit();

      expect(component.roleUpgrade).toBeFalsy();
      expect(component.registerForm.get('password')).toBeTruthy();
      expect(component.registerForm.get('confirmPassword')).toBeTruthy();
    });

    it('should set roleUpgrade to true and modify form when email exists', () => {
      authService.getEmail.and.returnValue('test@example.com');

      component.ngOnInit();

      expect(component.roleUpgrade).toBeTruthy();
      expect(component.registerForm.get('password')).toBeFalsy();
      expect(component.registerForm.get('confirmPassword')).toBeFalsy();
      expect(component.registerForm.get('email')?.value).toBe('test@example.com');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      authService.getEmail.and.returnValue(null);
      component.ngOnInit();
    });

    it('should be invalid when all fields are empty', () => {
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('should be invalid with invalid email format', () => {
      component.registerForm.patchValue({
        email: 'invalid-email',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        country: 'USA',
        city: 'New York',
        street: 'Main St',
        houseNumber: '123',
        phone: '1234567890',
        role: 'organizer'
      });

      expect(component.registerForm.get('email')?.valid).toBeFalsy();
      expect(component.registerForm.get('email')?.errors?.['email']).toBeTruthy();
    });

    it('should be invalid when password is too short', () => {
      component.registerForm.patchValue({
        password: '123',
        confirmPassword: '123'
      });

      expect(component.registerForm.get('password')?.valid).toBeFalsy();
      expect(component.registerForm.get('password')?.errors?.['minlength']).toBeTruthy();
    });

    it('should be invalid when passwords do not match', () => {
      component.registerForm.patchValue({
        password: 'password123',
        confirmPassword: 'password456'
      });

      expect(component.registerForm.errors?.['mismatch']).toBeTruthy();
    });

    it('should be valid with all required organizer fields filled correctly', () => {
      component.registerForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        country: 'USA',
        city: 'New York',
        street: 'Main St',
        houseNumber: '123',
        phone: '1234567890',
        role: 'organizer'
      });

      expect(component.isOrganizerFormValid()).toBeTruthy();
    });
  });

  describe('companyInfoRequired', () => {
    it('should return true when role is provider', () => {
      component.registerForm.patchValue({ role: 'provider' });

      expect(component.companyInfoRequired()).toBeTruthy();
    });

    it('should return false when role is organizer', () => {
      component.registerForm.patchValue({ role: 'organizer' });

      expect(component.companyInfoRequired()).toBeFalsy();
    });

    it('should return false when no role is selected', () => {
      component.registerForm.patchValue({ role: '' });

      expect(component.companyInfoRequired()).toBeFalsy();
    });
  });

  describe('isOrganizerFormValid', () => {
    beforeEach(() => {
      authService.getEmail.and.returnValue(null);
      component.ngOnInit();
    });

    it('should return false when required fields are missing', () => {
      component.registerForm.patchValue({
        firstName: '',
        lastName: 'Doe'
      });

      expect(component.isOrganizerFormValid()).toBeFalsy();
    });

    it('should return true when all organizer fields are valid', () => {
      component.registerForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        country: 'USA',
        city: 'New York',
        street: 'Main St',
        houseNumber: '123',
        phone: '1234567890'
      });

      expect(component.isOrganizerFormValid()).toBeTruthy();
    });

    it('should not check password fields when roleUpgrade is true', () => {
      authService.getEmail.and.returnValue('test@example.com');
      component.ngOnInit();

      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        country: 'USA',
        city: 'New York',
        street: 'Main St',
        houseNumber: '123',
        phone: '1234567890'
      });

      expect(component.isOrganizerFormValid()).toBeTruthy();
    });
  });

  describe('register', () => {
    beforeEach(() => {
      authService.getEmail.and.returnValue(null);
      component.ngOnInit();
    });

    it('should call authService.register with correct organizer data', () => {
      authService.register.and.returnValue(of(null));

      component.registerForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        country: 'USA',
        city: 'New York',
        street: 'Main St',
        houseNumber: '123',
        phone: '1234567890',
        role: 'organizer'
      });

      component.register();

      expect(authService.register).toHaveBeenCalledWith(
        jasmine.objectContaining({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'EVENT_ORGANIZER',
          company: null
        }),
        false
      );
    });

    it('should call authService.register with correct provider data including company', () => {
      authService.register.and.returnValue(of(null));

      component.registerForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        country: 'USA',
        city: 'New York',
        street: 'Main St',
        houseNumber: '123',
        phone: '1234567890',
        role: 'provider',
        companyEmail: 'company@example.com',
        companyName: 'Test Company',
        companyCountry: 'USA',
        companyCity: 'Boston',
        companyStreet: 'Business Ave',
        companyHouseNumber: '456',
        companyPhone: '0987654321',
        companyDescription: 'Test company description'
      });

      component.register();

      expect(authService.register).toHaveBeenCalledWith(
        jasmine.objectContaining({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'PROVIDER',
          company: jasmine.objectContaining({
            email: 'company@example.com',
            name: 'Test Company',
            description: 'Test company description'
          })
        }),
        false
      );
    });

    it('should show success message and navigate on successful registration', () => {
      authService.register.and.returnValue(of(null));

      component.registerForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        country: 'USA',
        city: 'New York',
        street: 'Main St',
        houseNumber: '123',
        phone: '1234567890',
        role: 'organizer'
      });

      component.register();

      expect(snackBar.open).toHaveBeenCalledWith('Registration successful!', 'OK', { duration: 5000 });
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });

    it('should set email conflict error on 409 response', () => {
      const errorResponse = new HttpErrorResponse({
        status: 409,
        statusText: 'Conflict'
      });
      authService.register.and.returnValue(throwError(() => errorResponse));

      component.registerForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        country: 'USA',
        city: 'New York',
        street: 'Main St',
        houseNumber: '123',
        phone: '1234567890',
        role: 'organizer'
      });

      component.register();

      expect(component.registerForm.controls.email.errors?.['conflict']).toBeTruthy();
    });

    it('should not call register when organizer form is invalid', () => {
      component.registerForm.patchValue({
        email: '',
        firstName: 'John'
      });

      component.register();

      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should not call register when provider form is invalid', () => {
      component.registerForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        country: 'USA',
        city: 'New York',
        street: 'Main St',
        houseNumber: '123',
        phone: '1234567890',
        role: 'provider',
        companyEmail: '' // Missing required company field
      });

      component.register();

      expect(authService.register).not.toHaveBeenCalled();
    });
  });

  describe('MatchValidator', () => {
    it('should return null when passwords match', () => {
      component.registerForm.patchValue({
        password: 'password123',
        confirmPassword: 'password123'
      });

      expect(component.registerForm.errors).toBeNull();
    });

    it('should return mismatch error when passwords do not match', () => {
      component.registerForm.patchValue({
        password: 'password123',
        confirmPassword: 'password456'
      });

      expect(component.registerForm.errors?.['mismatch']).toBeTruthy();
      expect(component.registerForm.get('confirmPassword')?.errors?.['mismatch']).toBeTruthy();
    });
  });

  describe('Role Upgrade', () => {
    it('should handle role upgrade registration correctly', () => {
      authService.getEmail.and.returnValue('existing@example.com');
      authService.register.and.returnValue(of(null));
      component.ngOnInit();

      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        country: 'USA',
        city: 'New York',
        street: 'Main St',
        houseNumber: '123',
        phone: '1234567890',
        role: 'organizer'
      });

      component.register();

      expect(authService.register).toHaveBeenCalledWith(
        jasmine.objectContaining({
          email: 'existing@example.com',
          password: null,
          firstName: 'John',
          lastName: 'Doe'
        }),
        true
      );
    });
  });
});
