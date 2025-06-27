import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.css']
})
export class GuestListComponent implements OnInit {
  guestForm: FormGroup;
  eventId: number;
  maxParticipants: number;
  currentGuestList: string[] = [];
  showGuestForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));

    this.eventFormSetup();

    this.eventService.getEvent(this.eventId).subscribe({
      next: (event) => {
        this.maxParticipants = event.maxParticipants;

        this.eventService.getGuestList(this.eventId).subscribe({
          next: (guestList) => {
           this.currentGuestList = guestList?.guests ?? [];
          },
          error: () => {
            this.snackBar.open('Failed to load guest list.', 'OK', { duration: 3000 });
          }
        });
      },
      error: () => {
        this.snackBar.open('Failed to load event.', 'OK', { duration: 3000 });
        this.router.navigate(['/event',this.eventId]);
      }
    });
  }

  eventFormSetup(): void {
    this.guestForm = this.fb.group({
      guests: this.fb.array([this.createGuestField()])
    });
  }

  get guestControls(): FormArray {
    return this.guestForm.get('guests') as FormArray;
  }

  createGuestField(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  addGuest(): void {
    if (this.guestControls.length + this.currentGuestList.length >= this.maxParticipants) {
      this.snackBar.open(`You can invite up to ${this.maxParticipants} guests.`, 'OK', { duration: 3000 });
      return;
    }
    this.guestControls.push(this.createGuestField());
  }

  removeGuest(index: number): void {
    this.guestControls.removeAt(index);
  }

  onSubmit(): void {
    if (this.guestForm.valid) {
      const emails = this.guestForm.value.guests.map((g: any) => g.email);
      this.eventService.sendGuestInvites(this.eventId, emails).subscribe({
        next: () => {
          this.snackBar.open('Invitations sent!', 'OK', { duration: 3000 });
          this.router.navigate(['/event',this.eventId]);
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
