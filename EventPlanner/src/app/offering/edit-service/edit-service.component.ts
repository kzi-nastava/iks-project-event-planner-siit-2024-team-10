import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';
import { OfferingService } from '../offering.service';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.css']
})
export class EditServiceComponent implements OnInit {
  offeringForm: FormGroup;
  // ovo ce se drugacije ucitavati kasnije, trenutno je ovako jer eventovi nisu kreirani
  eventTypes = [
    'Wedding',
    'Birthday',
    'Corporate',
    'Anniversary'
  ];
  selectedEventTypes: Set<string> = new Set();
  timeOptions = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private offeringService: OfferingService
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
      serviceCategory: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      specification: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.min(0), Validators.max(100)]],
      photos: [[]],
      timeType: ['fixed'], // Dodato polje za tip vremena
      fixedTime: [''],
      minTime: [''],
      maxTime: [''],
      reservationDeadline: [''],
      cancellationDeadline: [''],
      isAvailable: [true],
      isVisible: [true]
    });
  }

  prefillForm(data: any): void {
    const timeType = data.fixedTime ? 'fixed' : 'flexible';
    this.offeringForm.patchValue({
      serviceCategory: data.serviceCategory || '',
      name: data.name || '',
      description: data.description || '',
      specification: data.specification || '',
      price: data.price || 0,
      discount: data.discount || 0,
      timeType,
      fixedTime: timeType === 'fixed' ? data.fixedTime : '',
      minTime: timeType === 'flexible' ? data.minTime : '',
      maxTime: timeType === 'flexible' ? data.maxTime : '',
      reservationDeadline: data.reservationPeriod || 0, 
      cancellationDeadline: data.cancellationPeriod || 0, 
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      isVisible: data.isVisible !== undefined ? data.isVisible : true,
    });
  
    // labels for events
    if (data.eventTypes) {
      data.eventTypes.forEach((type: string) => this.selectedEventTypes.add(type));
    }
  }  
  

  openDialog(): void {
    this.dialog.open(CreateCategoryDialogComponent, {
      width: '350px'
    });
  }

  onPhotoUpload(event: any): void {
    const files = event.target.files;
    const photosControl = this.offeringForm.get('photos');
    if (photosControl) {
      photosControl.setValue([...files]);
    }
  }

  toggleSelection(type: string): void {
    if (this.selectedEventTypes.has(type)) {
      this.selectedEventTypes.delete(type);
    } else {
      this.selectedEventTypes.add(type);
    }
  }

  isSelected(type: string): boolean {
    return this.selectedEventTypes.has(type);
  }

  onSubmit(): void {
    if (this.offeringForm.valid) {
      const formData = {
        ...this.offeringForm.value,
        eventTypes: Array.from(this.selectedEventTypes), 
      };
  
      this.offeringService.editService(formData);
  
      this.offeringForm.reset();
      this.selectedEventTypes.clear();
      alert('Form data edited successfully!');
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
