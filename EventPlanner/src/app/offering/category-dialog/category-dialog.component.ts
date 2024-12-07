import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../model/category.model';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.css'
})

export class CategoryDialogComponent {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', category?: Category }
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    // if editing, populate form with existing data
    if (data.mode === 'edit' && data.category) {
      this.categoryForm.patchValue({
        name: data.category.name,
        description: data.category.description
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      
      // for add, create a new category object
      if (this.data.mode === 'add') {
        const newCategory = {
          ...formValue,
          id: 0, // this will be assigned by the backend
          isDeleted: false,
          isPending: true
        };
        this.dialogRef.close(newCategory);
      } 
      // for edit, update existing category
      else {
        const updatedCategory = {
          ...this.data.category,
          ...formValue
        };
        this.dialogRef.close(updatedCategory);
      }
    }
  }
}