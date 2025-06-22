import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
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
import { BudgetItem } from '../model/budget-item.model';

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

  constructor(
    private eventTypeService: EventTypeService,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      eventType: [''],
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
      budgetItems: this.fb.array([this.createBudgetItemGroup()])
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
  }

  get budgetItemsFormArray(): FormArray {
    return this.createForm.get('budgetItems') as FormArray;
  }

  createBudgetItemGroup(): FormGroup {
    return this.fb.group({
      category: [null],
      amount: [null]
    });
  }

  getAvailableCategories(index: number): Category[] {
    const selectedCategories = this.budgetItemsFormArray.controls
      .map((group, i) => i !== index ? group.get('category')?.value : null)
      .filter((val): val is Category => !!val);

    const allCategories = this.allEventTypes.flatMap(et => et.recommendedCategories || []);

    return allCategories.filter((cat, i, self) =>
      !selectedCategories.some(selected => selected.id === cat.id) &&
      i === self.findIndex(c => c.id === cat.id)
    );
  }

  onBudgetItemKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter') {
      event.preventDefault();

      const group = this.budgetItemsFormArray.at(index);
      const category = group.get('category')?.value;
      const amount = group.get('amount')?.value;

      if (category && amount) {
        const item: BudgetItem = {
          id: 0,
          amount: +amount,
          isDeleted: false,
          category,
          offerings: []
        };
        console.log('Added BudgetItem:', item);

        const isLast = index === this.budgetItemsFormArray.length - 1;
        const nextEmptyExists = this.budgetItemsFormArray.controls.some((g, i) =>
          i !== index && !g.get('category')?.value
        );

        if (isLast && !nextEmptyExists) {
          this.budgetItemsFormArray.push(this.createBudgetItemGroup());
        }
      }
    }
  }

  save(): void {
    if (this.createForm.valid) {
      const formValue = this.createForm.value;

      const event: CreateEventDTO = {
        eventTypeId: formValue.noEventType ? null : formValue.eventType?.id,
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
      };

      console.log('Budget Items:');
      formValue.budgetItems.forEach((item: any, index: number) => {
        if (item.category && item.amount) {
          const budgetItem: BudgetItem = {
            id: 0,
            amount: +item.amount,
            isDeleted: false,
            category: item.category,
            offerings: []
          };
          console.log(`Item ${index + 1}:`, budgetItem);
        }
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
