import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WinesComponent } from './wines/wines.component';
import { AddWineComponent } from './add-wine/add-wine.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    WinesComponent,
    AddWineComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class WineModule { }
