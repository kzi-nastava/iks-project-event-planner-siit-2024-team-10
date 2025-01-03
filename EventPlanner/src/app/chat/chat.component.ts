import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from './chat.service';
import { Message } from './message.model';

import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-socket',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private serverUrl = 'http://localhost:8080/socket';
  private stompClient: any;
  form!: FormGroup;

  isLoaded: boolean = false;
  messages: Message[] = [];

  // Assuming these IDs are passed via route state or can be retrieved from the authentication service
  loggedInUserId: number = 1; // Example logged-in user ID
  organizerId: number = 2; // Example organizer ID

  constructor(private socketService: ChatService) { }

  ngOnInit() {
    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required]),
    });

    this.initializeWebSocketConnection();
    this.loadMessages(this.loggedInUserId, this.organizerId);
  }

  loadMessages(senderId: number, receiverId: number) {
    this.socketService.getMessages(senderId, receiverId).subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      }
    });
  }

  // Function to open WebSocket connection
  initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    this.stompClient.connect({}, function () {
      that.isLoaded = true;
      that.openGlobalSocket();
    });
  }

  sendMessageUsingSocket() {
    if (this.form.valid) {
      let message: Message = {
        content: this.form.value.message,
        sender: this.loggedInUserId,
        receiver: this.organizerId,
        timestamp: new Date()
      };
  
      // Send the message to the server
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
  
      // Reset the input field after sending the message
      this.form.reset();
    }
  }
  

  openGlobalSocket() {
    if (this.isLoaded) {
      this.stompClient.subscribe("/socket-publisher", (message: { body: string; }) => {
        this.handleResult(message);
      });
    }
  }

  handleResult(message: { body: string; }) {
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      this.messages.push(messageResult);
    }
  }

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
