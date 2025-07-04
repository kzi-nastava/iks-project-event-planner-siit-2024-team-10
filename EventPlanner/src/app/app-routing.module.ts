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
import { ChatComponent } from './chat/component/chat.component';
import {CreateProductComponent} from './product/create-product/create-product.component';
import { ProviderProfileComponent } from './provider-profile/provider-profile.component';
import {OpenEventReportComponent} from './event/open-event-report/open-event-report.component';
import {UserDetailsComponent} from './user/user-details/user-details.component';
import {EditPersonalComponent} from './user/edit-personal/edit-personal.component';
import {EditCompanyComponent} from './user/edit-company/edit-company.component';
import {EditEventComponent} from './event/edit-event/edit-event.component';
import { BudgetManagerComponent } from './event/budget-manager/budget-manager.component';
import { GuestListComponent } from './event/guest-list/guest-list.component';
import { AcceptInviteComponent } from './event/accept-invite/accept-invite.component';
import {FavouritesComponent} from './user/favourites/favourites.component';
import {CalendarComponent} from './user/calendar/calendar.component';
import { ReservationConfirmationComponent } from './offering/reservation-confirmation/reservation-confirmation.component';

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
  {path: 'provider/:id',
    component: ProviderProfileComponent},
  {path:'register',component: RegisterComponent},
  {path:'event/:id',component:EventDetailsComponent},
  {path:'notification-panel',component: NotificationsPageComponent, canActivate: [AuthGuard],
    data: {role: ['EVENT_ORGANIZER','PROVIDER','ADMIN','AUTHENTICATED_USER']}},
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
  { path: 'guest-list/:eventId', component: GuestListComponent, canActivate: [AuthGuard],
    data: {role: ['EVENT_ORGANIZER']}},
  {path:'edit-event/:id',component:EditEventComponent, canActivate: [AuthGuard],
    data: {role: ['EVENT_ORGANIZER']}},
  {path:'budget',component:BudgetManagerComponent, canActivate: [AuthGuard],
      data: {role: ['EVENT_ORGANIZER']}},
  {path:'create-product',component:CreateProductComponent, canActivate: [AuthGuard],
    data: {role: ['PROVIDER']}},
  {path:'activate', component: ActivateComponent},
  {path:'accept-invite', component: AcceptInviteComponent},
  {path:'user-details',component:UserDetailsComponent, canActivate: [AuthGuard],
    data: {role: ['EVENT_ORGANIZER','PROVIDER','ADMIN','AUTHENTICATED_USER']}},
  {path:'edit-personal',component:EditPersonalComponent, canActivate: [AuthGuard],
    data: {role: ['PROVIDER','EVENT_ORGANIZER']}},
  {path:'edit-company',component:EditCompanyComponent, canActivate: [AuthGuard],
    data: {role: ['PROVIDER']}},
  { path: 'chat', component: ChatComponent },
  {path:'calendar',component:CalendarComponent},
  { path: 'favourites', component: FavouritesComponent , canActivate: [AuthGuard],
    data: {role: ['EVENT_ORGANIZER','PROVIDER','ADMIN','AUTHENTICATED_USER']}},
  { path: 'reservation-confirmation', component: ReservationConfirmationComponent, canActivate: [AuthGuard],
    data: {role: ['PROVIDER']}},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
