import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../env/environment';
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

  private serverUrl = 'http://localhost:8080/socket' 
  private stompClient: any;
  form!: FormGroup;
  userForm!: FormGroup;

  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  messages: Message[] = [];

  constructor(private socketService: ChatService) { }

  ngOnInit() {
    const state = window.history.state;
    const sender = state.loggedInUserId;
    const recipient = state.organizerId;
    console.log('Sender ID:', sender);
    console.log('Recipient ID:', recipient);

    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required]),
      toId: new FormControl(null)
    })

    this.userForm = new FormGroup({
      fromId: new FormControl(null, [Validators.required])
    })

    this.initializeWebSocketConnection();
  }

  // Funkcija za otvaranje konekcije sa serverom
  initializeWebSocketConnection() {
    // serverUrl je vrednost koju smo definisali u registerStompEndpoints() metodi na serveru
    console.log(this.serverUrl)
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    console.log(this.stompClient)
    let that = this;

    this.stompClient.connect({}, function () {
      that.isLoaded = true;
      that.openGlobalSocket()
    });
    console.log("prosao")
  }

  
  // Funkcija salje poruku na WebSockets endpoint na serveru
  sendMessageUsingSocket() {
    if (this.form.valid) {
      let message: Message = {
        content: this.form.value.message,
        sender: this.userForm.value.fromId,
        receiver: this.form.value.toId,
        timestamp: new Date(),
        isRead:false
      };

      // Primer slanja poruke preko web socketa sa klijenta. URL je 
      //  - ApplicationDestinationPrefix definisan u config klasi na serveru (configureMessageBroker() metoda) : /socket-subscriber
      //  - vrednost @MessageMapping anotacije iz kontrolera na serveru : /send/message
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
    }
  }

  // Funckija salje poruku na REST endpoint na serveru
  sendMessageUsingRest() {
    if (this.form.valid) {
      let message: Message = {
        content: this.form.value.message,
        sender: this.userForm.value.fromId,
        receiver: this.form.value.toId,
        timestamp: new Date(),
        isRead:false
      };

      this.socketService.postRest(message).subscribe(res => {
        console.log(res);
      })
    }
  }

  // Funckija za pretplatu na topic /socket-publisher (definise se u configureMessageBroker() metodi)
  // Globalni socket se otvara prilikom inicijalizacije klijentske aplikacije
  openGlobalSocket() {
    console.log(this.isLoaded)
    if (this.isLoaded) {
      this.stompClient.subscribe("/socket-publisher", (message: { body: string; }) => {
        console.log(message)
        this.handleResult(message);
      });
    }
  }

  // Funkcija za pretplatu na topic /socket-publisher/user-id
  // CustomSocket se otvara kada korisnik unese svoj ID u polje 'fromId' u submit callback-u forme 'userForm'
  openSocket() {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe("/socket-publisher/" + this.userForm.value.fromId, (message: { body: string; }) => {
        this.handleResult(message);
      });
    }
  }

  // Funkcija koja se poziva kada server posalje poruku na topic na koji se klijent pretplatio
  handleResult(message: { body: string; }) {
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      this.messages.push(messageResult);
    }
  }

}
