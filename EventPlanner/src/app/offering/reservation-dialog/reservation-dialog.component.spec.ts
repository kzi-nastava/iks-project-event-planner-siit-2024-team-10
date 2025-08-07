import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { ReservationDialogComponent } from './reservation-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ReservationService } from '../reservation-service/reservation.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Event } from '../../event/model/event.model';
import { Reservation } from '../model/reservation.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

describe('ReservationDialogComponent', () => {
  let component: ReservationDialogComponent;
  let fixture: ComponentFixture<ReservationDialogComponent>;
  let mockReservationService: jasmine.SpyObj<ReservationService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let dialog: MatDialog; 
  let dialogOpenSpy: jasmine.Spy;
  let snackBarSpy: jasmine.Spy;

  const dummyEvent: Event = {
    id: 1,
    name: 'Test Event',
    eventType: { id: 1, name: 'Conference' },
    organizer: {
      id: 1,
      firstName: 'Org',
      lastName: 'Test',
      email: 'organizer@mail.com',
      location: null,
      phoneNumber: '10293847',
      profilePhoto: '',
      accountId: 1,
    },
    description: 'Desc',
    maxParticipants: 100,
    open: true,
    date: new Date(),
    location: {
      id: 1,
      city: 'City',
      street: 'Street',
      country: 'Country',
      houseNumber: '12'
    },
    averageRating: 4.5,
    participantsCount: 10
  };

  const dummyReservation: Reservation = {
    id: 1,
    startTime: new Date('2025-08-04T10:00'),
    endTime: new Date('2025-08-04T12:00'),
    status: 'PENDING',
    event: 'Test Event',
    service: {
      id: 2,
      name: 'Test Service',
      description: 'Description',
      specification: 'Spec',
      cancellationPeriod: 24,
      reservationPeriod: 48,
      autoConfirm: true,
      fixedTime: true,
      category: undefined,
      provider: undefined,
      location: undefined,
      price: 100,
      averageRating: '',
      isProduct: false,
      deleted: false,
      pending: false,
    }
  };

  beforeEach(async () => {
    mockReservationService = jasmine.createSpyObj('ReservationService', ['findEventsByOrganizer', 'createReservation']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getAccountId']);

    await TestBed.configureTestingModule({
      declarations: [ReservationDialogComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
      ],
      providers: [
        { provide: ReservationService, useValue: mockReservationService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            offering: {
              id: 1,
              name: 'Test Service',
              reservationPeriod: 24,
              minDuration: 2,
              maxDuration: 2,
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationDialogComponent);
    component = fixture.componentInstance;

    dialog = TestBed.inject(MatDialog);
    dialogOpenSpy = spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
    snackBarSpy = spyOn(component['snackBar'], 'open');
    snackBarSpy.calls.reset();

    mockAuthService.getAccountId.and.returnValue(2);
    mockReservationService.findEventsByOrganizer.and.returnValue(of([dummyEvent]));

    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form controls', () => {
      expect(component.reservationForm.get('event')).toBeTruthy();
      expect(component.reservationForm.get('startTime')).toBeTruthy();
      expect(component.reservationForm.get('endTime')).toBeTruthy();
    });

    it('should set errorMsg if no events found', fakeAsync(() => {
      mockReservationService.findEventsByOrganizer.and.returnValue(of([]));
      component.ngOnInit(); 
      tick();
      flush();
      fixture.detectChanges();
      expect(component.errorMsg).toContain('No events found');
    }));

    it('should disable endTime control if minDuration equals maxDuration', () => {
      component.data.offering.minDuration = 3;
      component.data.offering.maxDuration = 3;
      component.ngOnInit();
      expect(component.reservationForm.get('endTime')?.disabled).toBeTrue();
    });

    it('should not disable endTime control if minDuration and maxDuration differ', () => {
      component.data.offering = {
        ...component.data.offering,
        minDuration: 1,
        maxDuration: 2
      };
      component.ngOnInit();
      expect(component.reservationForm.get('endTime')?.disabled).toBeFalse();
    });
  });

  describe('Form behavior', () => {
    it('should calculate endTime correctly when onStartTimeChange is called', () => {
      component.reservationForm.get('startTime')?.setValue('10:00');
      component.onStartTimeChange();
      expect(component.calculatedEndTime).toBe('12:00');
      expect(component.reservationForm.get('endTime')?.value).toBe('12:00');
    });

    it('should clear errorMsg when form becomes valid', () => {
      component.errorMsg = 'Error message';
      mockReservationService.createReservation.and.returnValue(of(dummyReservation));
      component.reservationForm.setValue({
        event: dummyEvent,
        startTime: '10:00',
        endTime: '12:00'
      });
      component.onBook();
      expect(component.errorMsg).toBe('');
    });
  });

  describe('Reservation submission', () => {
    it('should submit reservation when form is valid and user confirms', fakeAsync(() => {
      component.events = [dummyEvent];
      component.reservationForm.setValue({
        event: dummyEvent,
        startTime: '10:00',
        endTime: '12:00'
      });

      mockConfirm(true);
      mockReservationService.createReservation.and.returnValue(of(dummyReservation));

      component.onBook();
      tick();

      expect(mockReservationService.createReservation).toHaveBeenCalled();
      expect(snackBarSpy.calls.argsFor(0)).toEqual([
        'Processing reservation...',
        'Close',
        jasmine.objectContaining({
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['warning-snackbar']
        })
      ]);
      expect(snackBarSpy.calls.argsFor(1)).toEqual([
        'Reservation request is pending! Email confirmation will been sent.',
        'OK',
        jasmine.objectContaining({ duration: 5000 })
      ]);
    }));

    it('should not submit reservation if form is invalid', () => {
      component.reservationForm.setValue({
        event: null,
        startTime: '',
        endTime: ''
      });

      component.onBook();

      expect(mockReservationService.createReservation).not.toHaveBeenCalled();
      expect(component.errorMsg).toContain('Please fill in all fields');
    });

    it('should not submit reservation if user cancels confirmation', () => {
      component.events = [dummyEvent];
      component.reservationForm.setValue({
        event: dummyEvent,
        startTime: '10:00',
        endTime: '12:00'
      });

      dialogOpenSpy.and.returnValue({ afterClosed: () => of(false) } as any);

      component.onBook();

      expect(mockReservationService.createReservation).not.toHaveBeenCalled();
    });

    it('should show error message on reservation creation failure', fakeAsync(() => {
      component.events = [dummyEvent];
      component.reservationForm.setValue({
        event: dummyEvent,
        startTime: '10:00',
        endTime: '12:00'
      });

      mockConfirm(true);
      mockReservationService.createReservation.and.returnValue(throwError(() => new Error('Failed')));

      component.onBook();
      tick();

      expect(component.errorMsg).toContain('Failed');
      expect(component.snackBar.open).toHaveBeenCalled();
    }));

    it('should show error if reservation is outside reservation period', fakeAsync(() => {
      dummyEvent.date = new Date();
      component.events = [dummyEvent];
      component.reservationForm.setValue({
        event: dummyEvent,
        startTime: '10:00',
        endTime: '12:00'
      });

      mockConfirm(true);

      mockReservationService.createReservation.and.returnValue(
        throwError(() => ({
          message: 'Reservation must be made within the reservation period.'
        }))
      );

      component.onBook();

      tick(); // for afterClosed()
      tick(); // for createReservation()

      expect(snackBarSpy).toHaveBeenCalledWith(
        'Reservation must be made within the reservation period.',
        'OK',
        jasmine.objectContaining({ duration: 5000 })
      );
    }));
  });

  // helper for window.confirm mocking
  function mockConfirm(returnValue: boolean) {
    spyOn(window, 'confirm').and.returnValue(returnValue);
  }
});
