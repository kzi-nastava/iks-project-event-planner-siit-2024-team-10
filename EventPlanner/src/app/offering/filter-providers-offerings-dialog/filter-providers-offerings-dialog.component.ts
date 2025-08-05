import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter-providers-offerings-dialog',
  templateUrl: './filter-providers-offerings-dialog.component.html',
  styleUrls: ['./filter-providers-offerings-dialog.component.css','../../event/filter-events-dialog/filter-events-dialog.component.css']
})
export class FilterProvidersOfferingsDialogComponent {
  filterForm: FormGroup;

  eventTypes = ['Any', 'Conferention','Wedding','Meetup','Concert'];
  serviceCategories = ['Any', 'Decoration', 'Catering', 'Band'];

  selectedEventType: string = 'Any';
  selectedServiceCategory: string = 'Any';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterProvidersOfferingsDialogComponent>
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      type: [''],             
      availability: [''],     
      priceRange: this.fb.group({
        startPrice: [0],
        endPrice: [1000],
      }),
    });
  }

  get priceRangeGroup(): FormGroup {
    return this.filterForm.get('priceRange') as FormGroup;
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
