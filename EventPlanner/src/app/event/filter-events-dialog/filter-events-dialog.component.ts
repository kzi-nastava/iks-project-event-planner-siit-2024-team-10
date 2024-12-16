import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventTypeService } from '../event-type.service';
import {map, Observable} from 'rxjs';
import { EventType } from '../model/event-type.model';
import { DatePipe } from '@angular/common';

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
    private eventTypeService: EventTypeService,
  ) {
    this.eventTypes = this.eventTypeService.getAll().pipe(
      map(eventTypes => [{ id: -1, name: 'Any' }, ...eventTypes])
    );

    this.filterForm = this.fb.group({
      eventTypeId: [-1],
      location: [''],
      maxParticipants: [''],
      minRating: [0],
      range: this.fb.group({
        startDate: [null],
        endDate: [null],
      }),
    });
  }
  get rangeGroup(): FormGroup {
    return this.filterForm.get('range') as FormGroup;
  }

  applyFilters() {
    if (this.filterForm.value.eventTypeId === -1 || this.selectedEventType === 'Any') {
      this.filterForm.value.eventTypeId = null;
    }
  
    const filters = { ...this.filterForm.value };
  
    const { startDate, endDate } = filters.range;
  
    if (startDate) {
      filters.startDate = this.formatDate(startDate);
    }
  
    if (endDate) {
      filters.endDate = this.formatDate(endDate);
    }
  
    delete filters.range;
  
    this.dialogRef.close(filters);
  }
  

  closeDialog() {
    this.dialogRef.close();
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  formatDate(date: any): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'MM/dd/yyyy')!;
  }
}
