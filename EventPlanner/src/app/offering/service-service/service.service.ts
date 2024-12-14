import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateServiceDTO } from '../model/create-service-dto.model';
import { map, Observable } from 'rxjs';
import { environment } from '../../../env/environment';
import { Service } from '../model/service.model';
import { EditServiceDTO } from '../model/edit-service-dto.model';
import { PagedResponse } from '../../event/model/paged-response.model';
import { Offering } from '../model/offering.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private httpClient: HttpClient) { }

    getAll() : Observable<Service[]> {
      return this.httpClient.get<Service[]>(environment.apiHost + `/services`);
    }
    getById(id:number) : Observable<Service> {
      return this.httpClient.get<Service>(environment.apiHost + `/services/` + id);
    }
    add(service:CreateServiceDTO) : Observable<Service> {
      return this.httpClient.post<Service>(environment.apiHost + "/services", service);
    }
    edit(id:number, service:EditServiceDTO) : Observable<Service> {
      console.log(service)
      return this.httpClient.put<Service>(environment.apiHost + "/services/" + service.id, service);
    }
    delete(id:number) : Observable<Service> {
      return this.httpClient.delete<Service>(environment.apiHost + "/services/"+id);
    }
    getPaginatedOfferings(
      page: number,
      pageSize: number,
      filters: any = {}
    ): Observable<PagedResponse<Service>> {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('size', pageSize.toString());
  
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
  
      return this.httpClient.get<PagedResponse<Service>>(environment.apiHost+"/services", { params }).pipe(
      map((response: PagedResponse<Service>) => {
        console.log('Paginated response:', response);
  
        // Log each service individually
        if (response.content) {
          response.content.forEach((service: Service) => {
            console.log('Service:', service);
          });
        }
  
        return response;
      })
    );
    }
}
