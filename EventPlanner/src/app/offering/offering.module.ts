import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageOfferingsComponent } from './manage-offerings/manage-offerings.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button'; // Add this if you use any Angular Material buttons

@NgModule({
  declarations: [
    ManageOfferingsComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule // Include this if needed
  ]
})
export class OfferingModule { }