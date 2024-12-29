import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Event } from './model/event.model';
import {CreateEventTypeDTO} from './model/create-event-type-dto.model';
import {EventType} from './model/event-type.model';
import {environment} from '../../env/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CreateEventDTO} from './model/create-event-dto.model';
import { PagedResponse } from './model/paged-response.model';
import {AgendaItem} from './model/agenda-item.model';
import {CreateEventRatingDTO} from './model/create-event-rating-dto.model';
import {CreatedEventRatingDTO} from './model/created-event-rating-dto.model';

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

  addRating(eventId:number,rating:CreateEventRatingDTO) : Observable<CreatedEventRatingDTO> {
    return this.httpClient.post<CreatedEventRatingDTO>(environment.apiHost + "/events/"+eventId+"/ratings", rating);
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
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.httpClient.get<PagedResponse<Event>>(environment.apiHost+"/events", { params });
  }
}
