import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter-service-dialog',
  templateUrl: './filter-service-dialog.component.html',
  styleUrls: ['./filter-service-dialog.component.scss']
})
export class FilterServiceDialogComponent {
  filterForm: FormGroup;

  eventTypes = ['Any', 'Conferention','Wedding','Meetup','Concert'];
  serviceCategories = ['Any', 'Decoration', 'Catering', 'Band'];

  selectedEventType: string = 'Any';
  selectedServiceCategory: string = 'Any';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterServiceDialogComponent>
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      location: [''],
      priceRange: this.fb.group({
        startPrice: [0],
        endPrice: [1000],
      }),
      checkAviailability:[false],
      minRating: [1.0],
      minDiscount: [0],
      dateRange: this.fb.group({
        start: [null],
        end: [null],
      }),
      duration:[0],
    });
  }
  get dateRangeGroup(): FormGroup {
    return this.filterForm.get('dateRange') as FormGroup;
  }
  get priceRangeGroup(): FormGroup {
    return this.filterForm.get('priceRange') as FormGroup;
  }

  applyFilters() {
    const filters = this.filterForm.value;

    const startDate = filters.dateRange.start;
    const endDate = filters.dateRange.end;

    const startPrice = filters.priceRange.startPrice;
    const endPrice = filters.priceRange.endPrice;

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
