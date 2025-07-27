import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EventType} from '../model/event-type.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../offering/model/category.model';
import {CategoryService} from '../../offering/category-service/category.service';
import {CreateEventTypeDTO} from '../model/create-event-type-dto.model';
import {EditEventTypeDTO} from '../model/edit-event-type-dto.model';

@Component({
  selector: 'app-edit-event-type',
  templateUrl: './edit-event-type.component.html',
  styleUrl: './edit-event-type.component.css'
})
export class EditEventTypeComponent implements OnInit{
  editForm: FormGroup= new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    recommendedCategories: new FormControl(''),
  });
  allCategories:Category[];

  constructor(
    public dialogRef: MatDialogRef<EditEventTypeComponent>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: EventType
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if(this.editForm.valid) {
      const eventType: EditEventTypeDTO = {
        id:this.data.id,
        description: this.editForm.value.description,
        recommendedCategoryIds: this.editForm.value.recommendedCategories
          ? this.editForm.value.recommendedCategories.map((x: Category) => x.id)
          : []
      }
      this.dialogRef.close(eventType);
    }
  }

  ngOnInit(): void {
    this.editForm.controls['name'].disable()
    this.categoryService.getAll().subscribe({
      next: (categories:Category[]) => {
        this.allCategories = categories.filter((x) => !x.deleted);

        // Pre-select categories if data.recommendedCategories exists
        if (this.data?.recommendedCategories) {
          const selectedCategories = this.allCategories.filter(category =>
            this.data.recommendedCategories.some((selected: Category) => selected.id === category.id)
          );
          this.editForm.patchValue({
            recommendedCategories: selectedCategories
          });
        }
        this.editForm.patchValue({
          name: this.data.name,
          description: this.data.description,
        });
      }
    });
  }
}
