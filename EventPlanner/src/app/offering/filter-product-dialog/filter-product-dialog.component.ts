import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter-product-dialog',
  templateUrl: './filter-product-dialog.component.html',
  styleUrls: ['./filter-product-dialog.component.scss']
})
export class FilterProductDialogComponent {
  filterForm: FormGroup;

  eventTypes = ['Any', 'Conferention','Wedding','Meetup','Concert'];
  productCategories = ['Any', 'Decoration', 'Catering', 'Fireworks'];

  selectedEventType: string = 'Any';
  selectedProductCategory: string = 'Any';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterProductDialogComponent>
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      type: [''],
      location: [''],
      priceRange: this.fb.group({
        startPrice: [0],
        endPrice: [1000],
      }),
      checkAviailability:[false],
      minRating: [1.0],
      minDiscount: [0],
    });
  }
  get priceRangeGroup(): FormGroup {
    return this.filterForm.get('priceRange') as FormGroup;
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
