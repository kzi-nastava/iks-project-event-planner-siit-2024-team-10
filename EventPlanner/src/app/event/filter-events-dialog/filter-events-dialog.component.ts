import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventTypeService } from '../event-type.service';
import {Observable} from 'rxjs';
import { EventType } from '../model/event-type.model';

@Component({
  selector: 'app-filter-events-dialog',
  templateUrl: './filter-events-dialog.component.html',
  styleUrls: ['./filter-events-dialog.component.scss']
})
export class FilterEventsDialogComponent {
  filterForm: FormGroup;
  eventTypes: Observable<EventType[]>;

  selectedEventType: string = 'Any';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterEventsDialogComponent>,
    private eventTypeService: EventTypeService
  ) {
    this.eventTypes = this.eventTypeService.getAll();

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
    console.log('Filters:', filters);

    this.dialogRef.close(filters);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatLabel(value: number): string {
    return `${value}`;
  }
}
