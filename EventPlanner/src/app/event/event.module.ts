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
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { EventDetailsComponent } from './event-details/event-details.component';
import {RouterLink} from '@angular/router';
import { EventTypesComponent } from './event-types/event-types.component';
import { HttpClientModule } from '@angular/common/http';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { CreateEventTypeComponent } from './create-event-type/create-event-type.component';
import { EditEventTypeComponent } from './edit-event-type/edit-event-type.component';
import {MatSort} from '@angular/material/sort';



@NgModule({
  declarations: [
    EventCardComponent,
    FilterEventsDialogComponent,
    EventDetailsComponent,
    EventTypesComponent,
    CreateEventTypeComponent,
    EditEventTypeComponent,
  ],
  exports: [
    EventCardComponent,
    MatInputModule
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
    HttpClientModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableModule,
    ReactiveFormsModule,
    MatSort
  ]
})
export class EventModule { }
