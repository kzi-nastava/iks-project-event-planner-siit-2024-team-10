import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter-events-dialog',
  templateUrl: './filter-events-dialog.component.html',
  styleUrls: ['./filter-events-dialog.component.scss']
})
export class FilterEventsDialogComponent {
  filterForm: FormGroup;

  eventTypes = ['None', 'Conferention','Wedding','Meetup','Concert'];

  selectedEventType: string = 'None';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterEventsDialogComponent>
  ) {
    this.filterForm = this.fb.group({
      description: [''],
      type: [''],
      location: [''],
      maxParticipants: [''],
      minRating: [1]
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;
    this.dialogRef.close(filters);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatLabel(value: number): string {
    return `${value}`;
  }
}
