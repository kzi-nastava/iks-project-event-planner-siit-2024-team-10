import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-category-dialog',
  templateUrl: './create-category-dialog.component.html',
  styleUrl: './create-category-dialog.component.css'
})
export class CreateCategoryDialogComponent {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateCategoryDialogComponent>
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(30)
      ]]
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const categoryName = this.categoryForm.get('categoryName')?.value.trim();
      this.dialogRef.close(categoryName);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}