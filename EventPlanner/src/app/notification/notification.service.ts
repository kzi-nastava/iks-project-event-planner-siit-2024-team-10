import { Injectable } from '@angular/core';
import { AppNotification } from './model/notification.model'
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../env/environment';
import { PagedResponse } from '../event/model/paged-response.model';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private httpClient: HttpClient) {}

  getAll(page: number, pageSize: number, accountId: number): Observable<PagedResponse<AppNotification>> {
    let params = new HttpParams()
          .set('page', page.toString())
          .set('size', pageSize.toString());
    return this.httpClient.get<PagedResponse<AppNotification>>(environment.apiHost+'/notifications/'+accountId, {params: params});
  }
  readNotification(notificationId: number): Observable<AppNotification> {
    return this.httpClient.put<AppNotification>(environment.apiHost+'/notifications/'+notificationId+'/read',null);
  }
  readAll(accountId: number): Observable<AppNotification[]> {
    return this.httpClient.put<AppNotification[]>(environment.apiHost+'/notifications/'+accountId+'/read-all',null);
  }
  toggleNotification(accountId: number): Observable<AppNotification> {
    return this.httpClient.put<AppNotification>(environment.apiHost+'/notifications/'+accountId+'/toggle',null);
  }
}
