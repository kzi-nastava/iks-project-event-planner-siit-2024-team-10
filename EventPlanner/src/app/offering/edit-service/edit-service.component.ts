import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.css'
})
export class EditServiceComponent implements OnInit {
  offeringForm: FormGroup;
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
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Get state data and prefill the form if data exists
    const stateData = history.state.data; // Retrieve the state data passed during navigation
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
      timeType: ['fixed'],
      fixedTime: [''],
      minTime: [''],
      maxTime: [''],
      reservationDeadline: [''],
      cancellationDeadline: [''],
      isAvailable: [true],
      isVisible: [true]
    });
  }

  // Method to prefill the form
  prefillForm(data: any): void {
    this.offeringForm.patchValue({
      serviceCategory: data.serviceCategory || '',
      name: data.name || '',
      description: data.description || '',
      specification: data.specification || '',
      price: data.price || 0,
      discount: data.discount || 0,
      timeType: data.timeType || 'fixed',
      fixedTime: data.fixedTime || '',
      minTime: data.minTime || '',
      maxTime: data.maxTime || '',
      reservationDeadline: data.reservationDeadline || '',
      cancellationDeadline: data.cancellationDeadline || '',
      isAvailable: data.isAvailable || false,
      isVisible: data.isVisible || false
    });
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
      console.log(this.offeringForm.value);
      // Add submission logic
    }
  }
}
