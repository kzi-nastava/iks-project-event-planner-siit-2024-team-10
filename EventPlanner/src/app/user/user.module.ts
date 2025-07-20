import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details/user-details.component';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { EditPersonalComponent } from './edit-personal/edit-personal.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {RouterModule} from '@angular/router';
import {MatInput} from '@angular/material/input';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import { FavouritesComponent } from './favourites/favourites.component';
import {EventModule} from '../event/event.module';
import {OfferingModule} from '../offering/offering.module';
import { CalendarComponent } from './calendar/calendar.component';
import {FullCalendarModule} from '@fullcalendar/angular';
import { UpdateProfilePhotoComponent } from './update-profile-photo/update-profile-photo.component';



@NgModule({
  declarations: [
    UserDetailsComponent,
    EditPersonalComponent,
    EditCompanyComponent,
    ChangePasswordComponent,
    FavouritesComponent,
    CalendarComponent,
    UpdateProfilePhotoComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterModule,
    MatInput,
    MatRadioButton,
    MatRadioGroup,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatOption,
    MatSelect,
    EventModule,
    OfferingModule,
    FullCalendarModule
  ]
})
export class UserModule { }
