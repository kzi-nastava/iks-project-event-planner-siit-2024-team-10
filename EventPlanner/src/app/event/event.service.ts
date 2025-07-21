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
import {CreateAgendaItemDTO} from './model/create-agenda-item-dto.model';
import {UpdateAgendaItemDTO} from './model/update-agenda-item-dto.model';
import {EventStats} from './model/event.stats.model';
import {UpdateEventDTO} from './model/update-event-dto.model';
import {UpdatedEventDTO} from './model/updated-event-dto.model';
import { GuestList } from './model/guest-list.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Event[]> {
    return this.httpClient.get<Event[]>(environment.apiHost+'/events/all');
  }

  getTop(accountId: number | null): Observable<Event[]> {
    const params: any = {};

    if (accountId !== null) {
      params.accountId = accountId.toString();
    }

    return this.httpClient.get<Event[]>(environment.apiHost + '/events/top', { params: params });
  }

  getEvent(id:number): Observable<Event> {
    return this.httpClient.get<Event>(environment.apiHost+'/events/'+id);
  }

  getMyEvents(id: number): Observable<Event[]> {
    const params = new HttpParams().set('accountId', id.toString());
    return this.httpClient.get<Event[]>(`${environment.apiHost}/events/organizers`, { params });
  }

  getEventAgenda(eventId:number): Observable<AgendaItem[]> {
    return this.httpClient.get<AgendaItem[]>(environment.apiHost+'/events/'+eventId+'/agenda');
  }

  getEventStats(eventId:number): Observable<EventStats> {
    return this.httpClient.get<EventStats>(environment.apiHost+'/events/'+eventId+'/stats');
  }

  getGuestList(eventId: number): Observable<GuestList>{
    return this.httpClient.get<GuestList>(environment.apiHost + '/events/' + eventId + '/guests');
  }

  addParticipant(eventId:number):Observable<EventStats> {
    return this.httpClient.post<EventStats>(environment.apiHost+'/events/'+eventId+'/stats/participants',null);
  }

  add(event:CreateEventDTO) : Observable<Event> {
    return this.httpClient.post<Event>(environment.apiHost + "/events", event);
  }

  update(event:UpdateEventDTO, eventId:number):Observable<UpdatedEventDTO>{
    return this.httpClient.put<UpdatedEventDTO>(environment.apiHost + "/events/"+eventId, event);
  }

  delete(eventId:number):Observable<void>{
    return this.httpClient.delete<void>(environment.apiHost + "/events/"+eventId);
  }

  addRating(eventId:number,rating:CreateEventRatingDTO) : Observable<CreatedEventRatingDTO> {
    return this.httpClient.post<CreatedEventRatingDTO>(environment.apiHost + "/events/"+eventId+"/ratings", rating);
  }

  addAgendaItem(eventId:number,agendaItem:CreateAgendaItemDTO) : Observable<AgendaItem> {
    return this.httpClient.post<AgendaItem>(environment.apiHost + "/events/"+eventId+"/agenda", agendaItem);
  }

  updateAgendaItem(eventId:number,agendaItemId:number,agendaItem:UpdateAgendaItemDTO) : Observable<AgendaItem> {
    return this.httpClient.put<AgendaItem>(environment.apiHost + "/events/"+eventId+"/agenda/"+agendaItemId, agendaItem);
  }

  deleteAgendaItem(eventId:number, agendaItemId:number) : Observable<void> {
    return this.httpClient.delete<void>(environment.apiHost + "/events/"+eventId+"/agenda/"+agendaItemId);
  }

  generateOpenEventReport(eventId:number): Observable<Blob> {
    return this.httpClient.get(environment.apiHost + '/events/'+eventId+'/reports/open-event',{
      responseType: 'blob'
    });
  }

  generateEventInfoReport(eventId:number): Observable<Blob> {
    return this.httpClient.get(environment.apiHost + '/events/'+eventId+'/reports/info',{
      responseType: 'blob'
    });
  }

  generateGuestlistReport(eventId:number): Observable<Blob> {
    return this.httpClient.get(environment.apiHost + '/events/'+eventId+'/reports/guestlist',{
      responseType: 'blob'
    });
  }

  sendGuestInvites(eventId: number, guests: string[]) {
    return this.httpClient.post(environment.apiHost + '/events/' + eventId + '/invite', { guests });
  }

  processInvitation(token: string, email: string) {
  return this.httpClient.post<void>(environment.apiHost + '/events/process-invitation?invitation-token=' + token, { email });
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
