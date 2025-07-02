import { Injectable } from '@angular/core';
import {AuthService} from '../infrastructure/auth/auth.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {Event} from '../event/model/event.model';
import {environment} from '../../env/environment';
import { Offering } from '../offering/model/offering.model';
import {PagedResponse} from '../event/model/paged-response.model';
import {CalendarItem} from '../user/model/calendar-item.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private authService:AuthService,
              private httpClient:HttpClient) { }

  getFavouriteOfferings(page: number, pageSize: number): Observable<PagedResponse<Offering>> {
    let accountId: number = this.authService.getAccountId();
    if(accountId == null)
      return of();
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());
    return this.httpClient.get<PagedResponse<Offering>>(environment.apiHost + '/accounts/' + accountId + '/favourite-offerings', {params});
  }

  getFavouriteOffering(offeringId:number): Observable<Offering> {
    let accountId:number=this.authService.getAccountId();
    if(accountId == null)
      return of();
    return this.httpClient.get<Offering>(environment.apiHost+'/accounts/'+accountId+'/favourite-offerings/'+offeringId);
  }

  addOfferingToFavourites(offeringId:number): Observable<void> {
    let accountId:number=this.authService.getAccountId();
    if(accountId == null)
      return null;
    return this.httpClient.post<void>(environment.apiHost+'/accounts/'+accountId+'/favourite-offerings/'+ offeringId ,{"offeringId":offeringId});
  }

  removeOfferingFromFavourites(offeringId:number): Observable<void> {
    let accountId:number=this.authService.getAccountId();
    if(accountId == null)
      return null;
    return this.httpClient.delete<void>(environment.apiHost+'/accounts/'+accountId+'/favourite-offerings/'+offeringId);
  }

  getFavouriteEvents(page: number, pageSize: number): Observable<PagedResponse<Event>> {
    let accountId:number=this.authService.getAccountId();
    if(accountId == null)
      return of();
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());
    return this.httpClient.get<PagedResponse<Event>>(environment.apiHost+'/accounts/'+accountId+'/favourite-events',{params});
  }

  getFavouriteEvent(eventId:number): Observable<Event> {
    let accountId:number=this.authService.getAccountId();
    if(accountId == null)
      return of();
    return this.httpClient.get<Event>(environment.apiHost+'/accounts/'+accountId+'/favourite-events/'+eventId);
  }

  addEventToFavourites(eventId:number): Observable<void> {
    let accountId:number=this.authService.getAccountId();
    if(accountId == null)
      return null;
    return this.httpClient.post<void>(environment.apiHost+'/accounts/'+accountId+'/favourite-events',{"eventId":eventId});
  }

  removeEventFromFavourites(eventId:number): Observable<void> {
    let accountId:number=this.authService.getAccountId();
    if(accountId == null)
      return null;
    return this.httpClient.delete<void>(environment.apiHost+'/accounts/'+accountId+'/favourite-events/'+eventId);
  }

  getCalendar(accountId:number):Observable<CalendarItem[]>{
    return this.httpClient.get<CalendarItem[]>(environment.apiHost+'/accounts/'+accountId+'/calendar');
  }
}
