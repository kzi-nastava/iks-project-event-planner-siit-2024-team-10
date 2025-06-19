import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppNotification } from './model/notification.model';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../env/environment';
import { PagedResponse } from '../event/model/paged-response.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private stompClient: any;
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  connectToNotificationSocket(accountId: number) {
  const socket = new SockJS('http://localhost:8080/socket'); // ✅ Correct endpoint from backend
  this.stompClient = Stomp.over(socket);

  this.stompClient.connect({}, () => {
    const topic = `/socket-publisher/notifications/${accountId}`;
    this.stompClient.subscribe(topic, (message: { body: string }) => {
      const notification: AppNotification = JSON.parse(message.body);
      const current = this.notificationsSubject.getValue();
      this.notificationsSubject.next([notification, ...current]);
    });
  });
}


  getAll(page: number, size: number, accountId: number): Observable<PagedResponse<AppNotification>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<PagedResponse<AppNotification>>(`${environment.apiHost}/notifications/${accountId}`, { params });
  }

  readAll(accountId: number): Observable<AppNotification[]> {
    return this.httpClient.put<AppNotification[]>(`${environment.apiHost}/notifications/${accountId}/read-all`, null);
  }

  readNotification(notificationId: number): Observable<AppNotification> {
    return this.httpClient.put<AppNotification>(`${environment.apiHost}/notifications/read/${notificationId}`, null);
  }

  toggleNotification(accountId: number): Observable<AppNotification> {
    return this.httpClient.put<AppNotification>(`${environment.apiHost}/notifications/${accountId}/toggle`, null);
  }
}
