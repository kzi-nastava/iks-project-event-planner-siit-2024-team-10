import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from './model/event.model';
import {CreateEventTypeDTO} from './model/create-event-type-dto.model';
import {EventType} from './model/event-type.model';
import {environment} from '../../env/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CreateEventDTO} from './model/create-event-dto.model';
import { PagedResponse } from './model/paged-response.model';
import {AgendaItem} from './model/agenda-item.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventList: Event[] = [];
  private topEventList: Event[] = [];

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Event[]> {
    return this.httpClient.get<Event[]>(environment.apiHost+'/events/all');
  }

  getTop(): Observable<Event[]> {
    return this.httpClient.get<Event[]>(environment.apiHost+'/events/top');
  }

  getEvent(id:number): Observable<Event> {
    return this.httpClient.get<Event>(environment.apiHost+'/events/'+id);
  }

  getEventAgenda(eventId:number): Observable<AgendaItem[]> {
    return this.httpClient.get<AgendaItem[]>(environment.apiHost+'/events/'+eventId+'/agenda');
  }

  add(event:CreateEventDTO) : Observable<Event> {
    return this.httpClient.post<Event>(environment.apiHost + "/events", event);
  }

  getPaginatedEvents(
    page: number,
    pageSize: number,
    filters: any = {}
  ): Observable<PagedResponse<Event>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    return this.httpClient.get<PagedResponse<Event>>(environment.apiHost+"/events", { params });
  }
}
