import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ManageOfferingsComponent } from './manage-offerings/manage-offerings.component';
import { OfferingCardComponent } from './offering-card/offering-card.component';
import {MatIcon} from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FilterProvidersOfferingsDialogComponent } from './filter-providers-offerings-dialog/filter-providers-offerings-dialog.component';
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
import { FilterServiceDialogComponent } from './filter-service-dialog/filter-service-dialog.component';
import { FilterProductDialogComponent } from './filter-product-dialog/filter-product-dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReservationDialogComponent } from './reservation-dialog/reservation-dialog.component';
import { ProductReservationDialogComponent } from './product-reservation-dialog/product-reservation-dialog.component';
import { MatOptionModule } from '@angular/material/core';
import { ChangeCategoryDialogComponent } from '../change-category-dialog/change-category-dialog.component';
import { ReservationConfirmationComponent } from './reservation-confirmation/reservation-confirmation.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { SuspensionModule } from '../suspension/suspension.module';
import { CommentApprovalComponent } from './comment-approval/comment-approval.component';
@NgModule({
  declarations: [
    ManageOfferingsComponent,
    OfferingCardComponent,
    CreateOfferingsComponent,
    EditServiceComponent,
    FilterServiceDialogComponent,
    FilterProductDialogComponent,
    FilterProvidersOfferingsDialogComponent,
    ReservationDialogComponent,
    ProductReservationDialogComponent,
    ChangeCategoryDialogComponent,
    ReservationConfirmationComponent,
    CommentApprovalComponent
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
    MatIconModule  ,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioButton, MatRadioGroup,
    MatSliderModule,
    MatButtonToggleModule,
    DatePipe,
    MatOptionModule,
    MatTableModule,
    MatSortModule,
    SuspensionModule
  ],
  exports: [
    ManageOfferingsComponent,
    CreateOfferingsComponent,
    OfferingCardComponent,
    EditServiceComponent,
    FilterProvidersOfferingsDialogComponent
  ]
})
export class OfferingModule { }
