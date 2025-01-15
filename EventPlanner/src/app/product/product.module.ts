import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input'; // For input fields
import { MatOptionModule } from '@angular/material/core'; // For mat-option

import { CreateProductComponent } from './create-product/create-product.component';
import {MatCheckbox} from '@angular/material/checkbox';

@NgModule({
  declarations: [CreateProductComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatInputModule,
    MatOptionModule,
    MatCheckbox
  ]
})
export class ProductModule {}
