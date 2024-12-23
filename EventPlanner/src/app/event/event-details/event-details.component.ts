import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../event.service';
import {Event} from '../model/event.model'
import {AgendaItem} from '../model/agenda-item.model';
import {Observable} from 'rxjs';
import {AccountService} from '../../account/account.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  event: Event;
  agenda:AgendaItem[];
  userRating:number;
  isFavourite:boolean=false;

  constructor(
    private route: ActivatedRoute,
    private eventService:EventService,
    private accountService: AccountService) {
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  setRating(rating: number): void {
    this.userRating = rating;
  }

  toggleFavourite(): void {
    if(this.isFavourite){
      this.accountService.removeEventFromFavourites(this.event.id).subscribe({
        next: () => {
          this.isFavourite = !this.isFavourite;
        },
        error: (err) => {
          console.error('Error adding event to favourites:', err);
        }
      });
    }
    else {
      this.accountService.addEventToFavourites(this.event.id).subscribe({
        next: () => {
          this.isFavourite = !this.isFavourite;
        },
        error: (err) => {
          console.error('Error removing event from favourites:', err);
        }
      });
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.eventService.getEvent(id).subscribe({
        next: (event: Event) => {
          console.log(event);
          this.event=event;
        },
        error: (err) => {
          console.error('Error fetching event:', err);
        }
      });
      this.eventService.getEventAgenda(id).subscribe({
        next: (agenda: AgendaItem[]) => {
          this.agenda=agenda;
        },
        error: (err) => {
          console.error('Error fetching event agenda:', err);
        }
      });
      this.accountService.isInFavouriteEvents(id).subscribe({
        next: (isFavourite: boolean) => {
          this.isFavourite = isFavourite;
        },
        error: (err) => {
          console.error('Error fetching favourite event:', err);
        }
      });
    })
  }
}
