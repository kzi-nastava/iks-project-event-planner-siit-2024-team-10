import {Component, inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../event.service';
import {Event} from '../model/event.model'
import {AgendaItem} from '../model/agenda-item.model';
import {Observable} from 'rxjs';
import {AccountService} from '../../account/account.service';
import {CreateEventRatingDTO} from '../model/create-event-rating-dto.model';
import {CreatedEventRatingDTO} from '../model/created-event-rating-dto.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../infrastructure/auth/auth.service';

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
  loggedInUserId:number;
  snackBar:MatSnackBar = inject(MatSnackBar)

  constructor(
    private route: ActivatedRoute,
    private eventService:EventService,
    private accountService: AccountService,
    private authService:AuthService) {
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
          this.snackBar.open('Error adding event to favourites','OK',{duration:5000});
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
          this.snackBar.open('Error removing event from favourites','OK',{duration:5000});
          console.error('Error removing event from favourites:', err);
        }
      });
    }
  }

  addReview():void{
    this.eventService.addRating(this.event.id,{rating:this.userRating}).subscribe({
      next: (createdEventRating:CreatedEventRatingDTO) => {
        this.event.averageRating=createdEventRating.averageRating;
        this.snackBar.open('Event rated successfully','OK',{duration:5000});
      },
      error: (err) => {
        this.snackBar.open('Error rating event','OK',{duration:5000});
        console.error('Error rating event:', err);
      }
    });
  }

  ngOnInit(): void {
    this.loggedInUserId=this.authService.getUserId();
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.eventService.getEvent(id).subscribe({
        next: (event: Event) => {
          console.log(event);
          this.event=event;
        },
        error: (err) => {
          this.snackBar.open('Error fetching event','OK',{duration:5000});
          console.error('Error fetching event:', err);
        }
      });
      this.eventService.getEventAgenda(id).subscribe({
        next: (agenda: AgendaItem[]) => {
          this.agenda=agenda;
        },
        error: (err) => {
          this.snackBar.open('Error fetching event agenda','OK',{duration:5000});
          console.error('Error fetching event agenda:', err);
        }
      });
      this.accountService.isInFavouriteEvents(id).subscribe({
        next: (isFavourite: boolean) => {
          this.isFavourite = isFavourite;
        },
        error: (err) => {
          this.snackBar.open('Error fetching favourite event','OK',{duration:5000});
          console.error('Error fetching favourite event:', err);
        }
      });
    })
  }
}
