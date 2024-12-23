import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { Category } from '../model/category.model';
import { CategoryService } from '../category-service/category.service';

@Component({
  selector: 'app-filter-product-dialog',
  templateUrl: './filter-product-dialog.component.html',
  styleUrls: ['./filter-product-dialog.component.scss']
})
export class FilterProductDialogComponent {
  filterForm: FormGroup;
  categories: Observable<Category[]>;
  selectedProductCategory: string = 'Any';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterProductDialogComponent>,
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
        endPrice: [100000],
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
    const filters = { ...this.filterForm.value };

    if (this.filterForm.value.categoryId === -1) {
      filters.categoryId = null;
    }

    const { startPrice, endPrice } = filters.priceRange;

    filters.startPrice = startPrice;
    filters.endPrice = endPrice;
  
    delete filters.priceRange;

    if(!filters.checkAviailability){
      filters.isAvailable = null;
    } else{
      filters.isAvailable = true;
    }
    delete filters.checkAviailability;
    filters.isServiceFilter = false;
  
    this.dialogRef.close(filters);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatLabel(value: number): string {
    return `${value}`;
  }
}
