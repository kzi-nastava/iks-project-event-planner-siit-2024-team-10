import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Category} from '../../offering/model/category.model';
import { EventType } from '../model/event-type.model';
import {EventTypeService} from '../event-type.service';
import {CreateEventTypeDTO} from '../model/create-event-type-dto.model';
import {CreateEventDTO} from '../model/create-event-dto.model';
import {CreateLocationDTO} from '../model/create-location-dto.model';
import {formatDate} from '@angular/common';
import {EventService} from '../event.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../infrastructure/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent implements OnInit{
  createForm: FormGroup = new FormGroup({
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
  today=new Date();
  snackBar:MatSnackBar = inject(MatSnackBar);

  constructor(private eventTypeService: EventTypeService,
              private eventService:EventService,
              private authService:AuthService,
              private router:Router) {}

  ngOnInit(): void {
    this.createForm.patchValue({eventPublicity:"open",noEventType:false})
    this.eventTypeService.getAll().subscribe({
      next: (eventTypes:EventType[]) => {
        this.allEventTypes = eventTypes.filter((x) => x.active);
      },
      error: (_) => {
        this.snackBar.open('Error loading event types','OK',{duration:3000});
      }
    });
    this.createForm.get('noEventType')?.valueChanges.subscribe((noEventTypeValue) => {
      const eventTypeControl = this.createForm.get('eventType');
      if (noEventTypeValue) {
        eventTypeControl?.clearValidators(); // Remove 'required' validator
      } else {
        eventTypeControl?.setValidators([Validators.required]); // Add 'required' validator
      }
      eventTypeControl?.updateValueAndValidity(); // Re-evaluate validation status
    });

  }

  eventTypesDisplayed():boolean{
    return !this.createForm.value.noEventType;
  }

  save():void{
    if(this.createForm.valid){
      const event:CreateEventDTO={
        eventTypeId:this.createForm.value.noEventType?null:this.createForm.value.eventType.id,
        organizerId:this.authService.getUserId(),
        name:this.createForm.value.name,
        description:this.createForm.value.description,
        maxParticipants:parseInt(this.createForm.value.maxParticipants, 10),
        isOpen:this.createForm.value.eventPublicity==='open',
        date:(new Date(this.createForm.value.date.getTime() - this.createForm.value.date.getTimezoneOffset() * 60000)).toISOString().split('T')[0],
        location:{
          country:this.createForm.value.country,
          city:this.createForm.value.city,
          street:this.createForm.value.street,
          houseNumber:this.createForm.value.houseNumber
        }
      }
      this.eventService.add(event).subscribe({
        next: () => {
          this.snackBar.open('Event created successfully','OK',{duration:3000});
          this.router.navigate(['home']);
        },
        error: () => {
          this.snackBar.open('Error creating event','OK',{duration:3000});
        }
      });
    }
  }
}
