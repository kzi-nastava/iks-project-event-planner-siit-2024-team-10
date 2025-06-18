import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Event} from '../event/model/event.model';
import {environment} from '../../env/environment';
import {GetUserDTO} from './model/get-user-dto.model';
import {HttpClient} from '@angular/common/http';
import {UpdateUserDTO} from './model/update-user-dto.model';
import {UpdatedUSerDTO} from './model/updated-user-dto.model';
import {UpdateCompanyDTO} from './model/update-company-dto.model';
import {UpdatedCompanyDTO} from './model/updated-company-dto.model';
import {ChangePasswordDto} from './model/change-password-dto.model';

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

  updateCompany(accountId:number, updateCompanyDTO:UpdateCompanyDTO):Observable<UpdatedCompanyDTO> {
    return this.httpClient.put<UpdatedCompanyDTO>(environment.apiHost+'/users/'+accountId+'/company', updateCompanyDTO);
  }

  changePassword(accountId:number, changePasswordDto:ChangePasswordDto):Observable<void> {
    return this.httpClient.put<void>(environment.apiHost+'/users/'+accountId+'/password', changePasswordDto);
  }

  deactivateAccount(accountId:number):Observable<void>{
    return this.httpClient.put<void>(environment.apiHost+'/users/'+accountId+'/deactivate',null);
  }
}
