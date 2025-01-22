import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../offering/model/category.model';
import {CategoryService} from '../../offering/category-service/category.service';
import {environment} from '../../../env/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {CreateProductDTO} from '../model/create-product-dto.model';
import {AuthService} from '../../infrastructure/auth/auth.service';
import {ProductService} from '../product.service';
import {Product} from '../../offering/model/product.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit{
  @ViewChild('fileInput') fileInput: ElementRef;
  createForm: FormGroup= new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    productCategory: new FormControl('',[Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    discount: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
    photos: new FormControl([]),
    isAvailable: new FormControl(true),
    isVisible: new FormControl(true),
    categoryName:new FormControl(''),
    categoryDescription:new FormControl(''),
    createCategory:new FormControl(false)
  });
  allCategories:Category[]=[];
  photoPaths: string[];
  snackBar: MatSnackBar = inject(MatSnackBar);

  constructor(
    private categoryService:CategoryService,
    private http: HttpClient,
    private authService: AuthService,
    private productService:ProductService,
    private router:Router){}

  ngOnInit() {
    this.categoryService.getAll().subscribe({
      next: (categories:Category[]) => {
        this.allCategories=categories.filter(x=>(!x.deleted && !x.pending));
      },
      error: (_) => {
        console.log("Error loading categories")
      }
    });

    this.createForm.get('createCategory')?.valueChanges.subscribe((createCategoryValue) => {
      const categoryNameControl = this.createForm.get('categoryName');
      const categoryDescriptionControl = this.createForm.get('categoryDescription');
      const categorySelectionControl = this.createForm.get('productCategory');
      if (createCategoryValue) {
        categoryNameControl?.setValidators([Validators.required]); // Add 'required' validator
        categoryDescriptionControl?.setValidators([Validators.required]);
        categorySelectionControl?.clearValidators();
      } else {
        categoryNameControl?.clearValidators(); // Remove 'required' validator
        categoryDescriptionControl?.clearValidators();
        categorySelectionControl?.setValidators([Validators.required]);
      }
      categoryNameControl?.updateValueAndValidity(); // Re-evaluate validation status
      categoryDescriptionControl?.updateValueAndValidity();
      categorySelectionControl.updateValueAndValidity();
    });
  }

  creatingCategory():boolean{
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

  onSubmit():void{
    if(!this.createForm.valid)
      return;
    const product:CreateProductDTO={
      categoryId:this.creatingCategory()?null:this.createForm.value.productCategory.id,
      categoryProposalName:this.creatingCategory()?this.createForm.value.categoryName:null,
      categoryProposalDescription:this.creatingCategory()?this.createForm.value.categoryDescription:null,
      providerID:this.authService.getUserId(),
      name:this.createForm.value.name,
      description:this.createForm.value.description,
      price:this.createForm.value.price,
      discount:this.createForm.value.discount,
      photos:this.photoPaths,
      visible:this.createForm.value.isVisible,
      available:this.createForm.value.isAvailable
    };
    this.productService.create(product).subscribe({
      next: (product:Product) => {
        this.snackBar.open("Product created successfully!",'OK', { duration: 3000 });
        this.router.navigate(['home']);
      },
      error: (_) => {
        this.snackBar.open("Error creating product",'OK', { duration: 3000 });
      }
    });
  }
}
