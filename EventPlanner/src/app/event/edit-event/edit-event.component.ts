import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EventType} from '../model/event-type.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventTypeService} from '../event-type.service';
import {EventService} from '../event.service';
import {AuthService} from '../../infrastructure/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Event} from '../model/event.model';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit{
  editForm: FormGroup = new FormGroup({
    eventType: new FormControl('', [Validators.required]),
    noEventType: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    maxParticipants: new FormControl('', [Validators.required,Validators.pattern('^[0-9]+$')]),
    eventPublicity: new FormControl(true, [Validators.required]),
    country: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    houseNumber: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });
  allEventTypes:EventType[];
  event:Event;
  today=new Date();
  snackBar:MatSnackBar = inject(MatSnackBar);
  constructor(private eventTypeService: EventTypeService,
              private eventService:EventService,
              private authService:AuthService,
              private router:Router,
              private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.editForm.patchValue({eventPublicity:"open",noEventType:false})
    this.eventTypeService.getAll().subscribe({
      next: (eventTypes:EventType[]) => {
        this.allEventTypes = eventTypes.filter((x) => x.active);
        this.initializeEventType();
      },
      error: (_) => {
        this.snackBar.open('Error loading event types','OK',{duration:3000});
      }
    });
    this.editForm.get('noEventType')?.valueChanges.subscribe((noEventTypeValue) => {
      const eventTypeControl = this.editForm.get('eventType');
      if (noEventTypeValue) {
        eventTypeControl?.clearValidators(); // Remove 'required' validator
      } else {
        eventTypeControl?.setValidators([Validators.required]); // Add 'required' validator
      }
      eventTypeControl?.updateValueAndValidity(); // Re-evaluate validation status
    });
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.eventService.getEvent(id).subscribe({
        next: (event: Event) => {
          this.event=event;
          this.editForm.patchValue({
            noEventType:event.eventType==null,
            name:event.name,
            description:event.description,
            maxParticipants:event.maxParticipants,
            eventPublicity:event.open?'open':'closed',
            country:event.location.country,
            city:event.location.city,
            street:event.location.street,
            houseNumber:event.location.houseNumber,
            date:event.date
          })
          this.initializeEventType();
          //todo: select event type
        },
        error: (err) => {
          this.snackBar.open('Error fetching event','OK',{duration:5000});
          console.error('Error fetching event:', err);
        }
      });
    })
  }
  eventTypesDisplayed():boolean{
    return !this.editForm.value.noEventType;
  }
  initializeEventType():void{
    if(this.event==null||this.allEventTypes?.length==0||this.event.eventType==null)
      return;
    let eventType = this.allEventTypes.find(event => event.id === this.event.eventType.id);
    if(eventType==null){
      eventType=this.event.eventType;
      this.allEventTypes.push(eventType);
    }
    this.editForm.patchValue({eventType:eventType});
  }
}
