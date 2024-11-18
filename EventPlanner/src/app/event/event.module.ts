import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import {MatIcon} from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    EventsComponent,
  ],
  imports: [
    CommonModule,
    MatIcon,
    MatCardModule,
    MatButtonModule
  ],
  exports:[
    EventsComponent,
  ]
})
export class EventModule { }
