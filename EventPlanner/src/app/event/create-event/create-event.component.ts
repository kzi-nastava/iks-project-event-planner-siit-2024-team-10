import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../offering/model/category.model';
import { EventType } from '../model/event-type.model';
import {EventTypeService} from '../event-type.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent implements OnInit{
  createForm: FormGroup = new FormGroup({
    eventType: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    maxParticipants: new FormControl('', [Validators.required]),
    eventPublicity: new FormControl(true, [Validators.required]),
    country: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    houseNumber: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });
  allEventTypes:EventType[];

  constructor(private eventTypeService: EventTypeService,) {}

  ngOnInit(): void {
    this.createForm.patchValue({eventPublicity:"open"})
    this.eventTypeService.getAll().subscribe({
      next: (eventTypes:EventType[]) => {
        console.log(eventTypes[0].active);
        this.allEventTypes = eventTypes.filter((x) => x.active);
        console.log(this.allEventTypes);
      },
      error: (_) => {
        console.log("Error loading categories")
      }
    });
  }

  save():void{}
}
