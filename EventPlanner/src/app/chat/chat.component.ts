import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  @Input() loggedInUserId: number;
  @Input() organizerId: number;

  constructor() { }

  ngOnInit(): void {
    console.log(`Logged in user ID: ${this.loggedInUserId}`);
    console.log(`Event organizer ID: ${this.organizerId}`);
  }
}
