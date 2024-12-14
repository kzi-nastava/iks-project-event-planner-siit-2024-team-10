import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateServiceDTO } from '../model/create-service-dto.model';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment';
import { Service } from '../model/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private httpClient: HttpClient) { }

    add(service:CreateServiceDTO) : Observable<Service> {
      console.log(service)
      return this.httpClient.post<Service>(environment.apiHost + "/services", service);
    }
}
