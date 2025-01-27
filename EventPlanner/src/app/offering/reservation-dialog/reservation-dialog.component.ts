import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReservationService } from '../reservation-service/reservation.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { Event } from '../../event/model/event.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../layout/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.css']
})
export class ReservationDialogComponent implements OnInit {
  reservationForm: FormGroup;
  accountId: string = '';
  events: Event[] = [];
  service: any;
  snackBar:MatSnackBar = inject(MatSnackBar);
  errorMsg: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReservationDialogComponent>,
    private reservationService: ReservationService,
    private authService: AuthService,
    private dialog: MatDialog) {
   {
    this.reservationForm = this.fb.group({
      event: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }
}
ngOnInit(): void {
  this.service = this.data;
  this.accountId = this.authService.getAccountId().toString();

  this.reservationService.findEventsByOrganizer(this.accountId).subscribe(events => {
    if (events.length === 0) {
      this.errorMsg = 'No events found, cannot make reservation.';
      this.snackBar.open('No events found', 'Close', {
        duration: 3000
      });
    } else{
      this.events = events;
    }
  });
}

onBook(): void {
  if (this.reservationForm.valid) {
    const reservationData = this.reservationForm.value;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: "Is this the correct data? \nReserving service for " +
                 reservationData.event.date + "\nfor event " + reservationData.event.name +
                 "\nfrom " + reservationData.startTime + " to " + reservationData.endTime
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dialogRef.close(reservationData);
        this.snackBar.open('Email confirmation has been sent!', 'Close', {        
              duration: 3000
        });
      }
    });
  } else {
    this.errorMsg='Please fill in all fields';
  }
}

  onClose(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: "Are you sure you want to close? All your data will be lost."
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dialogRef.close();
      }
    });
  }
}
