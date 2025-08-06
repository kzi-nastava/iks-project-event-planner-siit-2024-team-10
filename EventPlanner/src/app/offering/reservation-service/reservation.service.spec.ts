import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReservationService } from './reservation.service';
import { Reservation } from '../model/reservation.model';
import { CreateReservationDTO } from '../model/create-reservation-dto.model';
import { environment } from '../../../env/environment';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReservationService]
    });
    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST and return a Reservation', () => {
    const dto: CreateReservationDTO = {
      event: 1,
      service: 2,
      startTime: '10:00',
      endTime: '12:00'
    };

    const mockResponse: Reservation = {
      id: 10,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
      status: 'PENDING',
      event: 'Test Event',
      service: {
        id: 2,
        name: 'Test Service',
        provider: {
          firstName: "John",
          id: 1,
          email: '',
          phoneNumber: '',
          lastName: '',
          location: undefined,
          company: undefined,
          accountId: 0
        },
        price: 100,
        description: 'Test service',
        specification: '',
        cancellationPeriod: 0,
        reservationPeriod: 0,
        autoConfirm: false,
        fixedTime: false,
        category: undefined,
        location: undefined,
        averageRating: '',
        isProduct: false,
        deleted: false
      }
    };

    service.createReservation(dto).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiHost}/reservations`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);
  });
});
