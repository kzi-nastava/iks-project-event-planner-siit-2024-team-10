import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Category } from '../model/category.model';
import { CategoryService } from '../category-service/category.service';
import { OfferingService } from '../offering-service/offering.service';

@Component({
  selector: 'app-filter-service-dialog',
  templateUrl: './filter-service-dialog.component.html',
  styleUrls: ['./filter-service-dialog.component.scss']
})
export class FilterServiceDialogComponent {
  filterForm: FormGroup;
  categories: Observable<Category[]>;
  selectedServiceCategory: string = 'Any';
  maxPrice: number = 100000;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterServiceDialogComponent>,
    private categoryService: CategoryService,
    private offeringService: OfferingService
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
      serviceDuration:[0],
    });
  }

  ngOnInit(): void {
    this.offeringService.getHighestPrice(true).subscribe({
      next: (price) => {
        this.maxPrice = price || 10000;
        this.filterForm.get('priceRange.endPrice')?.setValue(this.maxPrice);
      },
      error: (err) => {
        console.error('Failed to fetch max price:', err);
      },
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

    if (this.filterForm.value.serviceDuration === 0) {
      filters.serviceDuration = null;
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
    }else{
      filters.isAvailable = true;
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
