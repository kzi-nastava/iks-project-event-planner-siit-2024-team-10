import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { Product } from './model/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }
    getById(id:number) : Observable<Product> {
      return this.httpClient.get<Product>(environment.apiHost + `/products/` + id);
    }
}
