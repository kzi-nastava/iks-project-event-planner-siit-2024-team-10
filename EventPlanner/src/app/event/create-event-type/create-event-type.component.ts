import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Category} from '../../offering/model/category.model';
import {CategoryService} from '../../offering/category-service/category.service';
import {CreateEventTypeDTO} from '../model/create-event-type-dto.model';

@Component({
  selector: 'app-create-event-type',
  templateUrl: './create-event-type.component.html',
  styleUrl: './create-event-type.component.css'
})
export class CreateEventTypeComponent implements OnInit{
  createForm: FormGroup= new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    recommendedCategories: new FormControl(''),
  });
  allCategories:Category[];

  constructor(
    public dialogRef: MatDialogRef<CreateEventTypeComponent>,
    private categoryService:CategoryService
  ){}

  ngOnInit(): void {
    this.categoryService.fetchCategories().subscribe({
      next: (categories:Category[]) => {
        this.allCategories=categories.filter(x=>!x.deleted);
      },
      error: (_) => {
        console.log("Error loading categories")
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if(this.createForm.valid){
      const eventType:CreateEventTypeDTO={
        name:this.createForm.value.name,
        description:this.createForm.value.description,
        recommendedCategoryIds: this.createForm.value.recommendedCategories
          ? this.createForm.value.recommendedCategories.map((x: Category) => x.id)
          : []
      }
      this.dialogRef.close(eventType);
    }
  }
}
