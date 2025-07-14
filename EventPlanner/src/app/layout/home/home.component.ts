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
import { of } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { AuthService } from '../../infrastructure/auth/auth.service';

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
  accountId:number = null;
  initialLoadEvents: boolean = true;
  initialLoadOfferings: boolean = true;

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
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.accountId = this.authService.getAccountId();

    this.fetchPaginatedEvents();
    this.fetchPaginatedOfferings();

    this.loadTopEvents();
    this.loadTopOfferings();

    this.initialLoadEvents = true;
    this.initialLoadOfferings = true;
  }

  loadTopEvents(): void {
    this.eventService.getTop(this.accountId).subscribe({
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
    this.offeringService.getTop(this.accountId).subscribe({
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
      if(type === 'event'){
        const backendSortBy = this.eventSortingCriteriaMapping[this.selectedEventSortingCriteria];
      
        if (backendSortBy) {
          this.eventFilters.sortBy = backendSortBy;
          this.eventFilters.sortDirection = this.selectedSortingDirection.toUpperCase() === 'ASCENDING' ? 'ASC' : 'DESC';
        } else {
          delete this.eventFilters.sortBy;
          delete this.eventFilters.sortDirection;
        }
      
        this.eventPageProperties.page = 0;
        this.fetchPaginatedEvents();
      }else{
        const backendSortBy = this.offeringSortingCriteriaMapping[this.selectedOfferingSortingCriteria];
      
        if (backendSortBy) {
          this.offeringFilters.sortBy = backendSortBy;
          this.offeringFilters.sortDirection = this.selectedSortingDirection.toUpperCase() === 'ASCENDING' ? 'ASC' : 'DESC';
        } else {
          delete this.offeringFilters.sortBy;
          delete this.offeringFilters.sortDirection;
        }
      
        this.offeringPageProperties.page = 0;
        this.fetchPaginatedOfferings();
      }
    }
    

  applyFilters(newFilters: any): void {
    if (newFilters) {
      this.initialLoadEvents = false;
    }
    this.eventFilters = { ...this.eventFilters, ...newFilters };
    this.eventPageProperties.page = 0;
    this.fetchPaginatedEvents();
  }

  applyOfferingFilters(newFilters: any): void {
    if (newFilters) {
      this.initialLoadOfferings = false;
    }
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
    this.eventPageProperties.page = 0;
    this.fetchPaginatedEvents();
  }

  resetOfferingFilter(): void{
    this.searchOfferingQuery = '';
    this.offeringFilters = {};
    this.offeringPageProperties.page = 0;
    this.fetchPaginatedOfferings();
  }

  seeAllEvents(): void{
    this.initialLoadEvents = false;
    this.resetEventFilter();
  }

  seeAllOfferings(): void{
    this.initialLoadOfferings = false;
    this.resetOfferingFilter();
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
      this.selectedOfferingType = null;
    }
    this.resetOfferingFilter();
  }

  searchEvent(): void {
    if (this.searchEventQuery == ''){
      return
    }
    this.eventPageProperties.page = 0;
    this.eventFilters.name = this.searchEventQuery;
    this.initialLoadEvents = false;
    this.fetchPaginatedEvents();
  }

  searchOffering(): void {
    if (this.searchOfferingQuery == ''){
      return
    }
    this.offeringPageProperties.page = 0;
    this.offeringFilters.name = this.searchOfferingQuery;
    this.initialLoadOfferings = false;
    this.fetchPaginatedOfferings();
  }

  fetchPaginatedEvents(): void {
    const { page, pageSize } = this.eventPageProperties;
    if (this.initialLoadEvents){
      this.eventFilters = { ...this.eventFilters, ...{accountId: this.accountId} };
    }else{
      delete this.eventFilters.accountId;
    }
    this.eventService.getPaginatedEvents(page, pageSize, this.eventFilters).subscribe({
      next: (response) => {
        this.allEvents = response.content;
        this.eventPageProperties.totalPages = response.totalPages;
        this.eventPageProperties.totalElements = response.totalElements;
        this.noEventsMessage = this.allEvents.length ? '' : 'No events found.';

        if(this.noEventsMessage && this.initialLoadEvents){
          this.noEventsMessage = 'No events found in your area.';
        }
      },
      error: () => {
        this.noEventsMessage = 'An error occurred while fetching events.';
      }
    });
  }
  

  fetchPaginatedOfferings(): void {
    const { page, pageSize } = this.offeringPageProperties;
    if (this.initialLoadOfferings){
      this.offeringFilters = { ...this.offeringFilters, ...{accountId: this.accountId} };
    }else{
      delete this.offeringFilters.accountId;
    }
    if (this.selectedOfferingType!==null){
      this.offeringFilters.isServiceFilter = this.selectedOfferingType === 'services';
    }

    this.offeringService.getPaginatedOfferings(page, pageSize, this.offeringFilters).subscribe({
      next: (response) => {
        this.allOfferings = response.content;
        this.offeringPageProperties.totalPages = response.totalPages;
        this.offeringPageProperties.totalElements = response.totalElements;
        this.noOfferingsMessage = this.allOfferings.length ? '' : 'No offerings found.';

        if(this.noOfferingsMessage && this.initialLoadOfferings){
          this.noOfferingsMessage = 'No offerings found in your area';
        }
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
