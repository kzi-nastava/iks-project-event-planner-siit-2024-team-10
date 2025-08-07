import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ServiceService } from './service.service';
import { CreateServiceDTO } from '../model/create-service-dto.model';
import { environment } from '../../../env/environment';

describe('ServiceService - add function', () => {
  let service: ServiceService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiHost}/services`;

  const baseDTO: CreateServiceDTO = {
    categoryId: 1,
    pending: false,
    provider: 10,
    name: 'Dekoracija',
    description: 'Opis dekoracije',
    specification: 'Cveće, svetla',
    price: 15000,
    discount: 10,
    photos: ['img1.jpg'],
    isVisible: true,
    isAvailable: true,
    minDuration: 60,
    maxDuration: 180,
    reservationPeriod: 24,
    cancellationPeriod: 24,
    autoConfirm: true,
    categoryProposalName: '',
    categoryProposalDescription: '',
    creatorId: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceService]
    });

    service = TestBed.inject(ServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should make POST request with correct body to /services', () => {
    service.add(baseDTO).subscribe();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(baseDTO);
    req.flush({});
  });

  it('should set pending to true when categoryProposalName is provided', () => {
    const proposalDTO: CreateServiceDTO = {
      ...baseDTO,
      categoryId: null,
      pending: true,
      categoryProposalName: 'Nova kategorija',
      categoryProposalDescription: 'Opis predloga'
    };

    service.add(proposalDTO).subscribe(response => {
      expect(response.pending).toBeTrue();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.body.pending).toBeTrue();
    expect(req.request.body.categoryProposalName).toBe('Nova kategorija');
    req.flush({ ...proposalDTO }); 
  });

  it('should set pending to false when categoryId is present and no proposal is sent', () => {
    const normalDTO: CreateServiceDTO = {
      ...baseDTO,
      pending: false,
      categoryProposalName: '',
      categoryProposalDescription: ''
    };

    service.add(normalDTO).subscribe(response => {
      expect(response.pending).toBeFalse();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.body.pending).toBeFalse();
    expect(req.request.body.categoryId).toBe(1);
    req.flush({ ...normalDTO });
  });

  it('should send correct body without proposal and pending=false', () => {
    service.add(baseDTO).subscribe();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.body.categoryProposalName).toBe('');
    expect(req.request.body.pending).toBeFalse();
    req.flush({});
  });
});
