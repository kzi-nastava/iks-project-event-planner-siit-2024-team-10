import {Component, inject, OnInit} from '@angular/core';
import {CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {Router} from '@angular/router';
import {AccountService} from '../../account/account.service';
import {Event} from '../../event/model/event.model';
import {AuthService} from '../../infrastructure/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CalendarItem} from '../model/calendar-item.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  constructor(private accountService:AccountService,
              private authService: AuthService) {
  }

  snackBar:MatSnackBar = inject(MatSnackBar)
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    events: [{title: 'Project Meeting',
    start: '2025-07-27T10:00:00',
    end: '2025-07-27T12:30:00',
      url:'event/3'
    }],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    height: 'auto'
  };

  ngOnInit(): void {
    this.accountService.getCalendar(this.authService.getAccountId()).subscribe({
      next: (calendar:CalendarItem[]) => {
        let events=[]
        for(let calendarItem of calendar){
          events.push({
            title: calendarItem.title,
            start:calendarItem.startTime,
            end:calendarItem.endTime,
            url:'event/'+calendarItem.eventId,
            allDay:calendarItem.type=='CREATED_EVENT'||calendarItem.type=='ACCEPTED_EVENT'
          });
        }
        this.calendarOptions.events=events;
      },
      error: (err) => {
        this.snackBar.open('Error fetching calendar','OK',{duration:5000});
        console.error('Error fetching calendar:', err);
      }
    });
  }
}
