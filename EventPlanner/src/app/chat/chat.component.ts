import { Component, Input, OnInit } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';
interface Message {
  id?: number;
  content: string;
  timestamp: Date;
  sender: number;
  receiver: number;
  isRead: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit {
  @Input() loggedInUserId: number;
  @Input() organizerId: number;
  
  private socket: WebSocketSubject<any>;
  messages: Message[] = [];
  newMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadExistingMessages();
    this.connectWebSocket();
  }

  private connectWebSocket() {
    this.socket = webSocket('ws://localhost:8080/chat');
    
    this.socket.subscribe(
      (message) => {
        if (message.sender === this.organizerId || message.sender === this.loggedInUserId) {
          this.messages.push(message);
        }
      },
      (error) => console.error('WebSocket error:', error),
      () => console.log('WebSocket connection closed')
    );
  }

  private loadExistingMessages() {
    this.http.get<Message[]>(`http://localhost:8080/api/messages/${this.loggedInUserId}/${this.organizerId}`)
      .subscribe(messages => {
        this.messages = messages;
      });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message: Message = {
        content: this.newMessage,
        timestamp: new Date(),
        sender: this.loggedInUserId,
        receiver: this.organizerId,
        isRead: false
      };

      this.socket.next(message);
      this.newMessage = '';
    }
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.complete();
    }
  }
}