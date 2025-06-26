import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OfferingService } from '../offering-service/offering.service';
import { ServiceService } from '../service-service/service.service';
import { EditServiceDTO } from '../model/edit-service-dto.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.css']
})
export class EditServiceComponent implements OnInit {
  offeringForm: FormGroup;
  timeOptions = [1, 2, 3, 4, 5];
  snackBar: MatSnackBar = inject(MatSnackBar);
  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.initForm();
    const stateData = history.state.data;
    if (stateData) {
      this.prefillForm(stateData);
    }
  }

  initForm(): void {
    this.offeringForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      specification: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.min(0), Validators.max(100)]],
      photos: [[]],
      timeType: ['fixed'], 
      fixedTime: [''],
      minDuration: [''],
      maxDuration: [''],
      reservationPeriod: [''],
      cancellationPeriod: [''],
      isAvailable: [true],
      isVisible: [true]
    });
  }

  prefillForm(data: any): void {
    const timeType = data.fixedTime ? 'fixed' : 'flexible';
    this.offeringForm.patchValue({
      id: data.id || null,
      name: data.name || '',
      description: data.description || '',
      specification: data.specification || '',
      price: data.price || 0,
      discount: data.discount || 0,
      timeType,
      fixedTime: timeType === 'fixed' ? data.fixedTime : '',
      minDuration: timeType === 'flexible' ? data.minTime : '',
      maxDuration: timeType === 'flexible' ? data.maxTime : '',
      reservationPeriod: data.reservationPeriod || 0, 
      cancellationPeriod: data.cancellationPeriod || 0, 
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      isVisible: data.isVisible !== undefined ? data.isVisible : true,
    });
  }  

  onPhotoUpload(event: any): void {
    const files = event.target.files;
    const photosControl = this.offeringForm.get('photos');
    if (photosControl) {
      photosControl.setValue([...files]);
    }
  }

  onSubmit(): void {
    if (this.offeringForm.valid) {
      const formData : EditServiceDTO = {
        ...this.offeringForm.value,
      };

      console.log(formData);
      this.serviceService.edit(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Service edited successfully', 'OK', { 
            duration: 3000 
          });
          },
        error: (error) => {  
          this.snackBar.open('Failed to edit service. Please try again.', 'Dismiss', {
            duration: 3000
          });
        }
      });
    }
  }
}
