import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../offering/model/category.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoryService} from '../../offering/category-service/category.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../infrastructure/auth/auth.service';
import {ProductService} from '../product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FileService} from '../../infrastructure/file/file.service';
import {Event} from '../../event/model/event.model';
import {Product} from '../../offering/model/product.model';
import {UpdatedProductDTO} from '../model/updated-product-dto.model';
import {UpdateProductDTO} from '../model/update-product-dto.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit{
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
  productId:number;
  snackBar: MatSnackBar = inject(MatSnackBar);

  constructor(
    private authService: AuthService,
    private productService:ProductService,
    private router:Router,
    private route:ActivatedRoute,
    private fileService: FileService,){}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = +params['id'];
      this.productService.get(this.productId).subscribe({
        next: (product:Product) => {
          this.editForm.patchValue({
            name:product.name,
            description:product.description,
            price:product.price,
            discount:product.discount,
            isVisible:product.visible,
            isAvailable:product.available
          });
          this.photoPaths = product.photos;
        },
        error: (err) => {
          this.snackBar.open('Error fetching product','OK',{duration:5000});
        }
      });
    })
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

    this.fileService.uploadPhotos(formData).subscribe({
      next: (response: string[]) => {
        this.snackBar.open('Files uploaded successfully', 'OK', { duration: 3000 });
        this.photoPaths = response;
      },
      error: (error) => {
        this.snackBar.open('Failed to upload files', 'Dismiss', { duration: 3000 });
      }
    });
  }

  onSubmit(){
    if(!this.editForm.valid)
      return;
    const product:UpdateProductDTO={
      name:this.editForm.value.name,
      description:this.editForm.value.description,
      price:this.editForm.value.price,
      discount:this.editForm.value.discount,
      isVisible:this.editForm.value.isVisible,
      isAvailable:this.editForm.value.isAvailable,
      photos:this.photoPaths
    }
    this.productService.update(this.productId,product).subscribe({
      next: (response: UpdatedProductDTO) => {
        this.snackBar.open('Product edited successfully', 'OK', { duration: 3000 });
        this.router.navigate(['/offering',this.productId]);
      },
      error: (error) => {
        this.snackBar.open('Failed to update product', 'Dismiss', { duration: 3000 });
      }
    });
  }
}
