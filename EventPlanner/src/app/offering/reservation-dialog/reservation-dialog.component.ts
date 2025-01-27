import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ReservationService } from '../reservation-service/reservation.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { Event } from '../../event/model/event.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.css']
})
export class ReservationDialogComponent implements OnInit {
  reservationForm: FormGroup;
  accountId: string = '';
  events: Event[] = [];
  snackBar:MatSnackBar = inject(MatSnackBar);


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReservationDialogComponent>,
    private reservationService: ReservationService,
    private authService: AuthService) {
   {
    this.reservationForm = this.fb.group({
      event: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }
}
ngOnInit(): void {
  this.accountId = this.authService.getAccountId().toString();

  this.reservationService.findEventsByOrganizer(this.accountId).subscribe(events => {
    this.events = events;
  });
}

  onBook(): void {
    if (this.reservationForm.valid) {
      const reservationData = this.reservationForm.value;
  
      this.dialogRef.close(reservationData);
    } else {
      console.error('Form is invalid');
    }
  }
  onClose(): void {
    this.dialogRef.close();
  }
}
