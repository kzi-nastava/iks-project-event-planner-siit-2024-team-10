import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment';
import { PricelistItem } from '../model/pricelist-item.model';

@Injectable({
  providedIn: 'root'
})
export class PricelistService {

  constructor(private httpClient: HttpClient) { }
  getAll(): Observable<PricelistItem[]> {
    console.log("got into service")
    return this.httpClient.get<PricelistItem[]>(environment.apiHost+'/pricelist');
  }
}
