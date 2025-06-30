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

  role:string;
  snackBar:MatSnackBar = inject(MatSnackBar)
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    height: 'auto'
  };

  ngOnInit(): void {
    this.role=this.authService.getRole();
    this.accountService.getCalendar(this.authService.getAccountId()).subscribe({
      next: (calendar:CalendarItem[]) => {
        let events=[]
        for(let calendarItem of calendar){
          events.push({
            title: calendarItem.title,
            start:calendarItem.startTime,
            end:calendarItem.endTime,
            url:'event/'+calendarItem.eventId,
            allDay:calendarItem.type=='CREATED_EVENT'||calendarItem.type=='ACCEPTED_EVENT',
            backgroundColor:this.getCalendarItemColor(calendarItem.type)
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

  getCalendarItemColor(itemType:string):string{
    if(itemType=='ACCEPTED_EVENT')
      return 'red'
    if(itemType=='CREATED_EVENT')
      return 'green'
    if(itemType=='RESERVATION')
      return 'blue'
    return 'black'
  }
}
