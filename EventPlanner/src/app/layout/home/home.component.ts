import { Component, OnInit } from '@angular/core';
import { Event } from '../../event/model/event.model';
import { EventService } from '../../event/event.service';
import { OfferingService } from '../../offering/offering-service/offering.service';
import { Offering } from '../../offering/model/offering.model';
import { FilterEventsDialogComponent } from '../../event/filter-events-dialog/filter-events-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterServiceDialogComponent } from '../../offering/filter-service-dialog/filter-service-dialog.component';
import { FilterProductDialogComponent } from '../../offering/filter-product-dialog/filter-product-dialog.component';
import { OfferingWarningDialogComponent } from '../offering-warning-dialog/offering-warning-dialog.component';


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
  filteredOfferings: Offering[] = [];
  clickedEvent: string;

  sortingDirections = ['Ascending', 'Descending'];

  eventSortingCriteria = ['None', 'Name', 'Date and Time', 'Rating', 'City'];

  offeringSortingCriteria = ['None', 'Name', 'Rating', 'City', 'Price'];

  selectedSortingDirection: string = 'Ascending';
  selectedEventSortingCriteria: string = 'None';
  selectedOfferingSortingCriteria: string = 'None';

  selectedOfferingType: 'services' | 'products' | null = null;

  searchEventQuery: string = '';
  searchOfferingQuery: string = '';

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
      next: (offerings: Offering[]) => {
        this.allOfferings = offerings;
        this.filteredOfferings = offerings;
      },
      error: (err) => {
        console.error('Error fetching offerings:', err);
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
  openFilterDialog(): void {
    if (this.selectedOfferingType === 'services') {
      this.dialog.open(FilterServiceDialogComponent, {
        width: '600px',
      });
    } else if (this.selectedOfferingType === 'products') {
      this.dialog.open(FilterProductDialogComponent, {
        width: '600px',
      });
    } else {
      this.dialog.open(OfferingWarningDialogComponent, {
        width: '400px',
      });
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

  filterOfferings() {
    this.filteredOfferings = this.allOfferings.filter(offering => 
      this.selectedOfferingType === 'services' 
        ? !offering.isProduct 
        : offering.isProduct
    );
  }

  toggleOfferingType(type: 'services' | 'products') {
    this.selectedOfferingType = type;
    this.filterOfferings();
  }
  searchEvent() {
    console.log('Search Query:', this.searchEventQuery);
  }

  searchOffering() {
    console.log('Search Query:', this.searchOfferingQuery);
  }
}

