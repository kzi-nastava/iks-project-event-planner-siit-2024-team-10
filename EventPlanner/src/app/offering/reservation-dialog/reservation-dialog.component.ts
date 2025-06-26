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
import { CreateReservationDTO } from '../model/create-reservation-dto.model';
import { Reservation } from '../model/reservation.model';
import { BudgetItemService } from '../../event/budget-item.service';
import { UpdateBudgetItemDTO } from '../model/edit-budget-item-dto.model';

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
  errorMsg: string = '';
  calculatedEndTime: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReservationDialogComponent>,
    private reservationService: ReservationService,
    private authService: AuthService,
    private budgetItemService: BudgetItemService,
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
  this.accountId = this.authService.getAccountId().toString();

  const offering = this.data.offering;
    
    if (offering.minDuration === offering.maxDuration) {
      this.reservationForm.get('endTime')?.disable();
    }

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

  this.reservationForm.get('startTime')?.valueChanges.subscribe(startTime => {
    if (offering.minDuration === offering.maxDuration && startTime) {
      this.onStartTimeChange();
    }
  });
}

onBook(): void {
  if (this.reservationForm.valid) {
    const reservationData = this.reservationForm.value;
    reservationData.endTime = this.reservationForm.get('endTime')?.value; // dont touch this

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

        this.snackBar.open('Processing reservation...', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['warning-snackbar']
      });

        let reservation : CreateReservationDTO ={
          startTime: reservationData.startTime,
          endTime: reservationData.endTime,
          event: reservationData.event.id,
          service: this.data.offering.id
        }

        this.reservationService.createReservation(reservation).subscribe({
          next: (response: Reservation) => {
            if (response.status == "PENDING"){
              this.snackBar.open('Reservation request is pending! Email confirmation will been sent.', 'OK', { duration: 5000 });
            }
            else {
              const finalAmount = this.data.offering.discount 
                ? this.data.offering.price * (1 - this.data.offering.discount / 100)
                : this.data.offering.price;

                this.budgetItemService.buy(reservationData.event.id, this.data.offering.id).subscribe({
                  next: (success: boolean) => {
                    if (success) {
                      this.snackBar.open('Reservation successful! Budget updated. Email confirmation has been sent.', 'OK', { duration: 5000 });
                    } else {
                      this.snackBar.open('Reservation successful, but not enough budget to record the purchase.', 'OK', { duration: 5000 });
                    }
                  },
                  error: (error) => {
                    console.error('Failed to update budget:', error);
                    this.snackBar.open('Reservation successful, but failed to update budget.', 'OK', { duration: 5000 });
                  }
                });                
      }
            
            this.dialogRef.close(response);
          },
          error: (err: Error) => { 
            this.errorMsg = err.message;
            this.snackBar.open(this.errorMsg, 'OK', { duration: 5000 });
          }
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
  
  // In case of a fixed service time, this function calculates the end time based on the start time and the duration of the service
   onStartTimeChange(): void {
    const startTime = this.reservationForm.get('startTime')?.value;
    const minDuration = this.data.offering.minDuration;

    if (startTime && minDuration) {
      const startDate = new Date(`1970-01-01T${startTime}:00`);
      const endDate = new Date(startDate.getTime() + minDuration * 60 * 60 * 1000);

      const hours = endDate.getHours().toString().padStart(2, '0');
      const minutes = endDate.getMinutes().toString().padStart(2, '0');
      this.calculatedEndTime = `${hours}:${minutes}`;
      
    if (!this.reservationForm.contains('endTime')) {
      this.reservationForm.addControl('endTime', this.fb.control(this.calculatedEndTime, Validators.required));
    }

    this.reservationForm.get('endTime')?.setValue(this.calculatedEndTime);
    
    this.reservationForm.get('endTime')?.updateValueAndValidity();
    }
  }
}
