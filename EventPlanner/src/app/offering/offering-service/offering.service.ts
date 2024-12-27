import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { Service } from '../model/service.model';
import { Observable, of } from 'rxjs';
import { Offering } from '../model/offering.model';
import { Location } from '../../event/model/location.model';
import { GetProvider } from '../../user/model/get_provider.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from '../../../env/environment';
import { PagedResponse } from '../../event/model/paged-response.model';
import { Category } from '../model/category.model';

const SAMPLE_LOCATION: Location = {
  id: 1,
  country: 'USA',
  city: 'San Francisco',
  street: 'Tech Blvd',
  houseNumber: '123',
};

const SAMPLE_PROVIDER: GetProvider = {
  id: 1,
  email: "john.smith@eventpro.com",
  phoneNumber: "+1234567890",
  firstName: "John",
  lastName: "Smith",
  profilePhoto: "image1.jpg",
  location: SAMPLE_LOCATION,
  company:{
    name: "EventPro",
    description: "Event management company",
    phoneNumber: "+1234567890",
    email: "company@email.com",
    location: SAMPLE_LOCATION,
  },
}


const SAMPLE_CATEGORY: Category = {
  id: 1,
  name: 'Audio/Visual Equipment',
  description: 'Audio/Visual equipment for events',
  deleted: false,
  pending: false
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'LED Stage Lights',
    category: SAMPLE_CATEGORY,
    picture: ['flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 300,
    averageRating: '4.7',
    eventTypes: ['Concert', 'Conference'],
    isProduct: true,
    description: "this is description",  isVisible: true, isAvailable:true,
    location: {
      id: 1,
      country: 'USA',
      city: 'San Francisco',
      street: 'Tech Blvd',
      houseNumber: '123',
    },
  },
  {
    id: 2,
    name: 'Portable Stage',
    category: SAMPLE_CATEGORY,
    picture: ['flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 1500,
    averageRating: '4.5',
    eventTypes: ['Festival', 'Exhibition'],
    isProduct: true,
    description: "this is description",  isVisible: true,
    isAvailable:true,
    location: {
      id: 1,
      country: 'USA',
      city: 'San Francisco',
      street: 'Tech Blvd',
      houseNumber: '123',
    },
  },
  {
    id: 3,
    name: 'Sound System Package',
    category: SAMPLE_CATEGORY,
    picture: ['flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 700,
    averageRating: '4.8',
    eventTypes: ['Concert', 'Conference', 'Seminar'],
    isProduct: true,
    description: "this is description",  
    isVisible: true,
    isAvailable:true,
    location: {
      id: 1,
      country: 'USA',
      city: 'San Francisco',
      street: 'Tech Blvd',
      houseNumber: '123',
    },
  },
  {
    id: 4,
    name: 'Event Tents',
    category: SAMPLE_CATEGORY,
    picture: ['flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 1200,
    averageRating: '4.6',
    eventTypes: ['Outdoor Wedding', 'Festival', 'Exhibition'],
    isProduct: true,
    description: "this is description",  
    isVisible: true,
    isAvailable:true,
    location: {
      id: 1,
      country: 'USA',
      city: 'San Francisco',
      street: 'Tech Blvd',
      houseNumber: '123',
    },
  },
  {
    id: 5,
    name: 'Conference Seating',
    category: SAMPLE_CATEGORY,
    picture: ['flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 500,
    averageRating: '4.9',
    eventTypes: ['Conference', 'Seminar'],
    isProduct: true,
    description: "this is description",  
    isVisible: true,
    isAvailable:true,
    location: {
      id: 1,
      country: 'USA',
      city: 'San Francisco',
      street: 'Tech Blvd',
      houseNumber: '123',
    },
  }
];

const SERVICES: Service[] = [
  {
    id: 6,
    name: 'Catering Service',
    category: SAMPLE_CATEGORY,
    picture: ['makeup.jpg','backdrop.jpg','flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 500,
    averageRating: '5.0',
    isProduct: false,
    specification: 'Full-service catering for events including appetizers, main course, and desserts.',
    minDuration: 2,
    maxDuration: 5,
    cancellationPeriod: 48,
    reservationPeriod: 72,
    autoConfirm: true,
    description: "this is description",
    discount:5,
    eventTypes:["Wedding","Graduation"],
    fixedTime:false,  
    isVisible: true,
    isAvailable:true,
    location: {
      id: 1,
      country: 'USA',
      city: 'San Francisco',
      street: 'Tech Blvd',
      houseNumber: '123',
    },

  },
  {
    id: 7,
    name: 'Event Photography',
    category: SAMPLE_CATEGORY,
    picture: ['makeup.jpg','backdrop.jpg','flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 800,
    averageRating: '4.8',
    isProduct: false,
    specification: 'Professional event photography including candid and posed shots.',
    minDuration: 3,
    maxDuration: 8,
    cancellationPeriod: 24,
    reservationPeriod: 48,
    autoConfirm: false,    
    description: "this is description",
    discount:10,
    eventTypes:["Wedding","Graduation"],
    fixedTime:false,
    isVisible: true,
    isAvailable:true,
    location: {
      id: 1,
      country: 'USA',
      city: 'San Francisco',
      street: 'Tech Blvd',
      houseNumber: '123',
    },

  },
  {
    id: 8,
    name: 'Venue Setup',
    category: SAMPLE_CATEGORY,
    picture: ['makeup.jpg','backdrop.jpg','flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 1000,
    averageRating: '4.6',
    isProduct: false,
    specification: 'Complete venue setup including seating, decor, and lighting arrangements.',
    minDuration: 4,   
    description: "this is description",
    maxDuration: 12,
    cancellationPeriod: 72,
    reservationPeriod: 96,
    autoConfirm: false,
    discount:15,
    eventTypes:["Wedding","Graduation"],
    fixedTime:false,  
    isVisible: true,
    isAvailable:true,
    location: {
      id: 1,
      country: 'USA',
      city: 'San Francisco',
      street: 'Tech Blvd',
      houseNumber: '123',
    },


  },
  {
    id: 9,
    name: 'Audio/Visual Setup',
    category: SAMPLE_CATEGORY,
    picture: ['makeup.jpg','backdrop.jpg','flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 600,
    averageRating: '4.7',
    isProduct: false,
    description: "this is description",
    specification: 'Audio/Visual equipment setup for conferences, seminars, and presentations.',
    minDuration: 3,
    maxDuration: 6,
    cancellationPeriod: 48,
    reservationPeriod: 48,
    autoConfirm: true,
    discount:20,
    eventTypes:["Wedding","Graduation"],
    fixedTime:false,  
    isVisible: true,
    isAvailable:true,
    location: {
      id: 1,
      country: 'USA',
      city: 'San Francisco',
      street: 'Tech Blvd',
      houseNumber: '123',
    },

  },
  {
    id: 10,
    name: 'Event Security',
    category: SAMPLE_CATEGORY,
    picture: ['makeup.jpg','backdrop.jpg','flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 700,
    averageRating: '4.9',
    isProduct: false,
    description: "this is description",
    specification: 'Security personnel for events, ensuring safety and crowd management.',
    minDuration: 4,
    maxDuration: 8,
    cancellationPeriod: 48,
    reservationPeriod: 72,
    autoConfirm: true,
    discount:15,
    eventTypes:["Wedding","Graduation"],
    fixedTime:false,
    isVisible: true,
    isAvailable:true,
    location: {
      id: 1,
      country: 'USA',
      city: 'San Francisco',
      street: 'Tech Blvd',
      houseNumber: '123',
    },
  }
];

@Injectable({
  providedIn: 'root'
})
export class OfferingService {
  private productList: Product[] = [];
  private serviceList: Service[] = [];

  constructor(private httpClient: HttpClient) {
    this.productList = PRODUCTS;
    this.serviceList = SERVICES;
  }

  private shuffleArray(offerings: Offering[]): Offering[] {
    for (let i = offerings.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [offerings[i], offerings[j]] = [offerings[j], offerings[i]];
    }
    return offerings;
  }

  getAll(): Observable<Offering[]> {
    const allOfferings = [...this.productList, ...this.serviceList];
    return of(this.shuffleArray(allOfferings));
  }
  getTop(): Observable<Offering[]> {
      return this.httpClient.get<Offering[]>(environment.apiHost+'/offerings/top');
    }

  getProducts(): Observable<Product[]> {
    return of(this.productList);
  }

  getPaginatedOfferings(
      page: number,
      pageSize: number,
      filters: any = {}
    ): Observable<PagedResponse<Offering>> {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('size', pageSize.toString());
  
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
  
      return this.httpClient.get<PagedResponse<Offering>>(environment.apiHost+"/offerings", { params });
    }
    getHighestPrice(
      isService: boolean
    ): Observable<number> {
      return this.httpClient.get<number>(environment.apiHost+"/offerings/highest-prices", { params: new HttpParams().set('isService', isService.toString()) });
    }

  getServices(): Observable<Service[]> {
    return of(this.serviceList);
  }

  getOfferingById(id: number): Observable<Offering | undefined> {
    const allOfferings = [...this.productList, ...this.serviceList];
    const offering = allOfferings.find(o => o.id === id);
    return of(offering);
  }
  createService(data: any): void {
    console.log('Service data received:', data);
  }
  editService(data: any): void {
    console.log('Service data received:', data);
  }
}