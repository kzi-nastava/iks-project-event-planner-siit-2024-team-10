import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import {LoginComponent} from './infrastructure/auth/login/login.component';
import {ManageOfferingsComponent} from './offering/manage-offerings/manage-offerings.component';
import {CreateOfferingsComponent} from './offering/create-offerings/create-offerings.component';
import { EditServiceComponent } from './offering/edit-service/edit-service.component';
import { DetailsPageComponent } from './offering/details-page/details-page.component';
import {RegisterComponent} from './layout/register/register.component';
import {EventDetailsComponent} from './event/event-details/event-details.component';
import { NotificationsPageComponent } from './notification/notifications-page/notifications-page.component';
import { OfferingCategoryComponent } from './offering/offering-category/offering-category.component';
import {CreateEventComponent} from './event/create-event/create-event.component';
import {EventTypesComponent} from './event/event-types/event-types.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'home', component: HomeComponent},
  {path:'login',component: LoginComponent},
  {path:'manage-offerings',component:ManageOfferingsComponent},
  {path:'create-offering',component:CreateOfferingsComponent},
  {path:'edit-service',component:EditServiceComponent},
  {path:'offering/:id',component:DetailsPageComponent},
  {path:'register',component: RegisterComponent},
  {path:'event/:id',component:EventDetailsComponent},
  {path:'notification-panel',component: NotificationsPageComponent},
  {path:'offering-categories',component: OfferingCategoryComponent},
  {path:'event-types',component:EventTypesComponent},
  {path:'create-event',component:CreateEventComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
