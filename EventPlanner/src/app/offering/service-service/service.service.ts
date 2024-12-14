import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateServiceDTO } from '../model/create-service-dto.model';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment';
import { Service } from '../model/service.model';
import { EditServiceDTO } from '../model/edit-service-dto.model';

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
    
}
