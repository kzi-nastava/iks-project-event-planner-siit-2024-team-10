import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { Service } from '../model/service.model';
import { map, Observable, of } from 'rxjs';
import { Offering } from '../model/offering.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from '../../../env/environment';
import { PagedResponse } from '../../event/model/paged-response.model';
import { Comment } from '../model/comment.model';

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
  getTop(accountId:number | null): Observable<Offering[]> {
    const params: any = {};
  
    if (accountId !== null) {
      params.accountId = accountId.toString();
    }
  
      return this.httpClient.get<Offering[]>(environment.apiHost+'/offerings/top',{params: params});
    }

  getProducts(): Observable<Product[]> {
    return of(this.productList);
  }

  getComments(offeringId: number): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${environment.apiHost}/offerings/${offeringId}/comments`);
  }
  
  getOfferingsByProviderId(providerId: number): Observable<Offering[]> {
    return this.httpClient.get<Offering[]>(`${environment.apiHost}/offerings/provider/${providerId}`);
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
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
  
      return this.httpClient.get<PagedResponse<Offering>>(environment.apiHost+"/offerings", { params }).pipe(
            map((response: PagedResponse<Offering>) => {
              return response;
            })
          );
    }
    getHighestPrice(
      isService: boolean
    ): Observable<number> {
      return this.httpClient.get<number>(environment.apiHost+"/offerings/highest-prices", { params: new HttpParams().set('isService', isService.toString()) });
    }

  getOfferingById(id: number): Observable<Offering | undefined> {
    const allOfferings = [...this.productList, ...this.serviceList];
    const offering = allOfferings.find(o => o.id === id);
    return of(offering);
  }
}