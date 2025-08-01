import { Component } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {CreateEventTypeDTO} from '../model/create-event-type-dto.model';
import {Category} from '../../offering/model/category.model';
import {MatDialogRef} from '@angular/material/dialog';
import {CategoryService} from '../../offering/category-service/category.service';
import {CreateAgendaItemDTO} from '../model/create-agenda-item-dto.model';

@Component({
  selector: 'app-create-agenda-item',
  templateUrl: './create-agenda-item.component.html',
  styleUrl: './create-agenda-item.component.css'
})
export class CreateAgendaItemComponent {
  createForm: FormGroup= new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
  },
    { validators: TimeValidator('startTime','endTime') });

  constructor(
    public dialogRef: MatDialogRef<CreateAgendaItemComponent>
  ){}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if(this.createForm.valid){
      const agendaItem:CreateAgendaItemDTO={
        name:this.createForm.value.name,
        description:this.createForm.value.description,
        startTime:this.createForm.value.startTime,
        endTime:this.createForm.value.endTime,
        location:this.createForm.value.location,
      }
      this.dialogRef.close(agendaItem);
    }
  }
}

export function TimeValidator(startTimeControlName: string, endTimeControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startTimeControl = formGroup.get(startTimeControlName);
    const endTimeControl = formGroup.get(endTimeControlName);

    if (!startTimeControl || !endTimeControl) {
      return null; // Return null if controls are missing
    }

    if (startTimeControl.errors && !endTimeControl.errors['time']) {
      return null; // Skip if another validator has found an error
    }

    if (startTimeControl.value >= endTimeControl.value) {
      endTimeControl.setErrors({ time: true });
      return { time: true };
    } else {
      endTimeControl.setErrors(null);
    }

    return null;
  };
}
