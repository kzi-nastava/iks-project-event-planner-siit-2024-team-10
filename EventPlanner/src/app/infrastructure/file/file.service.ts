import { Injectable } from '@angular/core';
import {environment} from '../../../env/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private uploadUrl = `${environment.apiHost}/upload`;

  constructor(private http: HttpClient) {}

  uploadPhotos(formData: FormData): Observable<any> {
    return this.http.post(this.uploadUrl, formData);
  }
}
