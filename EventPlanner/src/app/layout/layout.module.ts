import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {MatIcon} from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './login/login.component';
import {MatButtonModule} from '@angular/material/button';
import { EventModule } from '../event/event.module';
import { OfferingModule } from '../offering/offering.module';
import {MatInputModule} from '@angular/material/input';
import { RegisterPersonalComponent } from './register-personal/register-personal.component';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import { RegisterCompanyComponent } from './register-company/register-company.component';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    RegisterPersonalComponent,
    RegisterCompanyComponent,
  ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        MatIcon,
        MatRadioButton,
        MatRadioGroup,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        EventModule,
        OfferingModule,
        MatSelectModule
  ],
  exports: [NavBarComponent]
})
export class LayoutModule { }
