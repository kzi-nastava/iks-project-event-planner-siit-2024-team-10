import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../service/chat.service';
import { Message } from '../model/message.model';
import { CreateMessage } from '../model/create-message.model';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportFormComponent } from '../../suspension/report-form/report-form.component';
import { SuspensionService } from '../../suspension/suspension.service';
import { CreateAccountReportDTO } from '../../suspension/model/create-account-report-dto.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../layout/confirm-dialog/confirm-dialog.component';
import { AccountService } from '../../account/account.service';
import { Subscription } from 'rxjs';

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
  form!: FormGroup;
  
  // State
  isLoaded: boolean = false;
  messages: Message[] = [];
  contacts: ChatContact[] = []; 
  loggedInUserId!: number;
  selectedContactId: number | null = null;
  isChatterBlocked: boolean = false;
  chatterBlockedMsg: string = "";
  
  // Subscriptions
  private subscriptions: Subscription[] = [];
  private contactUpdateTimeout: any;
  
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private reportService: SuspensionService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeComponent();
    this.setupForm();
    this.setupSubscriptions();
    this.initializeChat();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private initializeComponent(): void {
    const state = history.state;
    this.loggedInUserId = state.loggedInUserId || this.authService.getAccountId();
    this.selectedContactId = state.organizerId;
  }

  private setupForm(): void {
    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required])
    });
  }

  private setupSubscriptions(): void {
    // Subscribe to connection status
    const connectionSub = this.chatService.isConnected$.subscribe(isConnected => {
      this.isLoaded = isConnected;
    });

    // Subscribe to incoming messages
    const messageSub = this.chatService.messages$.subscribe(message => {
      this.handleIncomingMessage(message);
    });

    // Subscribe to contacts updates
    const contactsSub = this.chatService.contacts$.subscribe(contacts => {
      this.contacts = contacts;
    });

    this.subscriptions.push(connectionSub, messageSub, contactsSub);
  }

  private async initializeChat(): Promise<void> {
    try {
      await this.chatService.initializeWebSocketConnection(this.loggedInUserId);
      this.loadContacts();
      
      if (this.selectedContactId) {
        this.loadMessages(this.loggedInUserId, this.selectedContactId);
      }
    } catch (error) {
    }
  }

  private handleIncomingMessage(message: Message): void {
    if (this.isPartOfCurrentConversation(message)) {
      const messageExists = this.chatService.isMessageDuplicate(message, this.messages);
      
      if (!messageExists) {
        this.messages.push(message);
        setTimeout(() => this.scrollToBottom(), 100);
      }
    }
    
    this.updateContactsDebounced();
  }

  private cleanup(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.chatService.disconnect();
    
    if (this.contactUpdateTimeout) {
      clearTimeout(this.contactUpdateTimeout);
    }
  }

  // UI Methods
  getSelectedContactName(): string {
    const selectedContact = this.contacts.find(contact => contact.user === this.selectedContactId);
    return selectedContact?.name || '';
  }

  loadContacts(): void {
    this.chatService.getContacts(this.loggedInUserId).subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.chatService.updateContacts(contacts);
        
        if (contacts.length > 0 && !this.selectedContactId) {
          this.selectContact(contacts[0]);
        }
      }
    });
  }

  selectContact(contact: ChatContact): void {
    this.selectedContactId = contact.user;
    this.loadMessages(this.loggedInUserId, contact.user);
  }

  loadMessages(senderId: number, receiverId: number): void {
    this.checkBlockedStatus(senderId, receiverId);
    
    this.chatService.getMessages(senderId, receiverId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.chatService.updateMessages(messages);
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  sendMessageUsingSocket(): void {
    if (!this.form.valid || !this.selectedContactId) {
      return;
    }

    const messageContent = this.form.value.message;
    const createMessage: CreateMessage = {
      content: messageContent,
      sender: this.loggedInUserId,
      receiver: this.selectedContactId
    };

    // Send via WebSocket
    this.chatService.sendMessageViaSocket(this.loggedInUserId, this.selectedContactId, messageContent);

    // Add to local UI immediately
    const localMessage: Message = {
      content: messageContent,
      senderId: this.loggedInUserId,
      receiverId: this.selectedContactId,
      timestamp: new Date()
    };
    
    this.messages.push(localMessage);
    this.chatService.addMessage(localMessage);
    setTimeout(() => this.scrollToBottom(), 100);

    // Reset form
    this.form.reset();

    // Send via REST API for persistence
    this.chatService.sendMessage(createMessage).subscribe({
      next: (response) => {
        // Message sent successfully
      },
      error: (err) => {
        this.snackBar.open('Failed to send message. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  // Helper Methods
  isSentByCurrentUser(senderId: number): boolean {
    return senderId === this.loggedInUserId;
  }

  private isPartOfCurrentConversation(message: Message): boolean {
    return (message.senderId === this.loggedInUserId && message.receiverId === this.selectedContactId) ||
           (message.senderId === this.selectedContactId && message.receiverId === this.loggedInUserId);
  }

  private updateContactsDebounced(): void {
    if (this.contactUpdateTimeout) {
      clearTimeout(this.contactUpdateTimeout);
    }
    this.contactUpdateTimeout = setTimeout(() => {
      this.loadContacts();
    }, 1000);
  }

  ngAfterViewChecked(): void {
    if (this.messages.length > 0 && this.myScrollContainer) {
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer?.nativeElement) {
        this.myScrollContainer.nativeElement.scrollTop = 
          this.myScrollContainer.nativeElement.scrollHeight;
      }
    }catch(err) { 
    } 
  }

  // Report & Block Methods (keep in component as they're UI-specific)
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
      data: { message: dialogMsg }
    }).afterClosed().subscribe(result => {
      if (result) {
        const operation = isCurrentlyBlockedByYou 
          ? this.accountService.unblockAccount(accountId)
          : this.accountService.blockAccount(accountId);

        operation.subscribe({
          next: () => {
            const successMsg = isCurrentlyBlockedByYou ? 'User unblocked successfully.' : 'User blocked successfully.';
            this.snackBar.open(successMsg, 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            
            if (this.loggedInUserId && this.selectedContactId) {
              this.checkBlockedStatus(this.loggedInUserId, this.selectedContactId);
            }
          },
          error: (err) => {
            const errorMsg = err?.error ?? `Failed to ${isCurrentlyBlockedByYou ? 'unblock' : 'block'} user.`;
            this.snackBar.open(errorMsg, 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    });
  }

  private checkBlockedStatus(senderId: number, receiverId: number): void {
    Promise.all([
      this.accountService.isAccountBlocked(senderId, receiverId).toPromise(),
      this.accountService.isAccountBlocked(receiverId, senderId).toPromise()
    ]).then(([youBlocked, theyBlocked]) => {
      if (youBlocked?.blocked) {
        this.chatterBlockedMsg = "You have blocked this user";
        this.isChatterBlocked = true;
      } else if (theyBlocked?.blocked) {
        this.chatterBlockedMsg = "You have been blocked by this user";
        this.isChatterBlocked = true;
      } else {
        this.chatterBlockedMsg = "";
        this.isChatterBlocked = false;
      }
    }).catch(err => {
      this.chatterBlockedMsg = "";
      this.isChatterBlocked = false;
    });
  }
}