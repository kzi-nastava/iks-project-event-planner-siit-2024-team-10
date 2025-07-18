import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../env/environment';
import {LoginRequestDto} from './model/login-request-dto.model';
import {JwtHelperService} from '@auth0/angular-jwt';
import {LoginResponseDTO} from './model/login-response-dto.model';
import {RegisterDTO} from './model/register-dto.model';
import { SuspensionStatusDTO } from '../../suspension/model/suspension-status-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }  

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    skip: 'true',
  });

  user$ = new BehaviorSubject("");
  userState = this.user$.asObservable();

  constructor(private http: HttpClient) {
    this.user$.next(this.getRole());
  }

  login(auth: LoginRequestDto): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(environment.apiHost + '/auth/login', auth, {
      headers: this.headers,
    });
  }

  register(registerDTO:RegisterDTO, roleUpgrade:boolean): Observable<RegisterDTO> {
    let params=new HttpParams().set('roleUpgrade',roleUpgrade);
    return this.http.post<RegisterDTO>(environment.apiHost + '/auth/register', registerDTO, {
      headers: this.headers,
      params:params
    });
  }

  activate(token: string): Observable<string> {
    let params = new HttpParams().set('token', token);
    return this.http.put(environment.apiHost + '/auth/activate', null, { params: params, responseType: 'text' });
  }

  getRole(): any {
    if (this.isLoggedIn()) {
      const accessToken: any = localStorage.getItem('user');
      const helper = new JwtHelperService();
      return helper.decodeToken(accessToken).role;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') != null;
  }

  setUser(): void {
    this.user$.next(this.getRole());
  }

  getEmail() : string{
    const accessToken: any = localStorage.getItem('user');
    if(accessToken==null)
      return null;
    const helper = new JwtHelperService();
    return helper.decodeToken(accessToken).sub;
  }

  getAccountId() : number{
    const accessToken: any = localStorage.getItem('user');
    if(accessToken==null)
      return null;
    const helper = new JwtHelperService();
    return helper.decodeToken(accessToken).account_id;
  }

  getUserId() : number{
    const accessToken: any = localStorage.getItem('user');
    if(accessToken==null)
      return null;
    const helper = new JwtHelperService();
    return helper.decodeToken(accessToken).user_id;
  }

  getSuspensionStatus(accountId: number): Observable<SuspensionStatusDTO> {
  return this.http.get<SuspensionStatusDTO>(environment.apiHost+`/reports/${accountId}/suspension-status`)
}
}
