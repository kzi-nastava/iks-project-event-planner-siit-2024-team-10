import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Event } from '../../event/model/event.model';
import { environment } from '../../../env/environment';
import { Reservation } from '../model/reservation.model';
import { CreateReservationDTO } from '../model/create-reservation-dto.model';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private httpClient: HttpClient) {}
  findEventsByOrganizer(accountId: string): Observable<Event[]> {
    return this.httpClient.get<Event[]>(environment.apiHost+`/reservations/events/`+accountId);
  }
  createReservation(reservation: CreateReservationDTO): Observable<Reservation> {
    return this.httpClient.post<Reservation>(environment.apiHost+`/reservations`, reservation).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = error.error || 'An unexpected error occurred';
        console.log(error)
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  getPendingReservations(accountId: number): Observable<Reservation[]> {
    return this.httpClient.get<Reservation[]>(environment.apiHost+'/reservations/'+accountId+'/pending');
  }

  acceptReservation(reservationId: number): Observable<void> {
  return this.httpClient.put<void>(environment.apiHost + `/reservations/${reservationId}/accept`, {});
}

  denyReservation(reservationId: number): Observable<void> {
    return this.httpClient.put<void>(environment.apiHost + `/reservations/${reservationId}/reject`, {});
  }
}
