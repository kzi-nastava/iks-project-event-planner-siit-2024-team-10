import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageOfferingsComponent } from './manage-offerings/manage-offerings.component';
import { OfferingCardComponent } from './offering-card/offering-card.component';
import {MatIcon} from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; 
import { CreateOfferingsComponent } from './create-offerings/create-offerings.component';
@NgModule({
  declarations: [
    ManageOfferingsComponent,
    OfferingCardComponent,
    CreateOfferingsComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class OfferingModule { }