import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Category } from '../../offering/model/category.model';
import { EventType } from '../model/event-type.model';
import { EventTypeService } from '../event-type.service';
import { CreateEventDTO } from '../model/create-event-dto.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { Router } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  createForm: FormGroup;
  allEventTypes: EventType[] = [];
  today = new Date();
  snackBar: MatSnackBar = inject(MatSnackBar);
  recommendedCategories: Category[] = [];

  constructor(
    private eventTypeService: EventTypeService,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      eventType: ['', Validators.required],
      noEventType: [false],
      name: ['', Validators.required],
      description: ['', Validators.required],
      maxParticipants: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      eventPublicity: ['open', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      date: ['', Validators.required],
      budgetItems: this.fb.array([]) // FormArray za budžetske stavke
    });
  }

  ngOnInit(): void {
    this.eventTypeService.getAll().subscribe({
      next: (eventTypes: EventType[]) => {
        this.allEventTypes = eventTypes.filter((x) => x.active);
      },
      error: () => {
        this.snackBar.open('Error loading event types', 'OK', { duration: 3000 });
      }
    });

    this.createForm.get('noEventType')?.valueChanges.subscribe((noEventTypeValue) => {
      const eventTypeControl = this.createForm.get('eventType');
      if (noEventTypeValue) {
        eventTypeControl?.clearValidators();
      } else {
        eventTypeControl?.setValidators([Validators.required]);
      }
      eventTypeControl?.updateValueAndValidity();
    });

    this.createForm.get('eventType')?.valueChanges.subscribe((selectedType: EventType) => {
      if (selectedType && selectedType.recommendedCategories) {
        this.recommendedCategories = selectedType.recommendedCategories;
      } else {
        this.recommendedCategories = [];
      }
      // Resetuj budžetske stavke pri promeni tipa događaja
      this.budgetItemsFormArray.clear();
    });
  }

  eventTypesDisplayed(): boolean {
    return !this.createForm.value.noEventType;
  }

  get budgetItemsFormArray(): FormArray {
    return this.createForm.get('budgetItems') as FormArray;
  }

  addBudgetItem(): void {
    const group = this.fb.group({
      category: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]]
    });
    this.budgetItemsFormArray.push(group);
  }

  save(): void {
    if (this.createForm.valid) {
      const formValue = this.createForm.value;

      const event: CreateEventDTO = {
        eventTypeId: formValue.noEventType ? null : formValue.eventType.id,
        organizerId: this.authService.getUserId(),
        name: formValue.name,
        description: formValue.description,
        maxParticipants: parseInt(formValue.maxParticipants, 10),
        isOpen: formValue.eventPublicity === 'open',
        date: (new Date(formValue.date.getTime() - formValue.date.getTimezoneOffset() * 60000)).toISOString().split('T')[0],
        location: {
          country: formValue.country,
          city: formValue.city,
          street: formValue.street,
          houseNumber: formValue.houseNumber
        }
        // Budžetne stavke možeš dodati u CreateEventDTO ako model to podržava
      };

      // Ispis u konzolu
      console.log('Budget Items:');
      formValue.budgetItems.forEach((item: any, index: number) => {
        console.log(`Item ${index + 1}:`, item.category.name, item.amount);
      });

      this.eventService.add(event).subscribe({
        next: () => {
          this.snackBar.open('Event created successfully', 'OK', { duration: 3000 });
          this.router.navigate(['home']);
        },
        error: () => {
          this.snackBar.open('Error creating event', 'OK', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please fill in all required fields', 'OK', { duration: 3000 });
    }
  }
}
