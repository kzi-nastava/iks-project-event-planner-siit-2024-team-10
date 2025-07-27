import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../service/chat.service';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../model/message.model';
import { ActivatedRoute } from '@angular/router';
import { CreateMessage } from '../model/create-message.model';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportFormComponent } from '../../suspension/report-form/report-form.component';
import { SuspensionService } from '../../suspension/suspension.service';
import { CreateAccountReportDTO } from '../../suspension/model/create-account-report-dto.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../layout/confirm-dialog/confirm-dialog.component';
import { AccountService } from '../../account/account.service';
import { firstValueFrom } from 'rxjs';

export interface ChatContact {
  user: number;
  name: string;
  content?: string;
  timestamp?: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  private serverUrl = 'http://localhost:8080/socket';
  private stompClient: any;
  form!: FormGroup;
  
  isLoaded: boolean = false;
  messages: Message[] = [];
  contacts: ChatContact[] = []; 
  
  loggedInUserId!: number;
  selectedContactId: number | null = null;

  isChatterBlocked: boolean = false;
  chatterBlockedMsg: string = "";
  
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(
    private socketService: ChatService,
    private authService: AuthService,
    private reportService: SuspensionService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const state = history.state;
    this.loggedInUserId = state.loggedInUserId;
    this.selectedContactId = state.organizerId;
    this.loadMessages(this.loggedInUserId, this.selectedContactId);

    if (this.loggedInUserId === undefined) {
      this.loggedInUserId = this.authService.getAccountId();
    }
    console.log(this.loggedInUserId)
    console.log(this.selectedContactId)
    this.form = new FormGroup({
    message: new FormControl(null, [Validators.required])
    });

    this.initializeWebSocketConnection();
    this.loadContacts();

    if (this.selectedContactId) {
      this.loadMessages(this.loggedInUserId, this.selectedContactId);
    }
  }

  ngOnDestroy() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect();
    }
  }

  getSelectedContactName(): string {
    const selectedContact = this.contacts.find(contact => contact.user === this.selectedContactId);
    return selectedContact?.name || '';
  }

  loadContacts() {
    this.socketService.getContacts(this.loggedInUserId).subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        if (contacts.length > 0 && !this.selectedContactId) {
          this.selectContact(contacts[0]);
        }
      },
      error: (err) => {
        console.error('Error loading contacts:', err);
      }
    });
  }

  selectContact(contact: ChatContact) {
    this.selectedContactId = contact.user;
    this.loadMessages(this.loggedInUserId, contact.user);
  }

  isSentByCurrentUser(senderId: number): boolean {
    return senderId === this.loggedInUserId;
  }

  loadMessages(senderId: number, receiverId: number) {
    this.checkBlockedStatus(senderId, receiverId);
    this.socketService.getMessages(senderId, receiverId).subscribe({
      next: (messages) => {
        this.messages = messages;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      }
    });
  }

  sendMessageUsingSocket() {
    if (this.form.valid && this.selectedContactId) {
      const messageContent = this.form.value.message;

      const socketMessage = {
        fromId: this.loggedInUserId,
        toId: this.selectedContactId,
        message: messageContent,
        timestamp: new Date().toISOString()
      };

      const createMessage: CreateMessage = {
        content: messageContent,
        sender: this.loggedInUserId,
        receiver: this.selectedContactId
      };

      // Slanje preko WebSocket-a
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(socketMessage));
      }

      // Odmah prikaži poruku u UI
      const localMessage: Message = {
        content: messageContent,
        senderId: this.loggedInUserId,
        receiverId: this.selectedContactId,
        timestamp: new Date()
      };
      this.messages.push(localMessage);
      setTimeout(() => this.scrollToBottom(), 100);

      // Resetuj formu
      this.form.reset();

      // REST API poziv
      this.socketService.add(createMessage).subscribe({
        next: (response) => {
          console.log('Message saved to database:', response);
        },
        error: (err) => {
          console.error('Error saving message to database:', err);
          this.snackBar.open('Failed to send message. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  }

  initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);

    this.stompClient.debug = (str: string) => {
      console.log('STOMP Debug:', str);
    };
    
    this.stompClient.connect({}, 
      () => {
        console.log('WebSocket connected successfully');
        this.isLoaded = true;
        this.subscribeToUserMessages();
      },
      (error: any) => {
        console.error('WebSocket connection error:', error);
        this.isLoaded = false;
        setTimeout(() => {
          console.log('Retrying WebSocket connection...');
          this.initializeWebSocketConnection();
        }, 5000);
      }
    );
  }

  subscribeToUserMessages() {
    if (this.isLoaded && this.stompClient.connected) {
      const userTopic = `/socket-publisher/${this.loggedInUserId}`;
      this.stompClient.subscribe(userTopic, (message: { body: string }) => {
        console.log(message);
        this.handleResult(message);
      });
    }
  }

  handleResult(message: { body: string }) {
    if (message.body) {
      try {
        const messageData = JSON.parse(message.body);

        const messageResult: Message = {
          content: messageData.message || messageData.content,
          senderId: messageData.fromId || messageData.senderId,
          receiverId: messageData.toId || messageData.receiverId,
          timestamp: messageData.timestamp ? new Date(messageData.timestamp) : new Date()
        };

        if (this.isPartOfCurrentConversation(messageResult)) {
          const messageExists = this.messages.some(msg => 
            msg.content === messageResult.content &&
            msg.senderId === messageResult.senderId &&
            msg.receiverId === messageResult.receiverId &&
            Math.abs(new Date(msg.timestamp).getTime() - messageResult.timestamp.getTime()) < 1000
          );

          if (!messageExists) {
            this.messages.push(messageResult);
            setTimeout(() => this.scrollToBottom(), 100);
          }
        }

        this.updateContactsDebounced();
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }

  private contactUpdateTimeout: any;
  updateContactsDebounced() {
    if (this.contactUpdateTimeout) {
      clearTimeout(this.contactUpdateTimeout);
    }
    this.contactUpdateTimeout = setTimeout(() => {
      this.loadContacts();
    }, 1000);
  }

  isPartOfCurrentConversation(message: Message): boolean {
    return (message.senderId === this.loggedInUserId && message.receiverId === this.selectedContactId) ||
           (message.senderId === this.selectedContactId && message.receiverId === this.loggedInUserId);
  }

  ngAfterViewChecked() {
    if (this.messages.length > 0 && this.myScrollContainer) {
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer && this.myScrollContainer.nativeElement) {
        this.myScrollContainer.nativeElement.scrollTop = 
          this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  reportAccount(accountId: number): void {
  this.dialog.open(ReportFormComponent, {
    data: {
      reporterId: this.loggedInUserId,
      reporteeId: accountId
    }
  }).afterClosed().subscribe((result: CreateAccountReportDTO) => {
    if (result) {
      this.reportService.sendReport(result).subscribe({
        next: () => {
          this.snackBar.open('User reported successfully.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
        error: (err) => {
          const errorMsg = err?.error ?? 'Failed to report user.';
          this.snackBar.open(errorMsg, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  });
}

blockAccount(accountId: number): void {
  // Prevent blocking back if the user has already been blocked
  if (this.chatterBlockedMsg === "You have been blocked by this user") {
    this.snackBar.open('You cannot block a user who has already blocked you.', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    return;
  }

  const isCurrentlyBlockedByYou = this.chatterBlockedMsg === "You have blocked this user";
  const dialogMsg = isCurrentlyBlockedByYou
    ? "Are you sure you want to unblock this account?"
    : "Are you sure you want to block this account?";

  this.dialog.open(ConfirmDialogComponent, {
    data: {
      message: dialogMsg
    }
  }).afterClosed().subscribe(result => {
    if (result) {
      if (isCurrentlyBlockedByYou) {
        // Unblock flow
        this.accountService.unblockAccount(accountId).subscribe({
          next: () => {
            this.snackBar.open('User unblocked successfully.', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            if (this.loggedInUserId && this.selectedContactId) {
              this.checkBlockedStatus(this.loggedInUserId, this.selectedContactId);
            }
          },
          error: (err) => {
            const errorMsg = err?.error ?? 'Failed to unblock user.';
            this.snackBar.open(errorMsg, 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      } else {
        // Block flow
        this.accountService.blockAccount(accountId).subscribe({
          next: () => {
            this.snackBar.open('User blocked successfully.', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            if (this.loggedInUserId && this.selectedContactId) {
              this.checkBlockedStatus(this.loggedInUserId, this.selectedContactId);
            }
          },
          error: (err) => {
            const errorMsg = err?.error ?? 'Failed to block user.';
            this.snackBar.open(errorMsg, 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    }
  });
}

  checkBlockedStatus(senderId: number, receiverId: number): void {
  const blockedByYou$ = this.accountService.isAccountBlocked(senderId, receiverId);
  const blockedByOther$ = this.accountService.isAccountBlocked(receiverId, senderId);

  Promise.all([
    firstValueFrom(blockedByYou$),
    firstValueFrom(blockedByOther$)
  ]).then(([youBlocked, theyBlocked]) => {
    if (youBlocked.blocked) {
      this.chatterBlockedMsg = "You have blocked this user";
      this.isChatterBlocked = true;
    } else if (theyBlocked.blocked) {
      this.chatterBlockedMsg = "You have been blocked by this user";
      this.isChatterBlocked = true;
    } else {
      this.chatterBlockedMsg = "";
      this.isChatterBlocked = false;
    }
  }).catch(err => {
    console.error('Error checking blocked status:', err);
    this.chatterBlockedMsg = "";
    this.isChatterBlocked = false;
  });
}

}