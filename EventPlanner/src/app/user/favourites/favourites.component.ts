import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../account/account.service';
import { Event } from '../../event/model/event.model';
import {Offering} from '../../offering/model/offering.model';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent implements OnInit{
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
  favouriteEvents: Event[] = [];
  favouriteOfferings:Offering[]=[];
  noEventsMessage: string = '';
  noOfferingsMessage: string = '';

  constructor(
    private accountService:AccountService
  ) {}

  ngOnInit(): void {
    this.fetchFavouriteEvents();
    this.fetchFavouriteOfferings();
  }

  fetchFavouriteEvents(): void {
    const { page, pageSize } = this.eventPageProperties;

    this.accountService.getFavouriteEvents(page, pageSize).subscribe({
      next: (response) => {
        this.favouriteEvents = response.content;
        this.eventPageProperties.totalPages = response.totalPages;
        this.eventPageProperties.totalElements = response.totalElements;
        this.noEventsMessage = this.favouriteEvents.length ? '' : 'No events found.';
      },
      error: () => {
        this.noEventsMessage = 'An error occurred while fetching events.';
      }
    });
  }

  nextEventPage(): void {
    if (this.eventPageProperties.page < this.eventPageProperties.totalPages - 1) {
      this.eventPageProperties.page++;
      this.fetchFavouriteEvents();
    }
  }

  previousEventPage(): void {
    if (this.eventPageProperties.page > 0) {
      this.eventPageProperties.page--;
      this.fetchFavouriteEvents();
    }
  }

  fetchFavouriteOfferings(): void {
    const { page, pageSize } = this.offeringPageProperties;
    this.accountService.getFavouriteOfferings(page, pageSize).subscribe({
      next: (response) => {
        this.favouriteOfferings = response.content;
        this.offeringPageProperties.totalPages = response.totalPages;
        this.offeringPageProperties.totalElements = response.totalElements;
        this.noOfferingsMessage = this.favouriteOfferings.length ? '' : 'No offerings found.';
      },
      error: () => {
        this.noOfferingsMessage = 'An error occurred while fetching offerings.';
      }
    });
  }

  nextOfferingPage(): void {
    if (this.offeringPageProperties.page < this.offeringPageProperties.totalPages - 1) {
      this.offeringPageProperties.page++;
      this.fetchFavouriteOfferings();
    }
  }

  previousOfferingPage(): void {
    if (this.offeringPageProperties.page > 0) {
      this.offeringPageProperties.page--;
      this.fetchFavouriteOfferings();
    }
  }
}
