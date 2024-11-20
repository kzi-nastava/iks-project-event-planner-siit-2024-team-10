import { Component, OnInit } from '@angular/core';
import { Event } from '../../event/model/event.model';
import { EventService } from '../../event/event.service';
import { OfferingService } from '../../offering/offering.service';
import { Offering } from '../../offering/model/offering.model';
import { FilterEventsDialogComponent } from '../../event/filter-events-dialog/filter-events-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  sortingDirections = ['Ascending', 'Descending'];

  eventSortingCriteria = ['None', 'Name', 'Date and Time', 'Rating', 'City'];

  offeringSortingCriteria = ['None', 'Name', 'Rating', 'City', 'Price'];

  selectedSortingDirection: string = 'Ascending';
  selectedEventSortingCriteria: string = 'None';
  selectedOfferingSortingCriteria: string = 'None';

  constructor(private service: EventService, private offeringService: OfferingService, private dialog: MatDialog) {}

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
  applySorting(type: 'event' | 'offering') {
    if (type === 'event') {
      console.log(`Sorting Events by ${this.selectedEventSortingCriteria} in ${this.selectedSortingDirection} order.`);

    } else {
      console.log(`Sorting Offerings by ${this.selectedOfferingSortingCriteria} in ${this.selectedSortingDirection} order.`);
    }
  }
  openEventFilterDialog() {
    const dialogRef = this.dialog.open(FilterEventsDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((filters) => {
      if (filters) {
        console.log('Applied Filters:', filters);
      }
    });
  }
}

