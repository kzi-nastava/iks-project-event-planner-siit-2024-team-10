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

  }
];

const SERVICES: Service[] = [
  {
    id: 1,
    name: 'Catering Service',
    category: 'Food & Beverage',
    picture: 'makeup.jpg',  
    provider: 'Gourmet Catering',
    price: 500,
    rating: '5.0',
    isProduct: false,

  },
  {
    id: 2,
    name: 'Event Photography',
    category: 'Photography',
    picture: 'makeup.jpg', 
    provider: 'CaptureIt Photography',
    price: 800,
    rating: '4.8',
    isProduct: false,

  },
  {
    id: 3,
    name: 'Venue Setup',
    category: 'Event Management',
    picture: 'makeup.jpg',  
    provider: 'Perfect Venue Services',
    price: 1000,
    rating: '4.6',
    isProduct: false,

  },
  {
    id: 4,
    name: 'Audio/Visual Setup',
    category: 'Audio/Visual',
    picture: 'makeup.jpg',
    provider: 'TechVision',
    price: 600,
    rating: '4.7',
    isProduct: false,

  },
  {
    id: 5,
    name: 'Event Security',
    category: 'Security Services',
    picture: 'makeup.jpg',
    provider: 'SafeGuard Security',
    price: 700,
    rating: '4.9',
    isProduct: false,

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
        isProduct: serviceObj.isProduct
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
