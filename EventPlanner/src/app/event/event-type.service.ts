import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EventType} from './model/event-type.model';
import {Observable} from 'rxjs';
import {environment} from '../../env/environment';
import {CreateEventTypeDTO} from './model/create-event-type-dto.model';

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
}
