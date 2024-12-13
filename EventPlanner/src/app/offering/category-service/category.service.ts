import { Injectable } from '@angular/core'; 
import { BehaviorSubject, Observable, of } from 'rxjs'; 
import { Category } from '../model/category.model';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../env/environment';
import { CreateCategoryDTO } from '../model/create-category-dto.model';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) {}
  getAll() : Observable<Category[]> {
    return this.httpClient.get<Category[]>(environment.apiHost + `/categories`);
  }
  
  add(eventType:CreateCategoryDTO) : Observable<Category> {
    return this.httpClient.post<Category>(environment.apiHost + "/categories", eventType);
  }
/*
  edit(eventType:EditEventTypeDTO) : Observable<Category> {
    return this.httpClient.put<Category>(environment.apiHost + "/event-types/"+eventType.id, eventType);
  }
  delete(id:number):Observable<Category>{
    return this.httpClient.delete<Category>(environment.apiHost + "/event-types/"+id);
  }
    */
}