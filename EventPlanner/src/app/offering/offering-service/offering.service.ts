import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { Service } from '../model/service.model';
import { map, Observable, of } from 'rxjs';
import { Offering } from '../model/offering.model';
import { Location } from '../../event/model/location.model';
import { GetProvider } from '../../user/model/get_provider.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from '../../../env/environment';
import { PagedResponse } from '../../event/model/paged-response.model';


@Injectable({
  providedIn: 'root'
})
export class OfferingService {
  private productList: Product[] = [];
  private serviceList: Service[] = [];

  constructor(private httpClient: HttpClient) {

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
    console.log("got in");
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
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
  
      return this.httpClient.get<PagedResponse<Offering>>(environment.apiHost+"/offerings", { params }).pipe(
            map((response: PagedResponse<Offering>) => {
              console.log('Paginated response:', response);
        
              // Log each service individually
              if (response.content) {
                response.content.forEach((service: Offering) => {
                  console.log('Service:', service);
                });
              }
        
              return response;
            })
          );
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