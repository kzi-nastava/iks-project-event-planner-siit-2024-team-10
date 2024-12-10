import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EventType} from './model/event-type.model';
import {Observable} from 'rxjs';
import {environment} from '../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class EventTypeService {

  constructor(private httpClient: HttpClient) { }

  getAll() : Observable<EventType[]> {
    return this.httpClient.get<EventType[]>(environment.apiHost + `/event-types`);
  }
}
