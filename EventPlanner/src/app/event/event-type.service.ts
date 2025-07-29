import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EventType} from './model/event-type.model';
import {Observable} from 'rxjs';
import {environment} from '../../env/environment';
import {CreateEventTypeDTO} from './model/create-event-type-dto.model';
import {EditEventTypeDTO} from './model/edit-event-type-dto.model';

@Injectable({
  providedIn: 'root'
})
export class EventTypeService {

  constructor(private httpClient: HttpClient) { }

  getAll() : Observable<EventType[]> {
    return this.httpClient.get<EventType[]>(environment.apiHost + `/event-types`);
  }

  add(eventType:CreateEventTypeDTO) : Observable<EventType> {
    return this.httpClient.post<EventType>(environment.apiHost + "/event-types", eventType);
  }

  edit(eventType:EditEventTypeDTO) : Observable<EventType> {
    return this.httpClient.put<EventType>(environment.apiHost + "/event-types/"+eventType.id, eventType);
  }

  deactivate(id:number) : Observable<EventType> {
    return this.httpClient.delete<EventType>(environment.apiHost + "/event-types/"+id);
  }

  activate(id:number) : Observable<EventType> {
    return this.httpClient.put<EventType>(environment.apiHost + "/event-types/"+id+'/activate',null);
  }
}
