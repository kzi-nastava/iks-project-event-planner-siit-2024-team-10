import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';
import { OfferingService } from '../offering-service/offering.service';

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

/*
import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';
import { ServiceService } from '../service-service/service.service';
import { EditServiceDTO } from '../model/edit-service-dto.model';
import { environment } from '../../../env/environment';
import { Service } from '../model/service.model';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.css']
})
export class EditServiceComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  editForm: FormGroup;
  serviceId: number;
  
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
  photoPaths: string[];
  
  snackBar: MatSnackBar = inject(MatSnackBar);
  
  constructor(
    private fb: FormBuilder, 
    private dialog: MatDialog, 
    private serviceService: ServiceService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Get service ID from route parameters
    this.route.params.subscribe(params => {
      this.serviceId = +params['id'];
      if (this.serviceId) {
        this.loadServiceDetails();
      }
    });
  }

  initForm(): void {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      specification: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.min(0), Validators.max(100)]],
      photos: [[]],
      isAvailable: [true],
      isVisible: [true],
      minTime: [''],
      maxTime: [''],
      reservationDeadline: [''],
      cancellationDeadline: [''],
      provider: [''],
      pending: [false],
      autoConfirm: [false]
    });
  }

  loadServiceDetails(): void {
    this.serviceService.getById(this.serviceId).subscribe({
      next: (service) => {
        this.prefillForm(service);
      },
      error: (error) => {
        this.snackBar.open('Failed to load service details', 'Dismiss', { duration: 3000 });
        console.error('Error loading service:', error);
      }
    });
  }

  prefillForm(service: Service): void {
    this.editForm.patchValue({
      name: service.name,
      description: service.description,
      specification: service.specification,
      price: service.price,
      discount: service.discount,
      photos: service.picture,
      isAvailable: service.isAvailable,
      isVisible: service.isVisible,
      minTime: service.minDuration,
      maxTime: service.maxDuration,
      reservationDeadline: service.reservationPeriod,
      cancellationDeadline: service.cancellationPeriod,
      provider: service.provider,
      autoConfirm: service.autoConfirm
    });
  }

  onPhotoUpload() {
    const files = this.fileInput.nativeElement.files;
    if (files.length > 0) {
      this.uploadFiles(files);
    }
  }

  uploadFiles(files: FileList) {
    const formData = new FormData();
  
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
  
    formData.append('serviceId', this.serviceId.toString());
  
    this.http.post(environment.apiHost + "/upload", formData).subscribe({
      next: (response: any) => {
        this.snackBar.open('Files uploaded successfully', 'OK', { duration: 3000 });
        this.photoPaths = response;
        this.editForm.patchValue({ photos: response });
      },
      error: (error) => {
        this.snackBar.open('Failed to upload files', 'Dismiss', { duration: 3000 });
        console.error('Error uploading files:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const service: EditServiceDTO = {
        id: this.serviceId,
        name: this.editForm.value.name,
        description: this.editForm.value.description,
        specification: this.editForm.value.specification || '',
        price: parseFloat(this.editForm.value.price),
        discount: parseFloat(this.editForm.value.discount) || 0,
        photos: this.editForm.value.photos || [],
        isVisible: this.editForm.value.isVisible ?? true,
        isAvailable: this.editForm.value.isAvailable ?? true,
        maxDuration: parseInt(this.editForm.value.maxTime, 10) || 0,
        minDuration: parseInt(this.editForm.value.minTime, 10) || 0,
        cancellationPeriod: parseInt(this.editForm.value.cancellationDeadline, 10) || 0,
        reservationPeriod: parseInt(this.editForm.value.reservationDeadline, 10) || 0,
        provider: this.editForm.value.provider || 1, // Default provider ID
        pending: this.editForm.value.pending || false,
        autoConfirm: this.editForm.value.autoConfirm || false
      };
    
      // Call service to update the existing service
      this.serviceService.edit(this.serviceId, service).subscribe({
        next: (response) => {
          this.snackBar.open('Service updated successfully', 'OK', { 
            duration: 3000 
          });
        },
        error: (error) => {
          console.error('Error updating service:', error);
          this.snackBar.open('Failed to update service. Please try again.', 'Dismiss', {
            duration: 3000
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.editForm);
      this.snackBar.open('Please fill in all required fields correctly', 'Dismiss', {
        duration: 3000
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
  
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  openDialog(): void {
    this.dialog.open(CreateCategoryDialogComponent, {
      width: '350px'
    });
  }
}
  */