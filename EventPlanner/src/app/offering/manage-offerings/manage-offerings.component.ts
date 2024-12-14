import { Component, OnInit } from '@angular/core';
import { Offering } from '../../offering/model/offering.model';
import { MatDialog } from '@angular/material/dialog';
import { FilterServiceDialogComponent } from '../filter-service-dialog/filter-service-dialog.component';
import { FilterProductDialogComponent } from '../filter-product-dialog/filter-product-dialog.component';
import { OfferingWarningDialogComponent } from '../../layout/offering-warning-dialog/offering-warning-dialog.component';
import { ServiceService } from '../service-service/service.service';
@Component({
  selector: 'app-manage-offerings',
  templateUrl: './manage-offerings.component.html',
  styleUrls: ['./manage-offerings.component.css', '../../layout/home/home.component.css']
})
export class ManageOfferingsComponent implements OnInit {
  allOfferings: Offering[] = [];
  displayedOfferings: Offering[] = [];
  filteredOfferings: Offering[] = [];
  selectedOfferingType: 'services' | 'products' = 'services';
  noOfferingsMessage: string = '';
  sortingDirections = ['Ascending', 'Descending'];
  offeringSortingCriteria = ['None', 'Name', 'Rating', 'City', 'Price'];

  selectedSortingDirection: string = 'Ascending';
  selectedOfferingSortingCriteria: string = 'None';
  searchOfferingQuery: string = '';
  offeringPageProperties = {
    page: 0,
    pageSize: 5,
    totalPages: 0,
    totalElements: 0,
  };

  constructor(private service: ServiceService, private dialog:MatDialog) {}

  ngOnInit(): void {
    this.fetchPaginatedOfferings();
  }

  fetchPaginatedOfferings(): void {
    const { page, pageSize } = this.offeringPageProperties;
  
    this.service.getPaginatedOfferings(page, pageSize).subscribe({
      next: (response) => {
        this.allOfferings = response.content;
        this.filteredOfferings = response.content;
        this.displayedOfferings = this.filteredOfferings; 
        this.offeringPageProperties.totalPages = response.totalPages;
        this.offeringPageProperties.totalElements = response.totalElements;
  
        if (this.allOfferings === null || this.allOfferings.length === 0) {
          this.noOfferingsMessage = 'No offerings found.';
        } else {
          this.noOfferingsMessage = '';
        }
      },
      error: (err) => {
        console.error('Error fetching paginated offerings:', err);
        this.noOfferingsMessage = 'An error occurred while fetching offerings.';
      }
    });
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
  toggleOfferingType(type: 'services' | 'products') {
    this.selectedOfferingType = type;
    this.filterOfferings();
  }

  filterOfferings() {
    if (this.selectedOfferingType === 'services') {
      console.log('Filtering Services...');
    } else if (this.selectedOfferingType === 'products') {
      console.log('Filtering Products...');
    } else {
      console.log('No Offering Type Selected.');
    }
  }
  applySorting(type: 'event' | 'offering') {
    console.log(`Sorting Offerings by ${this.selectedOfferingSortingCriteria} in ${this.selectedSortingDirection} order.`);
  }
  searchOffering() {
    console.log('Search Query:', this.searchOfferingQuery);
  }
}