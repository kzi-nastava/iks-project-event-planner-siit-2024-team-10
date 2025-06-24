import { Injectable } from '@angular/core';
import {AuthService} from '../infrastructure/auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {Event} from '../event/model/event.model';
import {environment} from '../../env/environment';
import { Offering } from '../offering/model/offering.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private authService:AuthService,
              private httpClient:HttpClient) { }

  getFavouriteOfferings(): Observable<Offering[]> {
    let accountId:number=this.authService.getAccountId();
    if(accountId == null)
      return of([]);
    return this.httpClient.get<Offering[]>(environment.apiHost+'/accounts/'+accountId+'/favourite-offerings');
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
  getFavouriteEvents(): Observable<Event[]> {
    let accountId:number=this.authService.getAccountId();
    if(accountId == null)
      return of([]);
    return this.httpClient.get<Event[]>(environment.apiHost+'/accounts/'+accountId+'/favourite-events');
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
}
