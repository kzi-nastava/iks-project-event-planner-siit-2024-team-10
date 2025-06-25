import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.css'
})
export class GuestListComponent implements OnInit {
  guestForm: FormGroup;
  eventId: number;
  maxParticipants: number;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));

  this.eventService.getEvent(this.eventId).subscribe({
    next: (event) => {
      this.maxParticipants = event.maxParticipants;

      this.guestForm = this.fb.group({
        guests: this.fb.array([this.createGuestField()])
      });
    },
    error: () => {
      this.snackBar.open('Failed to load event.', 'OK', { duration: 3000 });
      this.router.navigate(['/home']);
    }
  });
}

  get guests(): FormArray {
    return this.guestForm.get('guests') as FormArray;
  }

  createGuestField(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  addGuest(): void {
  if (this.guests.length >= this.maxParticipants) {
    this.snackBar.open(`You can invite up to ${this.maxParticipants} guests.`, 'OK', { duration: 3000 });
    return;
  }
  this.guests.push(this.createGuestField());
}

  removeGuest(index: number): void {
    this.guests.removeAt(index);
  }

  onSubmit(): void {
    if (this.guestForm.valid) {
      const emails = this.guestForm.value.guests.map((g: any) => g.email);
      this.eventService.sendGuestInvites(this.eventId, emails).subscribe({
        next: () => {
          this.snackBar.open('Invitations sent!', 'OK', { duration: 3000 });
          this.router.navigate(['/home']);
        },
        error: () => {
          this.snackBar.open('Failed to send invitations.', 'OK', { duration: 3000 });
        }
      });
    } else {
      this.guestForm.markAllAsTouched();
    }
  }
}
