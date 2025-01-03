import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './component/chat.component';
import { ChatService } from './service/chat.service';

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ChatComponent
  ],
  providers: [ChatService]
})
export class ChatModule { }
