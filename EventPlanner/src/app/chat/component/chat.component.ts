import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
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
export class ChatComponent implements OnInit, AfterViewChecked {
  private serverUrl = 'http://localhost:8080/socket';
  private stompClient: any;
  form!: FormGroup;
  
  isLoaded: boolean = false;
  messages: Message[] = [];
  contacts: ChatContact[] = []; 
  
  loggedInUserId: number;
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

    if(this.loggedInUserId === undefined){
      this.loggedInUserId = this.authService.getAccountId();
    }
    console.log(this.loggedInUserId)
    console.log(this.selectedContactId)
    this.form = new FormGroup({
    message: new FormControl(null, [Validators.required])
    });

    this.initializeWebSocketConnection();
    this.loadContacts();
  }

  getSelectedContactName(): string {
    const selectedContact = this.contacts.find(contact => contact.user === this.selectedContactId);
    return selectedContact?.name || '';
  }

  loadContacts() {
    this.socketService.getContacts(this.loggedInUserId).subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        console.log(contacts)
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
    console.log(contact.user)
    this.selectedContactId = contact.user;
    this.loadMessages(this.loggedInUserId, contact.user);
  }

  isSentByCurrentUser(senderId: number): boolean {
    return senderId === this.loggedInUserId;
  }

  loadMessages(senderId: number, receiverId: number) {
    console.log(senderId,receiverId)
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
      const message: Message = {
        content: this.form.value.message,
        senderId: this.loggedInUserId,
        receiverId: this.selectedContactId,
        timestamp: new Date()
      };

      const createMessage: CreateMessage = {
        content: message.content,
        sender: message.senderId,
        receiver: message.receiverId
      };

      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
      this.form.reset();

      this.socketService.add(createMessage).subscribe({
        next: (response) => {
          console.log('Message sent successfully:', response);
        },
        error: (err) => {
          console.error('Error sending message:', err);
        }
      });
    }
  }

  initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    
    this.stompClient.connect({}, () => {
      this.isLoaded = true;
      this.openGlobalSocket();
    });
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
      // Only add message if it's part of the current conversation
      if (this.isPartOfCurrentConversation(messageResult)) {
        this.messages.push(messageResult);
        setTimeout(() => this.scrollToBottom(), 100);
      }
      // Refresh contacts list to update latest messages
      this.loadContacts();
    }
  }

  isPartOfCurrentConversation(message: Message): boolean {
    return (message.senderId === this.loggedInUserId && message.receiverId === this.selectedContactId) ||
           (message.senderId === this.selectedContactId && message.receiverId === this.loggedInUserId);
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