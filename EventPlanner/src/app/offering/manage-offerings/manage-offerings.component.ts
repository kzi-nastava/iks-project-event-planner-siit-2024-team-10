import { Component, OnInit } from '@angular/core';
import { Offering } from '../../offering/model/offering.model';
import { MatDialog } from '@angular/material/dialog';
import { FilterServiceDialogComponent } from '../filter-service-dialog/filter-service-dialog.component';
import { FilterProductDialogComponent } from '../filter-product-dialog/filter-product-dialog.component';
import { OfferingWarningDialogComponent } from '../../layout/offering-warning-dialog/offering-warning-dialog.component';
import { ServiceService } from '../service-service/service.service';
import {AuthService} from '../../infrastructure/auth/auth.service';
import {OfferingService} from '../offering-service/offering.service';
import {ComponentType} from '@angular/cdk/overlay';
@Component({
  selector: 'app-manage-offerings',
  templateUrl: './manage-offerings.component.html',
  styleUrls: ['./manage-offerings.component.css', '../../layout/home/home.component.css']
})
export class ManageOfferingsComponent implements OnInit {
  allOfferings: Offering[] = [];
  noOfferingsMessage: string = '';
  userId: number = null;
  accountId: number = null;
  initialLoad: boolean = true;

  sortingDirections = ['Ascending', 'Descending'];
  offeringSortingCriteria = ['None', 'Name', 'Rating', 'City', 'Price'];
  offeringSortingCriteriaMapping: { [key: string]: string } = {
    'None': '',
    'Name': 'name',
    'Price': 'price',
    'Rating': 'averageRating',
    'City': 'location.city'
  };

  selectedSortingDirection: string = 'Ascending';
  selectedOfferingSortingCriteria: string = 'None';
  selectedOfferingType: 'services' | 'products' | null = null;

  offeringFilters: any = {};
  searchOfferingQuery: string = '';

  offeringPageProperties = {
    page: 0,
    pageSize: 6,
    totalPages: 0,
    totalElements: 0,
  };

  constructor(
    private offeringService: OfferingService,
    private authService: AuthService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.accountId = this.authService.getAccountId();
    this.fetchPaginatedOfferings();
    this.initialLoad = false;
  }

  fetchPaginatedOfferings(): void {
    const {page, pageSize} = this.offeringPageProperties;
    if (this.initialLoad) {
      this.offeringFilters = {...this.offeringFilters, ...{accountId: this.accountId}};
    } else {
      delete this.offeringFilters.accountId;
    }
    if (this.selectedOfferingType !== null) {
      this.offeringFilters.isServiceFilter = this.selectedOfferingType === 'services';
    }

    this.offeringFilters = {...this.offeringFilters, ...{providerId: this.userId}};

    this.offeringService.getPaginatedOfferings(page, pageSize, this.offeringFilters).subscribe({
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

  applySorting(): void {
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
    const dialogRef = this.dialog.open(dialogComponent, { width: dialogWidth , data: true });

    dialogRef.afterClosed().subscribe((newFilters) => {
      if (newFilters) {
        this.applyOfferingFilters(newFilters);
      }
    });
  }

  resetOfferingFilter(): void{
    this.searchOfferingQuery = '';
    this.offeringFilters = {};
    this.offeringPageProperties.page = 0;
    this.fetchPaginatedOfferings();
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

  searchOffering(): void {
    this.offeringPageProperties.page = 0;
    this.offeringFilters.name = this.searchOfferingQuery;
    this.fetchPaginatedOfferings();
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
