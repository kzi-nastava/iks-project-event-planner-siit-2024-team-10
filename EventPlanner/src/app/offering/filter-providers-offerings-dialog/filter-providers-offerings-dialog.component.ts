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

  eventTypes = ['None', 'Conference', 'Wedding', 'Meetup', 'Concert'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterProvidersOfferingsDialogComponent>
  ) {
    this.filterForm = this.fb.group({
      type: [''],             // Event Type
      availability: [''],     // Available/Not Available
      minPrice: [''],         // Minimum Price
      maxPrice: [''],         // Maximum Price
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;

    console.log('Filters:', filters);

    // Pass filters back to the parent component or service
    this.dialogRef.close(filters);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
