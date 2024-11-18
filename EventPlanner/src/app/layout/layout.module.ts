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
import { EventComponent } from './event/event.component';
import {MatInputModule} from '@angular/material/input';
import { RegisterPersonalComponent } from './register-personal/register-personal.component';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import { RegisterCompanyComponent } from './register-company/register-company.component';


@NgModule({
  declarations: [
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    EventComponent,
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
        MatInputModule
  ],
  exports: [NavBarComponent]
})
export class LayoutModule { }
