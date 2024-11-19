import { Component, OnInit } from '@angular/core';
import { Event } from '../../event/model/event.model';
import { EventService } from '../../event/event.service';
import { OfferingService } from '../../offering/offering.service';
import { Offering } from '../../offering/model/offering.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  allEvents: Event[] = [];
  topEvents: Event[] = [];
  topOfferings: Offering[] = [];
  allOfferings: Offering[] = [];
  clickedEvent: string;

  constructor(private service: EventService, private offeringService: OfferingService) {}

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

    this.offeringService.getAll().subscribe({
      next: (offering: Offering[]) => {
        this.allOfferings = offering;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });

    this.topOfferings = this.allOfferings.slice(0, 5);
  }
}

