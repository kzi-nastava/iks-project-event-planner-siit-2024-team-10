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

  clickedEvent: string = '';
  noTopEventsMessage: string = '';
  noEventsMessage: string = '';
  noTopOfferingsMessage: string = '';
  noOfferingsMessage: string = '';

  sortingDirections = ['Ascending', 'Descending'];
  eventSortingCriteria = ['None', 'Name', 'Date and Time', 'Rating', 'City'];

  eventSortingCriteriaMapping: { [key: string]: string } = {
    'None': '',
    'Name': 'name',
    'Date and Time': 'date',
    'Rating': 'averageRating',
    'City': 'location.city'
  };  

  offeringSortingCriteria = ['None', 'Name', 'Rating', 'City', 'Price'];

  offeringSortingCriteriaMapping: { [key: string]: string } = {
    'None': '',
    'Name': 'name',
    'Price': 'price',
    'Rating': 'averageRating',
    'City': 'location.city'
  };  

  selectedSortingDirection: string = 'Ascending';
  selectedEventSortingCriteria: string = 'None';
  selectedOfferingSortingCriteria: string = 'None';
  selectedOfferingType: 'services' | 'products' | null = null;

  eventFilters: any = {};
  offeringFilters: any = {};


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
      const backendSortBy = this.eventSortingCriteriaMapping[this.selectedEventSortingCriteria];
    
      if (backendSortBy) {
        this.eventFilters.sortBy = backendSortBy;
        this.eventFilters.sortDirection = this.selectedSortingDirection.toUpperCase() === 'ASCENDING' ? 'ASC' : 'DESC';
      } else {
        delete this.eventFilters.sortBy;
        delete this.eventFilters.sortDirection;
      }
    
      this.eventPageProperties.page = 0;
      this.fetchPaginatedEvents(this.eventFilters);
    }
    

  applyFilters(newFilters: any): void {
    this.eventFilters = { ...this.eventFilters, ...newFilters };
    this.eventPageProperties.page = 0;
    this.fetchPaginatedEvents(this.eventFilters);
  }

  applyOfferingFilters(newFilters: any): void {
    this.offeringFilters = { ...this.offeringFilters, ...newFilters };
    this.offeringPageProperties.page = 0;
    this.fetchPaginatedOfferings();
  }

  openFilterDialog(): void {
    const dialogComponent: ComponentType<any> = this.selectedOfferingType === 'services'
      ? FilterServiceDialogComponent
      : this.selectedOfferingType === 'products'
      ? FilterProductDialogComponent
      : OfferingWarningDialogComponent;
  
    const dialogWidth = dialogComponent === OfferingWarningDialogComponent ? '400px' : '600px';
    const dialogRef = this.dialog.open(dialogComponent, { width: dialogWidth });
    
    dialogRef.afterClosed().subscribe((newFilters) => {
      if (newFilters) {
        this.applyOfferingFilters(newFilters);
      }
    });
  }

  resetEventFilter(): void{
    this.searchEventQuery = '';
    this.eventFilters = {};
    this.fetchPaginatedEvents();
  }

  resetOfferingFilter(): void{
    this.searchOfferingQuery = '';
    this.offeringFilters = {};
    this.fetchPaginatedOfferings();
  }

  openEventFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterEventsDialogComponent, { width: '600px' });
  
    dialogRef.afterClosed().subscribe((newFilters) => {
      if (newFilters) {
        this.applyFilters(newFilters);
      }
    });
  }

  toggleOfferingType(type: 'services' | 'products'): void {
    this.selectedOfferingType = type;
    if (type === 'services') {
      this.offeringFilters.isServiceFilter = true;
    } else if (type === 'products') {
      this.offeringFilters.isServiceFilter = false;
    } else{
      delete this.offeringFilters.isServiceFilter;
    }
    this.fetchPaginatedOfferings();
    this.resetOfferingFilter();
  }

  searchEvent(): void {
    this.eventPageProperties.page = 0;
    this.eventFilters.name = this.searchEventQuery;
    this.fetchPaginatedEvents();
  }

  searchOffering(): void {
    this.offeringPageProperties.page = 0;
    this.offeringFilters.name = this.searchOfferingQuery;
    this.fetchPaginatedOfferings();
  }

  fetchPaginatedEvents(eventFilters: any = this.eventFilters): void {
    const { page, pageSize } = this.eventPageProperties;
  
    this.eventService.getPaginatedEvents(page, pageSize, eventFilters).subscribe({
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
  

  fetchPaginatedOfferings(offeringFilters: any = this.offeringFilters): void {
    const { page, pageSize } = this.offeringPageProperties;

    this.offeringService.getPaginatedOfferings(page, pageSize, offeringFilters).subscribe({
      next: (response) => {
        this.allOfferings = response.content;
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
