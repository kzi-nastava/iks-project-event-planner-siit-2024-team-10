import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateEventDTO} from '../event/model/create-event-dto.model';
import {Observable} from 'rxjs';
import {Event} from '../event/model/event.model';
import {environment} from '../../env/environment';
import {CreateProductDTO} from './model/create-product-dto.model';
import {Product} from '../offering/model/product.model';
import {UpdateProductDTO} from './model/update-product-dto.model';
import {UpdatedProductDTO} from './model/updated-product-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) {}

  create(product:CreateProductDTO) : Observable<Product> {
    return this.httpClient.post<Product>(environment.apiHost + "/products", product);
  }

  update(id:number, product:UpdateProductDTO) : Observable<UpdatedProductDTO> {
    return this.httpClient.put<UpdatedProductDTO>(environment.apiHost + "/products/"+id, product);
  }

  get(id:number) : Observable<Product> {
    return this.httpClient.get<Product>(environment.apiHost + `/products/` + id);
  }

  delete(id:number):Observable<void>{
    return this.httpClient.delete<void>(environment.apiHost + "/products/"+id);
  }
}
