import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment';
import { PricelistItem } from '../model/pricelist-item.model';
import { EditPricelistItemDTO } from '../model/edit-pricelist-dto.model';

@Injectable({
  providedIn: 'root'
})
export class PricelistService {

  constructor(private httpClient: HttpClient) { }
  getAll(): Observable<PricelistItem[]> {
    console.log("got into service")
    return this.httpClient.get<PricelistItem[]>(environment.apiHost+'/pricelists');
  }
  edit(item:EditPricelistItemDTO) : Observable<PricelistItem> {
    return this.httpClient.put<PricelistItem>(environment.apiHost + "/pricelists/"+item.offeringId, item);
  }
  generateReport(): Observable<Blob> {
    return this.httpClient.get(environment.apiHost + '/reports/pricelists', {
      responseType: 'blob'
    });
  }
}
