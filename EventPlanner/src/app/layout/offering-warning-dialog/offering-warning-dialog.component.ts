import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-offering-warning-dialog',
  templateUrl: './offering-warning-dialog.component.html',
  styleUrls: ['./offering-warning-dialog.component.css']
})
export class OfferingWarningDialogComponent {

  constructor(public dialogRef: MatDialogRef<OfferingWarningDialogComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
