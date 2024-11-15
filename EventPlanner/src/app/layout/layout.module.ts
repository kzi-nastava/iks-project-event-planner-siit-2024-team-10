import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {MatIcon} from "@angular/material/icon";
import { LoginComponent } from './login/login.component';
import { RegisterPersonalComponent } from './register-personal/register-personal.component';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    RegisterPersonalComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    MatIcon,
    MatRadioButton,
    MatRadioGroup,
    FormsModule
  ],
  exports: [NavBarComponent]
})
export class LayoutModule { }
