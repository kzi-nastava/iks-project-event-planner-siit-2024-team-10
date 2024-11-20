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
      type: [''],
      location: [''],
      maxParticipants: [''],
      minRating: [1],
      range: this.fb.group({
        start: [null],
        end: [null],
      }),
    });
  }
  get rangeGroup(): FormGroup {
    return this.filterForm.get('range') as FormGroup;
  }

  applyFilters() {
    const filters = this.filterForm.value;

    const startDate = filters.range.start;
    const endDate = filters.range.end;

    console.log('Filters:', filters);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    this.dialogRef.close(filters);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatLabel(value: number): string {
    return `${value}`;
  }
}
