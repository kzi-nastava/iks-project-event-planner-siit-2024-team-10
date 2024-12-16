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
import { ComponentType } from '@angular/cdk/overlay';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allEvents: Event[] = [];
  topEvents: Event[] = [];
  allOfferings: Offering[] = [];
  topOfferings: Offering[] = [];
  filteredOfferings: Offering[] = [];

  clickedEvent: string = '';
  noTopEventsMessage: string = '';
  noEventsMessage: string = '';
  noTopOfferingsMessage: string = '';
  noOfferingsMessage: string = '';

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
    pageSize: 6,
    totalPages: 0,
    totalElements: 0
  };

  offeringPageProperties = {
    page: 0,
    pageSize: 6,
    totalPages: 0,
    totalElements: 0
  };

  constructor(
    private eventService: EventService,
    private offeringService: OfferingService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchPaginatedEvents();
    this.fetchPaginatedOfferings();

    this.loadTopEvents();
    this.loadTopOfferings();
  }

  loadTopEvents(): void {
    this.eventService.getTop().subscribe({
      next: (events) => {
        this.topEvents = events;
        this.noTopEventsMessage = events.length ? '' : 'No events found.';
      },
      error: () => {
        this.noTopEventsMessage = 'An error occurred while fetching events.';
      }
    });
  }

  loadTopOfferings(): void {
    this.offeringService.getTop().subscribe({
      next: (offerings) => {
        this.topOfferings = offerings;
        this.noTopOfferingsMessage = offerings.length ? '' : 'No offerings found.';
      },
      error: () => {
        this.noTopOfferingsMessage = 'An error occurred while fetching offerings.';
      }
    });
  }

  applySorting(type: 'event' | 'offering'): void {
    const criteria = type === 'event' ? this.selectedEventSortingCriteria : this.selectedOfferingSortingCriteria;
    console.log(`Sorting ${type === 'event' ? 'Events' : 'Offerings'} by ${criteria} in ${this.selectedSortingDirection} order.`);
  }

  openFilterDialog(): void {
    const dialogComponent: ComponentType<any> = this.selectedOfferingType === 'services'
      ? FilterServiceDialogComponent
      : this.selectedOfferingType === 'products'
      ? FilterProductDialogComponent
      : OfferingWarningDialogComponent;
  
    const dialogWidth = dialogComponent === OfferingWarningDialogComponent ? '400px' : '600px';
    this.dialog.open(dialogComponent, { width: dialogWidth });
  }

  openEventFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterEventsDialogComponent, { width: '600px' });

    dialogRef.afterClosed().subscribe((filters) => {
      if (filters) {
        this.fetchPaginatedEvents(filters);
      }
    });
  }

  filterOfferings(): void {
    console.log(`Filtering ${this.selectedOfferingType ? this.selectedOfferingType : 'Offerings'}...`);
  }

  toggleOfferingType(type: 'services' | 'products'): void {
    this.selectedOfferingType = type;
    this.filterOfferings();
  }

  searchEvent(): void {
    this.eventPageProperties.page = 0;
    this.fetchPaginatedEvents();
  }

  searchOffering(): void {
    console.log('Search Query:', this.searchOfferingQuery);
  }

  fetchPaginatedEvents(filters: any = {}): void {
    const { page, pageSize } = this.eventPageProperties;
    if (this.searchEventQuery) filters.name = this.searchEventQuery;

    this.eventService.getPaginatedEvents(page, pageSize, filters).subscribe({
      next: (response) => {
        this.allEvents = response.content;
        this.eventPageProperties.totalPages = response.totalPages;
        this.eventPageProperties.totalElements = response.totalElements;
        this.noEventsMessage = this.allEvents.length ? '' : 'No events found.';
      },
      error: () => {
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
        this.noOfferingsMessage = this.allOfferings.length ? '' : 'No offerings found.';
      },
      error: () => {
        this.noOfferingsMessage = 'An error occurred while fetching offerings.';
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

  nextOfferingPage(): void {
    if (this.offeringPageProperties.page < this.offeringPageProperties.totalPages - 1) {
      this.offeringPageProperties.page++;
      this.fetchPaginatedOfferings();
    }
  }

  previousOfferingPage(): void {
    if (this.offeringPageProperties.page > 0) {
      this.offeringPageProperties.page--;
      this.fetchPaginatedOfferings();
    }
  }
}
