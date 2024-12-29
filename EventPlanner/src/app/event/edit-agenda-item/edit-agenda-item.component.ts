import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CreateAgendaItemDTO} from '../model/create-agenda-item-dto.model';
import {EventType} from '../model/event-type.model';
import {AgendaItem} from '../model/agenda-item.model';
import {UpdateAgendaItemDTO} from '../model/update-agenda-item-dto.model';
import {data} from 'autoprefixer';

@Component({
  selector: 'app-edit-agenda-item',
  templateUrl: './edit-agenda-item.component.html',
  styleUrl: './edit-agenda-item.component.css'
})
export class EditAgendaItemComponent implements OnInit{
  editForm: FormGroup= new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
  },
    { validators: TimeValidator('startTime','endTime') });

  constructor(
    public dialogRef: MatDialogRef<EditAgendaItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AgendaItem
  ){}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if(this.editForm.valid){
      const agendaItem:UpdateAgendaItemDTO={
        name:this.editForm.value.name,
        description:this.editForm.value.description,
        startTime:this.editForm.value.startTime,
        endTime:this.editForm.value.endTime,
        location:this.editForm.value.location,
      }
      this.dialogRef.close(agendaItem);
    }
  }

  ngOnInit() {
    this.editForm.patchValue({
      name: this.data.name,
      description:this.data.description,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      location: this.data.location,
    })
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

