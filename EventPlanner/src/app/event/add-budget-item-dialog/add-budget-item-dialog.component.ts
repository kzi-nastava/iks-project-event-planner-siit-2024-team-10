// add-budget-item-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../offering/model/category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-budget-item-dialog',
  templateUrl: './add-budget-item-dialog.component.html',
})
export class AddBudgetItemDialogComponent {
  form: FormGroup;
  availableCategories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddBudgetItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[], usedCategories: Category[] },
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      category: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]]
    });

    const allCategories = data.categories;
    const usedCategories = data.usedCategories;

    this.availableCategories = allCategories.filter(cat =>
      !usedCategories.some(used => used.id === cat.id)
    );
  }

  submit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
