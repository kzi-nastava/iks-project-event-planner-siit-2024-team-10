import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http'; 
import { ViewChild, ElementRef } from '@angular/core';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';
import { ServiceService } from '../service-service/service.service';
import { CreateServiceDTO } from '../model/create-service-dto.model';
import { environment } from '../../../env/environment';

@Component({
  selector: 'app-create-offerings',
  templateUrl: './create-offerings.component.html',
  styleUrls: ['./create-offerings.component.css']
})
export class CreateOfferingsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  createForm: FormGroup;
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
    private http: HttpClient 
  ) {}

  openDialog(){
    this.dialog.open(CreateCategoryDialogComponent,{
      width:"350px"
    })
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.createForm = this.fb.group({
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
  

  onPhotoUpload() {
    const files = this.fileInput.nativeElement.files;
    if (files.length > 0) {
      this.uploadFiles(files);
    }
  }

  uploadFiles(files: FileList) {
    const formData = new FormData();
    const productId = 1;  // real id later
  
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
  
    formData.append('productId', productId.toString());
  
    this.http.post(environment.apiHost + "/upload", formData).subscribe({
      next: (response: any) => {
        console.log('Files uploaded successfully:', response);
        this.snackBar.open('Files uploaded successfully', 'OK', { duration: 3000 });
        this.photoPaths = response; 
        this.createForm.patchValue({ photos: response });
      },
      error: (error) => {
        console.error('Error uploading files:', error);
        this.snackBar.open('Failed to upload files', 'Dismiss', { duration: 3000 });
      }
    });
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
    if (this.createForm.valid) {
  
      const service: CreateServiceDTO = {
        category: 1, 
        categoryProposal: "",
        pending: false, 
        provider: 1,
  
        name: this.createForm.value.name,
        description: this.createForm.value.description,
        specification: this.createForm.value.specification || '',
  
        price: parseFloat(this.createForm.value.price),
        discount: parseFloat(this.createForm.value.discount) || 0,
  
        photos: this.createForm.value.photos || [],
  
        isVisible: this.createForm.value.isVisible ?? true,
        isAvailable: this.createForm.value.isAvailable ?? true,
  
        // Duration handling
        maxDuration: parseInt(this.createForm.value.maxTime, 10) || 0,
        minDuration: parseInt(this.createForm.value.minTime, 10) || 0,
  
        cancellationPeriod: parseInt(this.createForm.value.cancellationDeadline, 10) || 0,
        reservationPeriod: parseInt(this.createForm.value.reservationDeadline, 10) || 0,
  
        autoConfirm: false 
      };
    
      this.serviceService.add(service).subscribe({
        next: (response) => {
          this.snackBar.open('Service created successfully', 'OK', { 
            duration: 3000 
          });
  
          this.createForm.reset();
          // this.router.navigate(['/services']);
        },
        error: (error) => {
          console.error('Error creating service:', error);
  
          this.snackBar.open('Failed to create service. Please try again.', 'Dismiss', {
            duration: 3000
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.createForm);
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
}