import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageOfferingsComponent } from './manage-offerings/manage-offerings.component';
import { OfferingsComponent } from './offerings/offerings.component';
import {MatIcon} from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    ManageOfferingsComponent,
    OfferingsComponent
  ],
  imports: [
    CommonModule,
    MatIcon,
    MatCardModule,
    MatButtonModule
  ],
  exports:[
    OfferingsComponent
  ]
})
export class OfferingModule { }
