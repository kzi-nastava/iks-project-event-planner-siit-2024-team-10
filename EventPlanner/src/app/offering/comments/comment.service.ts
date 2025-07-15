import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../model/comment.model';
import { CreateCommentDTO } from '../model/create-comment-dto.model';
import { environment } from '../../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly baseUrl = `${environment.apiHost}`;

  constructor(private http: HttpClient) {}

  // Add a new comment
  add(comment: CreateCommentDTO, id:number): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl + '/offerings/' + id + '/comments', comment);
  }

  // Get comments for an offering
  getComments(offeringId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/offering/${offeringId}/comments`);
  }

  getPendingComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseUrl + '/offerings/comments/pending');
  }

  approve(commentId: number): Observable<void>{
    return this.http.get<void>(this.baseUrl + '/offerings/comments/' + commentId +'/approve');
  }

  // Delete a comment
  delete(commentId: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/offerings/comments/' + commentId);
  }

  // Update a comment
  update(commentId: number, comment: Partial<CreateCommentDTO>): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}/${commentId}`, comment);
  }
}