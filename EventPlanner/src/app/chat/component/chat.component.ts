import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../service/chat.service';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../model/message.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private serverUrl = 'http://localhost:8080/socket';
  private stompClient: any;
  form!: FormGroup;
  
  isLoaded: boolean = false;
  messages: Message[] = [];
  
  loggedInUserId: number;
  organizerId: number;
  
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(
    private socketService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const state = history.state;
    this.loggedInUserId = state.loggedInUserId;
    this.organizerId = state.organizerId;

    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required])
    });

    this.initializeWebSocketConnection();
    this.loadMessages(this.loggedInUserId, this.organizerId);
  }

  isSentByCurrentUser(senderId: number): boolean {
    console.log(senderId === this.loggedInUserId)
    console.log(senderId)
    console.log(this.loggedInUserId)
    return senderId === this.loggedInUserId;
  }

  loadMessages(senderId: number, receiverId: number) {
    this.socketService.getMessages(senderId, receiverId).subscribe({
      next: (messages) => {
        this.messages = messages.map(message => ({
          ...message,
          sender: message.senderId
        }));
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      }
    });
  }

  initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    
    this.stompClient.connect({}, () => {
      this.isLoaded = true;
      this.openGlobalSocket();
    });
  }

  sendMessageUsingSocket() {
    if (this.form.valid) {
      const message: Message = {
        content: this.form.value.message,
        senderId: this.loggedInUserId,
        receiverId: this.organizerId,
        timestamp: new Date()
      };

      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
      this.form.reset();
    }
  }

  openGlobalSocket() {
    if (this.isLoaded) {
      this.stompClient.subscribe("/socket-publisher", (message: { body: string }) => {
        this.handleResult(message);
      });
    }
  }

  handleResult(message: { body: string }) {
    if (message.body) {
      const messageResult: Message = JSON.parse(message.body);
      this.messages.push(messageResult);
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = 
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }
}