import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../event.service';
import {Event} from '../model/event.model'
import {AgendaItem} from '../model/agenda-item.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  event: Event;
  agenda:AgendaItem[];
  userRating:number;

  constructor(private route: ActivatedRoute, private eventService:EventService) {
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  setRating(rating: number): void {
    this.userRating = rating;
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
    })
  }
}
