import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../offering/model/category.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoryService} from '../../offering/category-service/category.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../infrastructure/auth/auth.service';
import {ProductService} from '../product.service';
import {Router} from '@angular/router';
import {FileService} from '../../infrastructure/file/file.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {
  @ViewChild('fileInput') fileInput: ElementRef;
  editForm: FormGroup= new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    discount: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
    isAvailable: new FormControl(true),
    isVisible: new FormControl(true)
  });
  photoPaths: string[];
  snackBar: MatSnackBar = inject(MatSnackBar);

  constructor(
    private authService: AuthService,
    private productService:ProductService,
    private router:Router,
    private fileService: FileService,){}

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

    this.fileService.uploadPhotos(formData).subscribe({
      next: (response: string[]) => {
        this.snackBar.open('Files uploaded successfully', 'OK', { duration: 3000 });
        this.photoPaths = response;
      },
      error: (error) => {
        console.error('Error uploading files:', error);
        this.snackBar.open('Failed to upload files', 'Dismiss', { duration: 3000 });
      }
    });
  }

  onSubmit(){}
}
