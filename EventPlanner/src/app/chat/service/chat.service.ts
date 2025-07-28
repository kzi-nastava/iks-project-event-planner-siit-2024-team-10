import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env/environment';
import { Message } from '../model/message.model';
import { map, Observable, BehaviorSubject, Subject } from 'rxjs';
import { CreateMessage } from '../model/create-message.model';
import { ChatContact } from '../component/chat.component';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private url: string = environment.apiHost + 'api/socket';
  private restUrl: string = environment.apiHost + 'sendMessageRest';
  private serverUrl = 'http://localhost:8080/socket';
  
  // WebSocket related
  private stompClient: any;
  private isConnected = new BehaviorSubject<boolean>(false);
  private messageSubject = new Subject<Message>();
  
  // State management
  private contacts = new BehaviorSubject<ChatContact[]>([]);
  private messages = new BehaviorSubject<Message[]>([]);

  constructor(private http: HttpClient) {}

  // Observables for components to subscribe to
  get isConnected$() { return this.isConnected.asObservable(); }
  get messages$() { return this.messageSubject.asObservable(); }
  get contacts$() { return this.contacts.asObservable(); }
  get messagesState$() { return this.messages.asObservable(); }

  // Initialize WebSocket connection
  initializeWebSocketConnection(userId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      
      this.stompClient.debug = (str: string) => {
        // Silent debug
      };
      
      this.stompClient.connect({}, 
        () => {
          this.isConnected.next(true);
          this.subscribeToUserMessages(userId);
          resolve(true);
        },
        (error: any) => {
          this.isConnected.next(false);
          reject(error);
          // Auto-reconnect after 5 seconds
          setTimeout(() => {
            this.initializeWebSocketConnection(userId);
          }, 5000);
        }
      );
    });
  }

  // Subscribe to user-specific messages
  private subscribeToUserMessages(userId: number): void {
    if (this.stompClient?.connected) {
      const userTopic = `/socket-publisher/${userId}`;
      this.stompClient.subscribe(userTopic, (message: { body: string }) => {
        this.handleIncomingMessage(message);
      });
    }
  }

  // Handle incoming WebSocket messages
  private handleIncomingMessage(message: { body: string }): void {
    if (message.body) {
      try {
        const messageData = JSON.parse(message.body);
        const messageResult: Message = {
          content: messageData.message || messageData.content,
          senderId: messageData.fromId || messageData.senderId,
          receiverId: messageData.toId || messageData.receiverId,
          timestamp: messageData.timestamp ? new Date(messageData.timestamp) : new Date()
        };
        
        this.messageSubject.next(messageResult);
      } catch (error) {
        console.error('Error parsing incoming message:', error);
      }
    }
  }

  // Send message via WebSocket
  sendMessageViaSocket(fromId: number, toId: number, content: string): void {
    if (this.stompClient?.connected) {
      const socketMessage = {
        fromId,
        toId,
        message: content,
        timestamp: new Date().toISOString()
      };
      
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(socketMessage));
    }
  }

  // REST API methods
  getMessages(senderId: number, receiverId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiHost}/messages/${senderId}/${receiverId}`);
  }

  sendMessage(message: CreateMessage): Observable<Message> {
    return this.http.post<Message>(`${environment.apiHost}/messages`, message);
  }

  getContacts(userId: number): Observable<ChatContact[]> {
    return this.http.get<ChatContact[]>(`${environment.apiHost}/messages/${userId}`);
  }

  // Update contacts state
  updateContacts(contacts: ChatContact[]): void {
    this.contacts.next(contacts);
  }

  // Update messages state
  updateMessages(messages: Message[]): void {
    this.messages.next(messages);
  }

  // Add message to current state
  addMessage(message: Message): void {
    const currentMessages = this.messages.value;
    this.messages.next([...currentMessages, message]);
  }

  // Check if message is duplicate
  isMessageDuplicate(newMessage: Message, existingMessages: Message[]): boolean {
    return existingMessages.some(msg => 
      msg.content === newMessage.content &&
      msg.senderId === newMessage.senderId &&
      msg.receiverId === newMessage.receiverId &&
      Math.abs(new Date(msg.timestamp).getTime() - newMessage.timestamp.getTime()) < 1000
    );
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.stompClient?.connected) {
      this.stompClient.disconnect();
      this.isConnected.next(false);
    }
  }

  // Legacy methods (keep for backward compatibility)
  post(data: Message) {
    return this.http.post<Message>(this.url, data).pipe(
      map((data: Message) => {
        return data;
      })
    );
  }

  postRest(data: Message) {
    return this.http.post<Message>(this.restUrl, data).pipe(
      map((data: Message) => {
        return data;
      })
    );
  }

  add(message: CreateMessage): Observable<Message> {
    return this.http.post<Message>(`${environment.apiHost}/messages`, message);
  }
}