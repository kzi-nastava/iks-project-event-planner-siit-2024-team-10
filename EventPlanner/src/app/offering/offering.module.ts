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
import { EditServiceComponent } from './edit-service/edit-service.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    ManageOfferingsComponent,
    OfferingCardComponent,
    CreateOfferingsComponent,
    EditServiceComponent
  ],
  imports: [
    CommonModule,
    MatIcon,
    MatCardModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatIconModule,
    MatButtonToggleModule
  ],
  exports: [
    ManageOfferingsComponent,
    CreateOfferingsComponent,
    OfferingCardComponent,
    EditServiceComponent
  ]
})
export class OfferingModule { }