import { Injectable } from '@angular/core'; 
import { BehaviorSubject, Observable, of } from 'rxjs'; 
import { Category } from '../model/category.model';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../env/environment';
import { CreateCategoryDTO } from '../model/create-category-dto.model';
import { EditCategoryDTO } from '../model/edit-category-dto.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) {}
  getAll() : Observable<Category[]> {
    return this.httpClient.get<Category[]>(environment.apiHost + `/categories`);
  }
  
  add(category:CreateCategoryDTO) : Observable<Category> {
    return this.httpClient.post<Category>(environment.apiHost + "/categories", category);
  }

  edit(category:EditCategoryDTO) : Observable<Category> {
    return this.httpClient.put<Category>(environment.apiHost + "/categories/"+category.id, category);
  }
  
  delete(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(environment.apiHost + "/categories/" + id);
  }  
  approve(id:number):Observable<Category>{
    return this.httpClient.put<Category>(environment.apiHost + "/categories/"+id+'/approve',null);
  }
  changeCategory(oldCategoryId: number, newCategoryId: number): Observable<any> {
    return this.httpClient.put<any>(environment.apiHost + `/categories/${oldCategoryId}/change/${newCategoryId}`, null);
  }
}