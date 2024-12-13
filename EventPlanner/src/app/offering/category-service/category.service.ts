import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {Category} from '../model/category.model';

// export interface Category {
//   id: number;
//   name: string;
//   description: string;
// }

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([
    {
      id: 1,
      name: 'Audio/Visual Equipment',
      description: 'High-quality sound and visual equipment for events'
    },
    {
      id: 2,
      name: 'Event Infrastructure',
      description: 'Essential structures and setups for various event types'
    },
    {
      id: 3,
      name: 'Event Services',
      description: 'Professional services to enhance event experience'
    },
    {
      id: 4,
      name: 'Catering Services',
      description: 'Delicious food and beverages tailored to your event'
    },
    {
      id: 5,
      name: 'Photography & Videography',
      description: 'Capture moments with professional photography and videography'
    },
    {
      id: 6,
      name: 'Decorations & Themes',
      description: 'Custom event themes and decorations to create memorable atmospheres'
    },
    {
      id: 7,
      name: 'Entertainment',
      description: 'Bands, DJs, and performers to keep your guests entertained'
    },
    {
      id: 8,
      name: 'Transportation',
      description: 'Reliable transportation options for your event attendees'
    },
    {
      id: 9,
      name: 'Security',
      description: 'Trained security personnel to ensure a safe event'
    },
    {
      id: 10,
      name: 'Venue Booking',
      description: 'Assistance with booking and managing event venues'
    },
    {
      id: 11,
      name: 'Event Coordination',
      description: 'Professional coordinators to manage your event seamlessly'
    },
    {
      id: 12,
      name: 'Lighting & Special Effects',
      description: 'Create stunning visuals with specialized lighting and effects'
    }
    
  ]);

  categories$ = this.categoriesSubject.asObservable();

  constructor() {}

  fetchCategories(): Observable<Category[]> {
    return this.categories$;
  }

  addCategory(category: Category): Observable<Category> {
    const currentCategories = this.categoriesSubject.value;
    const newCategory = { ...category, id: currentCategories.length + 1 };
    this.categoriesSubject.next([...currentCategories, newCategory]);
    return of(newCategory);
  }

  updateCategory(updatedCategory: Category): Observable<Category> {
    const currentCategories = this.categoriesSubject.value;
    const updatedCategories = currentCategories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    this.categoriesSubject.next(updatedCategories);
    return of(updatedCategory);
  }

  deleteCategory(id: number): Observable<void> {
    const currentCategories = this.categoriesSubject.value;
    const filteredCategories = currentCategories.filter(cat => cat.id !== id);
    this.categoriesSubject.next(filteredCategories);
    return of(undefined);
  }
}