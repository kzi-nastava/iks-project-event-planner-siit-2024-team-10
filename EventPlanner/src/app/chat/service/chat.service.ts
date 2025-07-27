import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env/environment';
import { Message } from '../model/message.model';
import { map, Observable } from 'rxjs';
import { CreateMessage } from '../model/create-message.model';
import { ChatContact } from '../component/chat.component';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url: string = environment.apiHost + 'api/socket';
  restUrl: string = environment.apiHost + 'sendMessageRest';

  constructor(private http: HttpClient) {}

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

  getMessages(senderId: number, receiverId: number): Observable<Message[]> {
    return this.http.get<Message[]>(environment.apiHost + `/messages/`+ senderId + "/"+ receiverId);
  }
  add(message:CreateMessage) : Observable<Message> {
    return this.http.post<Message>(environment.apiHost + "/messages", message);
  }
  getContacts(userId: number): Observable<ChatContact[]> {
    return this.http.get<ChatContact[]>(environment.apiHost + `/messages/${userId}`);
  }
}
