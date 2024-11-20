import { Component, OnInit } from '@angular/core';
import { Event } from '../../event/model/event.model';
import { EventService } from '../../event/event.service';
import { OfferingService } from '../../offering/offering.service';
import { Offering } from '../../offering/model/offering.model';

@Component({
  selector: 'app-manage-offerings',
  templateUrl: './manage-offerings.component.html',
  styleUrls: ['./manage-offerings.component.css', '../../layout/home/home.component.css']
})
export class ManageOfferingsComponent implements OnInit {
  allEvents: Event[] = [];
  topEvents: Event[] = [];
  topOfferings: Offering[] = [];
  allOfferings: Offering[] = [];
  displayedOfferings: Offering[] = [];

  selectedOfferingType: 'services' | 'products' = 'services';

  sortingDirections = ['Ascending', 'Descending'];
  offeringSortingCriteria = ['None', 'Name', 'Rating', 'City', 'Price', 'Category'];

  selectedSortingDirection: string = 'Ascending';
  selectedOfferingSortingCriteria: string = 'None';

  // New filter properties
  selectedCategory: string = '';
  categories: string[] = ['Technology', 'Health', 'Education', 'Entertainment']; // Example categories

  selectedEventType: string = '';
  eventTypes: string[] = ['Workshop', 'Seminar', 'Webinar', 'Conference']; // Example event types

  selectedPriceRange: string = '';
  priceRanges: string[] = ['Free', 'Under $50', '$50 - $100', 'Above $100']; // Example price ranges

  isAvailable: boolean = false; // Availability filter

  constructor(
    private offeringService: OfferingService
  ) {}

  ngOnInit(): void {
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

  filterOfferings() {
    this.displayedOfferings = this.allOfferings.filter(offering => {
      // Filtering by offering type (services/products)
      const isOfferingTypeValid = this.selectedOfferingType === 'services'
        ? !offering.isProduct
        : offering.isProduct;

      // Filtering by category
      const isCategoryValid = this.selectedCategory ? offering.category === this.selectedCategory : true;

      // Filtering by event type
      const isEventTypeValid = true;
      // this.selectedEventType ? offering.eventType === this.selectedEventType : true;

      // Filtering by price range
      const isPriceRangeValid = this.selectedPriceRange
        ? this.isPriceInRange(offering.price, this.selectedPriceRange)
        : true;

      // Filtering by availability
      const isAvailabilityValid = this.isAvailable ? offering.isAvailable : true;

      return isOfferingTypeValid && isCategoryValid && isEventTypeValid && isPriceRangeValid && isAvailabilityValid;
    });
  }

  // Helper function to check if the price is within the selected price range
  isPriceInRange(price: number, selectedPriceRange: string): boolean {
    switch (selectedPriceRange) {
      case 'Free':
        return price === 0;
      case 'Under $50':
        return price < 50;
      case '$50 - $100':
        return price >= 50 && price <= 100;
      case 'Above $100':
        return price > 100;
      default:
        return true;
    }
  }

  // Toggle between services and products
  toggleOfferingType(type: 'services' | 'products') {
    this.selectedOfferingType = type;
    this.filterOfferings();
  }

  // Methods for updating filters can be added here, such as selecting a category, event type, etc.
}
