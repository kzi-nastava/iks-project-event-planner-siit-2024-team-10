import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../offering/category-service/category.service';
import { Category } from '../offering/model/category.model';

@Component({
  selector: 'app-change-category-dialog',
  templateUrl: './change-category-dialog.component.html',
  styleUrls: ['./change-category-dialog.component.css']
})
export class ChangeCategoryDialogComponent implements OnInit {
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  currentCategory: Category;

  constructor(
    public dialogRef: MatDialogRef<ChangeCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentCategory: Category },
    private categoryService: CategoryService
  ) {
    this.currentCategory = data.currentCategory;
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories
          .filter(category => !category.deleted && !category.pending)
          .sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.selectedCategoryId) {
      const selectedCategory = this.categories.find(cat => cat.id === this.selectedCategoryId);
      this.dialogRef.close(selectedCategory);
    }
  }

  isConfirmDisabled(): boolean {
    return !this.selectedCategoryId || this.selectedCategoryId === this.currentCategory.id;
  }
}