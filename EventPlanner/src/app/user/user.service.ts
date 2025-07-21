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
import {UpdateProfilePhotoDTO} from './model/update-profile-photo-dto.model';
import {UpdatedProfilePhotoDTO} from './model/updated-profile-photo-dto.model';
import {UpdateCompanyPhotosDTO} from './model/update-company-photos-dto.model';
import {UpdatedCompanyPhotosDTO} from './model/updated-company-photos-dto.model';

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

  updateProfilePhoto(accountId:number, updateProfilePhotoDTO:UpdateProfilePhotoDTO):Observable<UpdatedProfilePhotoDTO> {
    return this.httpClient.put<UpdatedProfilePhotoDTO>(environment.apiHost+'/users/'+accountId+'/profile-photo', updateProfilePhotoDTO);
  }

  updateCompany(accountId:number, updateCompanyDTO:UpdateCompanyDTO):Observable<UpdatedCompanyDTO> {
    return this.httpClient.put<UpdatedCompanyDTO>(environment.apiHost+'/users/'+accountId+'/company', updateCompanyDTO);
  }

  updateCompanyPhotos(accountId:number, updateCompanyPhotosDTO:UpdateCompanyPhotosDTO):Observable<UpdatedCompanyPhotosDTO> {
    return this.httpClient.put<UpdatedCompanyPhotosDTO>(environment.apiHost+'/users/'+accountId+'/company/photos', updateCompanyPhotosDTO);
  }

  changePassword(accountId:number, changePasswordDto:ChangePasswordDto):Observable<void> {
    return this.httpClient.put<void>(environment.apiHost+'/users/'+accountId+'/password', changePasswordDto);
  }

  deactivateAccount(accountId:number):Observable<void>{
    return this.httpClient.put<void>(environment.apiHost+'/users/'+accountId+'/deactivate',null);
  }
}
