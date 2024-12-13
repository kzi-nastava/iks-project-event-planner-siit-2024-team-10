import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Category } from '../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([
    {
      id: 1,
      name: 'Audio/Visual Equipment',
      description: 'High-quality sound and visual equipment for events',
      deleted:false,
      pending:false
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