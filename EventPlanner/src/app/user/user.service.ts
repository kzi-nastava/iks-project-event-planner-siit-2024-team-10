import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Event} from '../event/model/event.model';
import {environment} from '../../env/environment';
import {GetUserDTO} from './model/get-user-dto.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getUser(accountId:number): Observable<GetUserDTO> {
    return this.httpClient.get<GetUserDTO>(environment.apiHost+'/users/'+accountId);
  }
}
