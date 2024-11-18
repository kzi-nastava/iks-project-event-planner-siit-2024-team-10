import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageOfferingsComponent } from './manage-offerings/manage-offerings.component';
import { OfferingCardComponent } from './offering-card/offering-card.component';
import {MatIcon} from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    ManageOfferingsComponent,
    OfferingCardComponent
  ],
  imports: [
    CommonModule,
    MatIcon,
    MatCardModule,
    MatButtonModule
  ],
  exports:[
    OfferingCardComponent
  ]
})
export class OfferingModule { }
