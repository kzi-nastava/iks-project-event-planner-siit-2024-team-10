import { Component, OnInit } from '@angular/core';
import { Event } from '../../event/model/event.model';
import { EventService } from '../../event/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  allEvents: Event[] = [];
  topEvents: Event[] = [];
  clickedEvent: string;

  constructor(private service: EventService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (event: Event[]) => {
        this.allEvents = event;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });

    this.service.getTop().subscribe({
      next: (events: Event[]) => {
        this.topEvents = events;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }
}

