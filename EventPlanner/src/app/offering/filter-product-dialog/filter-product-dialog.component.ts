import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { Category } from '../model/category.model';
import { CategoryService } from '../category-service/category.service';
import { OfferingService } from '../offering-service/offering.service';

@Component({
  selector: 'app-filter-product-dialog',
  templateUrl: './filter-product-dialog.component.html',
  styleUrls: ['./filter-product-dialog.component.scss']
})
export class FilterProductDialogComponent implements OnInit {
  filterForm: FormGroup;
  categories: Observable<Category[]>;
  selectedProductCategory: string = 'Any';
  maxPrice: number = 10000;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterProductDialogComponent>,
    private categoryService: CategoryService,
    private offeringService: OfferingService
  ) {
    this.categories = this.categoryService.getAll().pipe(
          map(categories => [{ id: -1, name: 'Any', creatorId: -1 }, ...categories])
        );

    this.filterForm = this.fb.group({
      categoryId: [-1],
      location: [''],
      priceRange: this.fb.group({
        startPrice: [0],
        endPrice: [10000],
      }),
      checkAviailability:[false],
      minRating: [1.0],
      minDiscount: [0],
    });
  }

  ngOnInit(): void {
    this.offeringService.getHighestPrice(false).subscribe({
      next: (price) => {
        this.maxPrice = price || 10000;
        this.filterForm.get('priceRange.endPrice')?.setValue(this.maxPrice);
      }
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
    if (endPrice === 0){
      filters.endPrice = null;
    } else {
      filters.endPrice = endPrice;
    }
  
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
