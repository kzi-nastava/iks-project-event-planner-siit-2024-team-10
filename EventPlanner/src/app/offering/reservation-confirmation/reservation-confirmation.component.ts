import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Reservation } from '../model/reservation.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ReservationService } from '../reservation-service/reservation.service';
import { AuthService } from '../../infrastructure/auth/auth.service';

@Component({
  selector: 'app-reservation-confirmation',
  templateUrl: './reservation-confirmation.component.html',
  styleUrl: './reservation-confirmation.component.css'
})
export class ReservationConfirmationComponent implements OnInit{
  dataSource: MatTableDataSource<Reservation>;
  displayedColumns: string[] = ['service', 'startTime', 'endTime', 'event', 'actions'];
  snackBar: MatSnackBar = inject(MatSnackBar);
  @ViewChild(MatSort) sort!: MatSort;
  accountId: number;

  constructor(private service:ReservationService,
              private authService: AuthService) {}
  
  ngOnInit(): void {
    this.accountId = this.authService.getAccountId();
    this.refreshDataSource();
  }
  private refreshDataSource() {
    this.service.getPendingReservations(this.accountId).subscribe({
      next: (reservations: Reservation[]) => {
        reservations.sort((a, b) => a.service.name.localeCompare(b.service.name));
        this.dataSource = new MatTableDataSource<Reservation>(reservations);
        this.dataSource.sort = this.sort;
      },
      error: (_) => {
        this.snackBar.open("There has been an error loading reservations", "Close", { duration: 5000 });
      }
    })
  }


    accept(reservationId: number) {
      this.service.acceptReservation(reservationId).subscribe({
        next: () => {
          this.snackBar.open("Reservation accepted", "Close", { duration: 3000 });
          this.refreshDataSource();
        },
        error: () => {
          this.snackBar.open("Failed to accept reservation", "Close", { duration: 3000 });
        }
      });
    }

  deny(reservationId: number) {
    this.service.denyReservation(reservationId).subscribe({
      next: () => {
        this.snackBar.open("Reservation denied", "Close", { duration: 3000 });
        this.refreshDataSource();
      },
      error: () => {
        this.snackBar.open("Failed to deny reservation", "Close", { duration: 3000 });
      }
    });
  }

}
