import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import {LoginComponent} from './layout/login/login.component';
import {ManageOfferingsComponent} from './offering/manage-offerings/manage-offerings.component';
import {RegisterPersonalComponent} from './layout/register-personal/register-personal.component';
import {RegisterCompanyComponent} from './layout/register-company/register-company.component';
import {CreateOfferingsComponent} from './offering/create-offerings/create-offerings.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path:'login',component: LoginComponent},
  {path:'manage-offerings',component:ManageOfferingsComponent},
  {path:'register-personal',component:RegisterPersonalComponent},
  {path:'register-company',component:RegisterCompanyComponent},
  {path:'create-offering',component:CreateOfferingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
