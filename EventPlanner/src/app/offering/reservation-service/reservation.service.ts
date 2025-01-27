import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Event } from '../../event/model/event.model';
import { environment } from '../../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private httpClient: HttpClient) {}
  findEventsByOrganizer(accountId: string): Observable<Event[]> {
    return this.httpClient.get<Event[]>(environment.apiHost+`/events/organizers`, {params: {accountId: accountId}});
  }
  
}
