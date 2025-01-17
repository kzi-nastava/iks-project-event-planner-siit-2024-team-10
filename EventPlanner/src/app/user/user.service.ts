import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Event} from '../event/model/event.model';
import {environment} from '../../env/environment';
import {GetUserDTO} from './model/get-user-dto.model';
import {HttpClient} from '@angular/common/http';
import {UpdateUserDTO} from './model/update-user-dto.model';
import {UpdatedUSerDTO} from './model/updated-user-dto.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getUser(accountId:number): Observable<GetUserDTO> {
    return this.httpClient.get<GetUserDTO>(environment.apiHost+'/users/'+accountId);
  }

  updateUser(accountId:number, updateUserDTO:UpdateUserDTO):Observable<UpdatedUSerDTO> {
    return this.httpClient.put<UpdatedUSerDTO>(environment.apiHost+'/users/'+accountId, updateUserDTO);
  }
}
