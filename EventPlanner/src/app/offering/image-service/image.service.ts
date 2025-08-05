import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}

  uploadFiles(files: FileList): Observable<string[]> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    return this.http.post<string[]>(`${environment.apiHost}/upload`, formData);
  }

  getImageUrls(filenames: string[]): string[] {
    return filenames.map(name => `${environment.apiHost}/images/${name}`);
  }
  

  getImageUrl(name: string | undefined | null): string {
    if (!name) {
      return `${environment.apiHost}/images/placeholder-image.png`;
    }
    return `${environment.apiHost}/images/${name}`;
  }
}
