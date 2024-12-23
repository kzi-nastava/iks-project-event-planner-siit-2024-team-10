import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Category } from '../model/category.model';
import { CategoryService } from '../category-service/category.service';

@Component({
  selector: 'app-filter-service-dialog',
  templateUrl: './filter-service-dialog.component.html',
  styleUrls: ['./filter-service-dialog.component.scss']
})
export class FilterServiceDialogComponent {
  filterForm: FormGroup;
  categories: Observable<Category[]>;
  selectedServiceCategory: string = 'Any';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterServiceDialogComponent>,
    private categoryService: CategoryService,
  ) {
    this.categories = this.categoryService.getAll().pipe(
      map(categories => [{ id: -1, name: 'Any' }, ...categories])
    );

    this.filterForm = this.fb.group({
      categoryId: [-1],
      location: [''],
      priceRange: this.fb.group({
        startPrice: [0],
        endPrice: [1000],
      }),
      checkAviailability:[false],
      minRating: [1.0],
      minDiscount: [0],
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
    const filters = { ...this.filterForm.value };

    if (this.filterForm.value.categoryId === -1 || this.selectedServiceCategory === 'Any') {
      this.filterForm.value.categoryId = null;
    }

    const { startPrice, endPrice } = filters.priceRange;

    filters.startPrice = startPrice;
    filters.endPrice = endPrice;

    if(!filters.checkAviailability){
      filters.isAvailable = null;
    }
    delete filters.checkAviailability;
    filters.isServiceFilter = true;
  
    this.dialogRef.close(filters);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatLabel(value: number): string {
    return `${value}`;
  }
}
