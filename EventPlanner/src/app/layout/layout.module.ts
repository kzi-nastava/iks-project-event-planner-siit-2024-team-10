import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {MatIcon} from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from '../infrastructure/auth/login/login.component';
import {MatButtonModule} from '@angular/material/button';
import { EventModule } from '../event/event.module';
import { OfferingModule } from '../offering/offering.module';
import {MatInputModule} from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { OfferingWarningDialogComponent } from './offering-warning-dialog/offering-warning-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    OfferingWarningDialogComponent,
  ],
    imports: [
        MatMenuModule,
        CommonModule,
        MaterialModule,
        RouterModule,
        MatIcon,
        MatRadioButton,
        MatRadioGroup,
        FormsModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        EventModule,
        OfferingModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule
  ],
  exports: [NavBarComponent]
})
export class LayoutModule { }
