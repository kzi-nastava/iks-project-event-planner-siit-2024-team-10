import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.css'
})
export class GuestListComponent implements OnInit {
  guestForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.guestForm = this.fb.group({
      guests: this.fb.array([this.createGuestField()])
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
    this.guests.push(this.createGuestField());
  }

  removeGuest(index: number): void {
    this.guests.removeAt(index);
  }

  onSubmit(): void {
    if (this.guestForm.valid) {
      const emails = this.guestForm.value.guests.map((g: any) => g.email);
      console.log('Submitted guest emails:', emails);
      // TODO: Send emails to backend or proceed to next step
    } else {
      this.guestForm.markAllAsTouched();
    }
  }
}
