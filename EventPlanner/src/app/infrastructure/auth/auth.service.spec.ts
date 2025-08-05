import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';
import { RegisterDTO } from './model/register-dto.model';
import { environment } from '../../../env/environment';

describe('AuthService - register function', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockRegisterDTO: RegisterDTO = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    location: {
      country: 'USA',
      city: 'New York',
      street: 'Main St',
      houseNumber: '123'
    },
    phoneNumber: '1234567890',
    role: 'EVENT_ORGANIZER',
    company: null
  };

  const mockRegisterWithCompanyDTO: RegisterDTO = {
    email: 'provider@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    location: {
      country: 'USA',
      city: 'Boston',
      street: 'Business Ave',
      houseNumber: '456'
    },
    phoneNumber: '0987654321',
    role: 'PROVIDER',
    company: {
      email: 'company@example.com',
      name: 'Test Company',
      location: {
        country: 'USA',
        city: 'Boston',
        street: 'Business Ave',
        houseNumber: '456'
      },
      phoneNumber: '0987654321',
      description: 'Test company description'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('register', () => {
    it('should make POST request to correct endpoint', () => {
      service.register(mockRegisterDTO, false).subscribe();

      const req = httpMock.expectOne(`${environment.apiHost}/auth/register?roleUpgrade=false`);
      expect(req.request.method).toBe('POST');
      req.flush(mockRegisterDTO);
    });

    it('should send correct body data', () => {
      service.register(mockRegisterDTO, false).subscribe();

      const req = httpMock.expectOne(`${environment.apiHost}/auth/register?roleUpgrade=false`);
      expect(req.request.body).toEqual(mockRegisterDTO);
      req.flush(mockRegisterDTO);
    });

    it('should set roleUpgrade parameter to false when roleUpgrade is false', () => {
      service.register(mockRegisterDTO, false).subscribe();

      const req = httpMock.expectOne(`${environment.apiHost}/auth/register?roleUpgrade=false`);
      expect(req.request.params.get('roleUpgrade')).toBe('false');
      req.flush(mockRegisterDTO);
    });

    it('should set roleUpgrade parameter to true when roleUpgrade is true', () => {
      service.register(mockRegisterDTO, true).subscribe();

      const req = httpMock.expectOne(`${environment.apiHost}/auth/register?roleUpgrade=true`);
      expect(req.request.params.get('roleUpgrade')).toBe('true');
      req.flush(mockRegisterDTO);
    });

    it('should return observable with RegisterDTO on successful registration', () => {
      const expectedResponse: RegisterDTO = { ...mockRegisterDTO };

      service.register(mockRegisterDTO, false).subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne(`${environment.apiHost}/auth/register?roleUpgrade=false`);
      req.flush(expectedResponse);
    });

    it('should handle registration with company data', () => {
      service.register(mockRegisterWithCompanyDTO, false).subscribe();

      const req = httpMock.expectOne(`${environment.apiHost}/auth/register?roleUpgrade=false`);
      expect(req.request.body).toEqual(mockRegisterWithCompanyDTO);
      expect(req.request.body.company).toBeTruthy();
      expect(req.request.body.company.name).toBe('Test Company');
      req.flush(mockRegisterWithCompanyDTO);
    });

    it('should handle registration without company data', () => {
      service.register(mockRegisterDTO, false).subscribe();

      const req = httpMock.expectOne(`${environment.apiHost}/auth/register?roleUpgrade=false`);
      expect(req.request.body).toEqual(mockRegisterDTO);
      expect(req.request.body.company).toBeNull();
      req.flush(mockRegisterDTO);
    });

    it('should handle role upgrade scenario', () => {
      const roleUpgradeDTO: RegisterDTO = {
        ...mockRegisterDTO,
        password: null // No password needed for role upgrade
      };

      service.register(roleUpgradeDTO, true).subscribe();

      const req = httpMock.expectOne(`${environment.apiHost}/auth/register?roleUpgrade=true`);
      expect(req.request.body.password).toBeNull();
      expect(req.request.params.get('roleUpgrade')).toBe('true');
      req.flush(roleUpgradeDTO);
    });
  });
});
