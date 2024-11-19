import { Component, OnInit } from '@angular/core';
import { Event } from '../../event/model/event.model';
import { EventService } from '../../event/event.service';
import { OfferingService } from '../../offering/offering.service';
import { Offering } from '../../offering/model/offering.model';

@Component({
  selector: 'app-manage-offerings',
  templateUrl: './manage-offerings.component.html',
  styleUrls: ['./manage-offerings.component.css','../../layout/home/home.component.css']
})
export class ManageOfferingsComponent implements OnInit {
  allEvents: Event[] = [];
  topEvents: Event[] = [];
  topOfferings: Offering[] = [];
  allOfferings: Offering[] = [];
  displayedOfferings: Offering[] = [];
  
  // Updated to use isProduct boolean
  selectedOfferingType: 'services' | 'products' = 'services';

  clickedEvent: string;

  sortingDirections = ['Ascending', 'Descending'];
  eventSortingCriteria = ['None', 'Name', 'Date and Time', 'Rating', 'City'];
  offeringSortingCriteria = ['None', 'Name', 'Rating', 'City', 'Price', 'Category'];
  
  selectedSortingDirection: string = 'Ascending';
  selectedEventSortingCriteria: string = 'None';
  selectedOfferingSortingCriteria: string = 'None';

  constructor(
    private service: EventService, 
    private offeringService: OfferingService
  ) {}

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
        this.filterOfferings();
      },
      error: (err) => {
        console.error('Error fetching offerings:', err);
      }
    });

    this.topOfferings = this.allOfferings.slice(0, 5);
  }

  // Updated to filter based on isProduct
  filterOfferings() {
    this.displayedOfferings = this.allOfferings.filter(offering => 
      this.selectedOfferingType === 'services' 
        ? !offering.isProduct 
        : offering.isProduct
    );
  }

  // Method to toggle between services and products
  toggleOfferingType(type: 'services' | 'products') {
    this.selectedOfferingType = type;
    this.filterOfferings();
  }

  applySorting(type: 'event' | 'offering') {
    if (type === 'event') {
      console.log(`Sorting Events by ${this.selectedEventSortingCriteria} in ${this.selectedSortingDirection} order.`);
    } else {
      // Apply sorting to displayed offerings
      const sortFactor = this.selectedOfferingSortingCriteria.toLowerCase();
      
      this.displayedOfferings.sort((a, b) => {
        let comparison = 0;
        switch(sortFactor) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'rating':
            comparison = parseFloat(a.rating || '0') - parseFloat(b.rating || '0');
            break;
          case 'city':
            // Assuming city might be part of the provider or another field
            comparison = (a.provider || '').localeCompare(b.provider || '');
            break;
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
        }
        
        return this.selectedSortingDirection === 'Ascending' 
          ? comparison 
          : -comparison;
      });

      console.log(`Sorting Offerings by ${this.selectedOfferingSortingCriteria} in ${this.selectedSortingDirection} order.`);
    }
  }
}