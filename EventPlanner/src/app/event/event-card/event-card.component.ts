import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Event} from '../model/event.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input()
  event: Event;

  @Output()
  clicked: EventEmitter<Event> = new EventEmitter<Event>();

  onEventClicked(): void{
    console.log(this.event)
  }
}
