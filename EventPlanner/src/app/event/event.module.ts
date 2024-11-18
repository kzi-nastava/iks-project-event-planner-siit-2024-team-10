import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIcon} from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { EventCardComponent } from './event-card/event-card.component';

@NgModule({
  declarations: [
    EventCardComponent,
  ],
  imports: [
    CommonModule,
    MatIcon,
    MatCardModule,
    MatButtonModule
  ],
  exports:[
    EventCardComponent,
  ]
})
export class EventModule { }
