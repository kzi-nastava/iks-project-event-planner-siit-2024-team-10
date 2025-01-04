import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Comment } from '../model/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comments: Comment[];

  constructor(){
  }

  addComment(comment: Omit<Comment, 'id'>): Observable<Comment> {
    return null;
  }
}