import { Injectable } from '@angular/core';
import { Product } from './model/product.model';
import { Service } from './model/service.model';
import { Observable, of } from 'rxjs';
import { Offering } from './model/offering.model';

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'LED Stage Lights',
    category: 'Audio/Visual Equipment',
    picture: 'flowers.jpg',  
    provider: 'EventTech Supplies',
    price: 300,
    rating: '4.7',
    eventTypes: ['Concert', 'Conference'],
    isProduct: true,
    description: "this is description",

  },
  {
    id: 2,
    name: 'Portable Stage',
    category: 'Event Infrastructure',
    picture: 'flowers.jpg',  
    provider: 'EventRentals',
    price: 1500,
    rating: '4.5',
    eventTypes: ['Festival', 'Exhibition'],
    isProduct: true,
    description: "this is description",


  },
  {
    id: 3,
    name: 'Sound System Package',
    category: 'Audio/Visual Equipment',
    picture: 'flowers.jpg',  
    provider: 'SoundMasters',
    price: 700,
    rating: '4.8',
    eventTypes: ['Concert', 'Conference', 'Seminar'],
    isProduct: true,
    description: "this is description",

  },
  {
    id: 4,
    name: 'Event Tents',
    category: 'Event Infrastructure',
    picture: 'flowers.jpg',  
    provider: 'TentMasters',
    price: 1200,
    rating: '4.6',
    eventTypes: ['Outdoor Wedding', 'Festival', 'Exhibition'],
    isProduct: true,
    description: "this is description",

  },
  {
    id: 5,
    name: 'Conference Seating',
    category: 'Event Furniture',
    picture: 'flowers.jpg',  
    provider: 'Furniture Rentals',
    price: 500,
    rating: '4.9',
    eventTypes: ['Conference', 'Seminar'],
    isProduct: true,
    description: "this is description",


  }
];
const SERVICES: Service[] = [
  {
    id: 6,
    name: 'Catering Service',
    category: 'Food & Beverage',
    picture: 'makeup.jpg',  
    provider: 'Gourmet Catering',
    price: 500,
    rating: '5.0',
    isProduct: false,
    specification: 'Full-service catering for events including appetizers, main course, and desserts.',
    minDuration: 2,
    maxDuration: 5,
    cancellationPeriod: 48,  // hours
    reservationPeriod: 72,   // hours
    autoConfirm: true,
    description: "this is description",

  },
  {
    id: 7,
    name: 'Event Photography',
    category: 'Photography',
    picture: 'makeup.jpg', 
    provider: 'CaptureIt Photography',
    price: 800,
    rating: '4.8',
    isProduct: false,
    specification: 'Professional event photography including candid and posed shots.',
    minDuration: 3,
    maxDuration: 8,
    cancellationPeriod: 24,  // hours
    reservationPeriod: 48,   // hours
    autoConfirm: false,    
    description: "this is description",
  },
  {
    id: 8,
    name: 'Venue Setup',
    category: 'Event Management',
    picture: 'makeup.jpg',  
    provider: 'Perfect Venue Services',
    price: 1000,
    rating: '4.6',
    isProduct: false,
    specification: 'Complete venue setup including seating, decor, and lighting arrangements.',
    minDuration: 4,   
    description: "this is description",
    maxDuration: 12,
    cancellationPeriod: 72,  // hours
    reservationPeriod: 96,   // hours
    autoConfirm: false,
  },
  {
    id: 9,
    name: 'Audio/Visual Setup',
    category: 'Audio/Visual',
    picture: 'makeup.jpg',
    provider: 'TechVision',
    price: 600,
    rating: '4.7',
    isProduct: false,
    description: "this is description",
    specification: 'Audio/Visual equipment setup for conferences, seminars, and presentations.',
    minDuration: 3,
    maxDuration: 6,
    cancellationPeriod: 48,  // hours
    reservationPeriod: 48,   // hours
    autoConfirm: true,
  },
  {
    id: 10,
    name: 'Event Security',
    category: 'Security Services',
    picture: 'makeup.jpg',
    provider: 'SafeGuard Security',
    price: 700,
    rating: '4.9',
    isProduct: false,
    description: "this is description",
    specification: 'Security personnel for events, ensuring safety and crowd management.',
    minDuration: 4,
    maxDuration: 8,
    cancellationPeriod: 48,  // hours
    reservationPeriod: 72,   // hours
    autoConfirm: true,
  }
];

@Injectable({
  providedIn: 'root'
})
export class OfferingService {

  private productList: Product[] = [];
  private serviceList: Service[] = [];

  constructor() {
    for (let productObj of PRODUCTS){
      const product: Product = {
        id: productObj.id,
        name: productObj.name,
        category: productObj.category,
        picture: productObj.picture,
        provider: productObj.provider,
        price: productObj.price,
        rating: productObj.rating,
        isProduct: productObj.isProduct,
        description: productObj.description
      };
      this.productList.push(product);
    }
    for (let serviceObj of SERVICES){
      const service: Service = {
        id: serviceObj.id,
        name: serviceObj.name,
        category: serviceObj.category,
        picture: serviceObj.picture,
        provider: serviceObj.provider,
        price: serviceObj.price,
        rating: serviceObj.rating,
        isProduct: serviceObj.isProduct,
        specification:serviceObj.specification,
        reservationPeriod:serviceObj.reservationPeriod,
        cancellationPeriod:serviceObj.cancellationPeriod,
        description:serviceObj.description,
      };
      this.serviceList.push(service);
    }
  }

  // Function to shuffle the offerings
  private shuffleArray(offerings: Offering[]): Offering[] {
    // Fisher-Yates shuffle algorithm
    for (let i = offerings.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [offerings[i], offerings[j]] = [offerings[j], offerings[i]]; // swap elements
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
}
