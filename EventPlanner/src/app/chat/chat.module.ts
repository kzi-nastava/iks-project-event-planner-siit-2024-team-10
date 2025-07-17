import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './component/chat.component';
import { ChatService } from './service/chat.service';
import { FilterPipe } from './filter-pipe';
import { MatIcon } from '@angular/material/icon';

@NgModule({
  declarations: [
    ChatComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon
  ],
  exports: [
    ChatComponent
  ],
  providers: [ChatService]
})
export class ChatModule { }
