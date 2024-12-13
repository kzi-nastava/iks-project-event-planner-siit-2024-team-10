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
  noTopEventsMessage: string = '';
  noEventsMessage: string = '';

  sortingDirections = ['Ascending', 'Descending'];

  eventSortingCriteria = ['None', 'Name', 'Date and Time', 'Rating', 'City'];

  offeringSortingCriteria = ['None', 'Name', 'Rating', 'City', 'Price'];

  selectedSortingDirection: string = 'Ascending';
  selectedEventSortingCriteria: string = 'None';
  selectedOfferingSortingCriteria: string = 'None';

  selectedOfferingType: 'services' | 'products' | null = null;

  searchEventQuery: string = '';
  searchOfferingQuery: string = '';

  eventPageProperties = {
    page: 0,
    pageSize: 5,
    totalPages: 0,
    totalElements: 0,
  };

  offeringPageProperties = {
    page: 0,
    pageSize: 2,
    totalPages: 0,
    totalElements: 0,
  };

  constructor(private service: EventService, private offeringService: OfferingService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchPaginatedEvents();

    this.fetchPaginatedOfferings();

    this.service.getTop().subscribe({
      next: (events: Event[]) => {
        this.topEvents = events;
        if (this.topEvents === null || this.topEvents.length === 0) {
          this.noTopEventsMessage = 'No events found.';
        } else {
          this.noTopEventsMessage = '';
        }
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.noTopEventsMessage = 'An error occurred while fetching events.';
      }
    });
    this.offeringService.getTop().subscribe({
      next: (offerings: Offering[]) => {
        this.topOfferings = offerings;
      },
      error: (err) => {
        console.error('Error fetching offerings:', err);
      }
    });
    
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

  fetchPaginatedEvents(): void {
    const { page, pageSize } = this.eventPageProperties;
  
    this.service.getPaginatedEvents(page, pageSize).subscribe({
      next: (response) => {
        this.allEvents = response.content;
        this.eventPageProperties.totalPages = response.totalPages;
        this.eventPageProperties.totalElements = response.totalElements;
        if (this.allEvents === null || this.allEvents.length === 0) {
          this.noEventsMessage = 'No events found.';
        } else {
          this.noEventsMessage = '';
        }
      },
      error: (err) => {
        console.error('Error fetching paginated events:', err);
        this.noEventsMessage = 'An error occurred while fetching events.';
      }
    });
  }

  fetchPaginatedOfferings(): void {
    const { page, pageSize } = this.offeringPageProperties;
  
    this.offeringService.getPaginatedOfferings(page, pageSize).subscribe({
      next: (response) => {
        this.allOfferings = response.content;
        this.filteredOfferings = response.content;
        this.offeringPageProperties.totalPages = response.totalPages;
        this.offeringPageProperties.totalElements = response.totalElements;
        if (this.allOfferings === null || this.allOfferings.length === 0) {
          this.noEventsMessage = 'No offerings found.';
        } else {
          this.noEventsMessage = '';
        }
      },
      error: (err) => {
        console.error('Error fetching paginated events:', err);
        this.noEventsMessage = 'An error occurred while fetching events.';
      }
    });
  }

  nextEventPage(): void {
    if (this.eventPageProperties.page < this.eventPageProperties.totalPages - 1) {
      this.eventPageProperties.page++;
      this.fetchPaginatedEvents();
    }
  }
  
  previousEventPage(): void {
    if (this.eventPageProperties.page > 0) {
      this.eventPageProperties.page--;
      this.fetchPaginatedEvents();
    }
  }
  
}

