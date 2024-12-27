import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { EventCardComponent } from './event-card/event-card.component';
import { FilterEventsDialogComponent } from './filter-events-dialog/filter-events-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import { CreateEventComponent } from './create-event/create-event.component';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatCheckbox} from '@angular/material/checkbox';
import { CreateAgendaItemComponent } from './create-agenda-item/create-agenda-item.component';



@NgModule({
  declarations: [
    EventCardComponent,
    FilterEventsDialogComponent,
    EventDetailsComponent,
    CreateEventComponent,
    EventTypesComponent,
    CreateEventTypeComponent,
    EditEventTypeComponent,
    CreateAgendaItemComponent,
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
    MatFormFieldModule,
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
    MatSort,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    MatCheckbox
  ],
  exports: [
    EventCardComponent,
    MatInputModule
  ],
  providers: [DatePipe],
})
export class EventModule { }
