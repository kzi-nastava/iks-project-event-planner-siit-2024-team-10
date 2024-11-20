import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';
import { OfferingService } from '../offering.service';

@Component({
  selector: 'app-create-offerings',
  templateUrl: './create-offerings.component.html',
  styleUrls: ['./create-offerings.component.css']
})
export class CreateOfferingsComponent implements OnInit {
  offeringForm: FormGroup;
  serviceCategories = [
    'Photography', 
    'Catering', 
    'DJ Services', 
    'Event Planning'
  ];
  eventTypes = [
    'Wedding', 
    'Birthday', 
    'Corporate', 
    'Anniversary'
  ];
  selectedEventTypes: Set<string> = new Set();
  timeOptions = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder, private dialog: MatDialog, private offeringService: OfferingService) {}

  openDialog(){
    this.dialog.open(CreateCategoryDialogComponent,{
      width:"350px"
    })
  }

  ngOnInit(): void {
    this.initForm();
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
  
      this.offeringService.createService(formData);
  
      this.offeringForm.reset();
      this.selectedEventTypes.clear();
      alert('Form data logged successfully!');
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
  
}