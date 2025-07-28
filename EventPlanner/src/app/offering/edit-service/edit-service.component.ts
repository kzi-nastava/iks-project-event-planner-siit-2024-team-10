import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OfferingService } from '../offering-service/offering.service';
import { ServiceService } from '../service-service/service.service';
import { EditServiceDTO } from '../model/edit-service-dto.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageService } from '../image-service/image.service';
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
    private serviceService: ServiceService,
    private imageService:ImageService
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
      isVisible: [true],
    });
  }

  prefillForm(data: any): void {
    const timeType = data.fixedTime ? 'fixed' : 'flexible';
  
    let photosFilenames: string[] = [];
    
    if (data.photos && data.photos.length > 0) {
      console.log('Before processing photos:', data.photos);
      
      photosFilenames = data.photos.map((photo: string) => {
        if (!photo.includes('/')) {
          return photo;
        }
        return photo.split('/').pop() || photo;
      });
      
      console.log('Processed filenames:', photosFilenames);
    }
  
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
      photos: photosFilenames 
    });
    
    console.log('Final photos in form:', this.offeringForm.get('photos')?.value);
  }

  onPhotoUpload(event: any): void {
    const files: FileList = event.target.files;
    if (files.length === 0) return;
  
    const currentPhotos = this.offeringForm.get('photos')?.value || [];
    if (currentPhotos.length + files.length > 5) {
      this.snackBar.open('Maximum 5 photos allowed', 'OK', { duration: 3000 });
      return;
    }
  
    this.imageService.uploadFiles(files).subscribe({
      next: (uploadedFileNames: string[]) => {
        const updatedPhotos = [...currentPhotos, ...uploadedFileNames];
        this.offeringForm.patchValue({ photos: updatedPhotos });
        this.snackBar.open('Photos uploaded successfully', 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to upload photos', 'Dismiss', { duration: 3000 });
      }
    });
  
    event.target.value = '';
  }
  
  getPhotoUrl(photo: string | File): string {
    if (photo instanceof File) {
      return URL.createObjectURL(photo);
    }
    return this.imageService.getImageUrl(photo);
  }
  removePhoto(index: number): void {
    const photosControl = this.offeringForm.get('photos');
    if (!photosControl) return;
  
    const currentPhotos = photosControl.value as (string | File)[];
    currentPhotos.splice(index, 1);
    photosControl.setValue([...currentPhotos]);
  }
  
  onSubmit(): void {
    console.log('Form submitted with value:', this.offeringForm.value);
    if (this.offeringForm.valid) {
      const formData : EditServiceDTO = {
        ...this.offeringForm.value,
      };

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
