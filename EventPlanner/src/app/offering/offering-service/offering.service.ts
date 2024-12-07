import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { Service } from '../model/service.model';
import { Observable, of } from 'rxjs';
import { Offering } from '../model/offering.model';
import { Provider } from '../../user/model/provider.model';

const SAMPLE_PROVIDER: Provider = {
  _id: 1,
  email: "john.smith@eventpro.com",
  password: "hashedPassword123",
  firstName: "John",
  lastName: "Smith",
  profilePhoto: "image1.jpg",
  country: "United States",
  city: "New York",
  street: "Broadway",
  houseNumber: "123",
  phone: "+1-555-0123",
  companyEmail: "contact@eventpro.com",
  companyName: "EventPro Solutions",
  companyCountry: "United States",
  companyCity: "New York",
  companyStreet: "Broadway",
  companyHouseNumber: "123",
  companyPhone: "+1-555-0124",
  companyDescription: "Premium event equipment and services provider with over 10 years of experience.",
  companyPhotos: "company.jpg"
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'LED Stage Lights',
    category: 'Audio/Visual Equipment',
    picture: ['flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 300,
    rating: '4.7',
    eventTypes: ['Concert', 'Conference'],
    isProduct: true,
    description: "this is description",  isVisible: true, isAvailable:true

  },
  {
    id: 2,
    name: 'Portable Stage',
    category: 'Event Infrastructure',
    picture: ['flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 1500,
    rating: '4.5',
    eventTypes: ['Festival', 'Exhibition'],
    isProduct: true,
    description: "this is description",  isVisible: true,
    isAvailable:true
  },
  {
    id: 3,
    name: 'Sound System Package',
    category: 'Audio/Visual Equipment',
    picture: ['flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 700,
    rating: '4.8',
    eventTypes: ['Concert', 'Conference', 'Seminar'],
    isProduct: true,
    description: "this is description",  
    isVisible: true,
    isAvailable:true

  },
  {
    id: 4,
    name: 'Event Tents',
    category: 'Event Infrastructure',
    picture: ['flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 1200,
    rating: '4.6',
    eventTypes: ['Outdoor Wedding', 'Festival', 'Exhibition'],
    isProduct: true,
    description: "this is description",  
    isVisible: true,
    isAvailable:true

  },
  {
    id: 5,
    name: 'Conference Seating',
    category: 'Event Furniture',
    picture: ['flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 500,
    rating: '4.9',
    eventTypes: ['Conference', 'Seminar'],
    isProduct: true,
    description: "this is description",  
    isVisible: true,
    isAvailable:true

  }
];

const SERVICES: Service[] = [
  {
    id: 6,
    name: 'Catering Service',
    category: 'Food & Beverage',
    picture: ['makeup.jpg','backdrop.jpg','flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 500,
    rating: '5.0',
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
    isAvailable:true

  },
  {
    id: 7,
    name: 'Event Photography',
    category: 'Photography',
    picture: ['makeup.jpg','backdrop.jpg','flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 800,
    rating: '4.8',
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
    isAvailable:true

  },
  {
    id: 8,
    name: 'Venue Setup',
    category: 'Event Management',
    picture: ['makeup.jpg','backdrop.jpg','flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 1000,
    rating: '4.6',
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
    isAvailable:true


  },
  {
    id: 9,
    name: 'Audio/Visual Setup',
    category: 'Audio/Visual',
    picture: ['makeup.jpg','backdrop.jpg','flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 600,
    rating: '4.7',
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
    isAvailable:true

  },
  {
    id: 10,
    name: 'Event Security',
    category: 'Security Services',
    picture: ['makeup.jpg','backdrop.jpg','flowers.jpg'],  
    provider: SAMPLE_PROVIDER,
    price: 700,
    rating: '4.9',
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
    isAvailable:true
  }
];

@Injectable({
  providedIn: 'root'
})
export class OfferingService {
  private productList: Product[] = [];
  private serviceList: Service[] = [];

  constructor() {
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

  getProducts(): Observable<Product[]> {
    return of(this.productList);
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