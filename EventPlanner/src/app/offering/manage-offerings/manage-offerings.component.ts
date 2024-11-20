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
  
  selectedOfferingType: 'services' | 'products' = 'services';

  sortingDirections = ['Ascending', 'Descending'];
  offeringSortingCriteria = ['None', 'Name', 'Rating', 'City', 'Price', 'Category'];
  
  selectedSortingDirection: string = 'Ascending';
  selectedOfferingSortingCriteria: string = 'None';

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
    this.displayedOfferings = this.allOfferings.filter(offering => 
      this.selectedOfferingType === 'services' 
        ? !offering.isProduct 
        : offering.isProduct
    );
  }

  // prebacivanje sa usluga na proizvode
  toggleOfferingType(type: 'services' | 'products') {
    this.selectedOfferingType = type;
    this.filterOfferings();
  }

  // filtriranja usluge po kategoriji, tipu događaja, ceni, dostupnosti
}