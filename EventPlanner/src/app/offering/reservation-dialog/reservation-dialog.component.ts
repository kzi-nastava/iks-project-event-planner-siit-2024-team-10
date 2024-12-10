import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.css']
})
export class ReservationDialogComponent {
  reservationForm: FormGroup;

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReservationDialogComponent>
  ) {
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
