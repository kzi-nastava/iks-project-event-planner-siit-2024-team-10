import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.css']
})
export class ReservationDialogComponent {
  reservationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reservationForm = this.fb.group({
      selectedDate: [null, Validators.required],
      eventType: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  onDateChange(date: Date): void {
    this.reservationForm.patchValue({ selectedDate: date });
  }

  onBook() {
    if (this.reservationForm.valid) {
      const reservationData = this.reservationForm.value;
      console.log('Reservation Details:', reservationData);

      const selectedDate = reservationData.selectedDate;
      const eventType = reservationData.eventType;
      const startTime = reservationData.startTime;
      const endTime = reservationData.endTime;

      console.log('Date:', selectedDate);
      console.log('Event:', eventType);
      console.log('Start Time:', startTime);
      console.log('End Time:', endTime);
    } else {
      console.error('Form is invalid');
    }
  }
}
