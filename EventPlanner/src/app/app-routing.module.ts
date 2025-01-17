import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import {LoginComponent} from './infrastructure/auth/login/login.component';
import {ManageOfferingsComponent} from './offering/manage-offerings/manage-offerings.component';
import {CreateOfferingsComponent} from './offering/create-offerings/create-offerings.component';
import { EditServiceComponent } from './offering/edit-service/edit-service.component';
import { DetailsPageComponent } from './offering/details-page/details-page.component';
import {RegisterComponent} from './infrastructure/auth/register/register.component';
import {EventDetailsComponent} from './event/event-details/event-details.component';
import { NotificationsPageComponent } from './notification/notifications-page/notifications-page.component';
import { OfferingCategoryComponent } from './offering/offering-category/offering-category.component';
import {CreateEventComponent} from './event/create-event/create-event.component';
import {EventTypesComponent} from './event/event-types/event-types.component';
import { PricelistComponent } from './offering/pricelist/pricelist.component';
import {AuthGuard} from './infrastructure/auth/auth.guard';
import {ActivateComponent} from './infrastructure/auth/activate/activate.component';
import {OpenEventReportComponent} from './event/open-event-report/open-event-report.component';
import {UserDetailsComponent} from './user/user-details/user-details.component';
import {EditPersonalComponent} from './user/edit-personal/edit-personal.component';
import {EditCompanyComponent} from './user/edit-company/edit-company.component';
const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path:'login',component: LoginComponent},
  {path:'manage-offerings',component:ManageOfferingsComponent, canActivate: [AuthGuard],
    data: {role: ['PROVIDER']}},
  {path:'create-offering',component:CreateOfferingsComponent, canActivate: [AuthGuard],
    data: {role: ['PROVIDER']}},
  {path:'edit-service',component:EditServiceComponent, canActivate: [AuthGuard],
    data: {role: ['PROVIDER']}},
  {path:'offering/:id',component:DetailsPageComponent},
  {path:'register',component: RegisterComponent},
  {path:'event/:id',component:EventDetailsComponent},
  {path:'notification-panel',component: NotificationsPageComponent},
  {path:'offering-categories',component: OfferingCategoryComponent},
  {path:'pricelist',component:PricelistComponent},
  {path:'offering-categories',component: OfferingCategoryComponent, canActivate: [AuthGuard],
    data: {role: ['ADMIN']}},
  {path:'open-event-report/:eventId',component:OpenEventReportComponent, canActivate: [AuthGuard],
  data: {role: ['ADMIN',"EVENT_ORGANIZER"]}},
  {path:'event-types',component:EventTypesComponent, canActivate: [AuthGuard],
    data: {role: ['ADMIN']}},
  {path:'create-event',component:CreateEventComponent, canActivate: [AuthGuard],
    data: {role: ['EVENT_ORGANIZER']}},
  {path:'activate', component: ActivateComponent},
  {path:'user-details',component:UserDetailsComponent},
  {path:'edit-personal',component:EditPersonalComponent},
  {path:'edit-company',component:EditCompanyComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
