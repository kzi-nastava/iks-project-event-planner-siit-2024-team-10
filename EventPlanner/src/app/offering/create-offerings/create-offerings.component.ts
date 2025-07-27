import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http'; 
import { Category } from '../../offering/model/category.model';
import { ServiceService } from '../service-service/service.service';
import { CreateServiceDTO } from '../model/create-service-dto.model';
import { environment } from '../../../env/environment';
import { CategoryService } from '../../offering/category-service/category.service';
import {AuthService} from '../../infrastructure/auth/auth.service';

@Component({
  selector: 'app-create-offerings',
  templateUrl: './create-offerings.component.html',
  styleUrls: ['./create-offerings.component.css']
})
export class CreateOfferingsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  createForm: FormGroup;
  selectedEventTypes: Set<string> = new Set();
  timeOptions = [1, 2, 3, 4, 5];
  photoPaths: string[] = [];
  allCategories: Category[] = [];
  snackBar: MatSnackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private serviceService: ServiceService,
    private categoryService: CategoryService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.categoryService.getAll().subscribe({
      next: (categories: Category[]) => {
        this.allCategories = categories.filter(c => !c.deleted && !c.pending);
      }
    });

    this.createForm.get('createCategory')?.valueChanges.subscribe((createCategoryValue) => {
      const nameCtrl = this.createForm.get('categoryName');
      const descCtrl = this.createForm.get('categoryDescription');
      const selectionCtrl = this.createForm.get('serviceCategory');

      if (createCategoryValue) {
        nameCtrl?.setValidators([Validators.required]);
        descCtrl?.setValidators([Validators.required]);
        selectionCtrl?.clearValidators();
      } else {
        nameCtrl?.clearValidators();
        descCtrl?.clearValidators();
        selectionCtrl?.setValidators([Validators.required]);
      }

      nameCtrl?.updateValueAndValidity();
      descCtrl?.updateValueAndValidity();
      selectionCtrl?.updateValueAndValidity();
    });
  }

  initForm(): void {
    this.createForm = this.fb.group({
      createCategory: [false],
      categoryName: [''],
      categoryDescription: [''],
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
      isAvailable: [false],
      isVisible: [false]
    });
  }

  creatingCategory(): boolean {
    return this.createForm.value.createCategory;
  }

  onPhotoUpload() {
    const files = this.fileInput.nativeElement.files;
    if (files.length > 0) {
      this.uploadFiles(files);
    }
  }

  uploadFiles(files: FileList) {
    const formData = new FormData();
    const fakeId = 1;

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    formData.append('productId', fakeId.toString());

    this.http.post(environment.apiHost + "/upload", formData).subscribe({
      next: (response: any) => {
        this.snackBar.open('Files uploaded successfully', 'OK', { duration: 3000 });
        this.photoPaths = response;
        this.createForm.patchValue({ photos: response });
      },
      error: (error) => {
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
      const formValue = this.createForm.value;
      const isFixedTime = formValue.timeType === 'fixed';

      const service: CreateServiceDTO = {
        categoryId:this.creatingCategory()?null:this.createForm.value.serviceCategory.id,
        creatorId: this.creatingCategory() ? this.authService.getAccountId() : null, 
        categoryProposalName:this.creatingCategory()?this.createForm.value.categoryName:null,
        categoryProposalDescription:this.creatingCategory()?this.createForm.value.categoryDescription:null,
        pending: false,
        provider: this.authService.getUserId(),
        name: formValue.name,
        description: formValue.description,
        specification: formValue.specification || '',
        price: parseFloat(formValue.price),
        discount: parseFloat(formValue.discount) || 0,
        photos: this.photoPaths || [],
        isVisible: !!formValue.isVisible,
        isAvailable: !!formValue.isAvailable,
        maxDuration: isFixedTime ? +formValue.fixedTime || 0 : +formValue.maxTime || 0,
        minDuration: isFixedTime ? +formValue.fixedTime || 0 : +formValue.minTime || 0,
        cancellationPeriod: +formValue.cancellationDeadline || 0,
        reservationPeriod: +formValue.reservationDeadline || 0,
        autoConfirm: isFixedTime
      };

      this.serviceService.add(service).subscribe({
        next: () => {
          this.snackBar.open('Service created successfully', 'OK', { duration: 3000 });
          this.createForm.reset();
        },
        error: (error) => {
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
