import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { EventCardComponent } from './event-card/event-card.component';
import { FilterEventsDialogComponent } from './filter-events-dialog/filter-events-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { EventDetailsComponent } from './event-details/event-details.component';
import {RouterLink} from '@angular/router';
import { CreateEventComponent } from './create-event/create-event.component';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';



@NgModule({
  declarations: [
    EventCardComponent,
    FilterEventsDialogComponent,
    EventDetailsComponent,
    CreateEventComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    RouterLink,
    MatRadioButton,
    MatRadioGroup,
    MatFormFieldModule
  ],
  exports: [
    EventCardComponent,
    MatInputModule
  ]
})
export class EventModule { }
