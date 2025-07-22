import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { EventService } from '../../event/event.service';
import { Event } from '../../event/model/event.model';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { BudgetItemService } from '../../event/budget-item.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../layout/confirm-dialog/confirm-dialog.component';
import { Product } from '../../offering/model/product.model';
import { ReservationService } from '../reservation-service/reservation.service';

@Component({
  selector: 'app-product-reservation-dialog',
  templateUrl: './product-reservation-dialog.component.html',
  styleUrls: ['./product-reservation-dialog.component.css']
})
export class ProductReservationDialogComponent implements OnInit {
  reservationForm: FormGroup;
  events: Event[] = [];
  snackBar = inject(MatSnackBar);
  errorMsg = '';
  accountId = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { offering: Product },
    private dialogRef: MatDialogRef<ProductReservationDialogComponent>,
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private budgetItemService: BudgetItemService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.reservationForm = this.fb.group({
      event: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.accountId = this.authService.getAccountId().toString();;
    this.reservationService.findEventsByOrganizer(this.accountId).subscribe(events => {
      if (events.length === 0) {
        this.errorMsg = 'No events found.';
        this.snackBar.open(this.errorMsg, 'Close', { duration: 3000 });
      } else {
        this.events = events;
      }
    });
  }

  onConfirm(): void {
    if (this.reservationForm.valid) {
      const selectedEvent = this.reservationForm.value.event;
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          message: `Add product "${this.data.offering.name}" to event "${selectedEvent.name}"?`
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.snackBar.open('Processing...', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['warning-snackbar']
          });

          this.budgetItemService.buy(selectedEvent.id, this.data.offering.id).subscribe({
            next: (success: boolean) => {
              if (success) {
                this.snackBar.open('Product successfully added to budget.', 'OK', { duration: 5000 });
              } else {
                this.snackBar.open('Product not purchased', 'Close', { duration: 5000 });
              }
              this.dialogRef.close(success);
            },
            error: (err) => {
              this.snackBar.open(err.error, 'Close', { duration: 5000 });
              console.error(err);
            }
          });          
        }
      });
    } else {
      this.errorMsg = 'Please select an event.';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
