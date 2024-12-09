import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Comment {
  id: number;
  offeringId: number;
  userName: string;
  rating: number;
  text: string;
  date: Date;
}

const COMMENTS: Comment[] = [
  {
    id: 1,
    offeringId: 1,
    userName: 'Sarah Johnson',
    rating: 5,
    text: 'Amazing service! Very professional setup.',
    date: new Date('2024-02-15')
  },
  {
    id: 2,
    offeringId: 1,
    userName: 'Emma Wilson',
    rating: 4,
    text: 'Great experience overall.',
    date: new Date('2024-02-10')
  }
];

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comments: Comment[] = COMMENTS;

  constructor(){
    for(let commentObj of COMMENTS){
      const comment: Comment = {
        id:commentObj.id,
        offeringId:commentObj.offeringId,
        userName:commentObj.userName,
        rating:commentObj.rating,
        text:commentObj.text,
        date:commentObj.date
      }
    }
  }

  getCommentsByOfferingId(offeringId: number): Observable<Comment[]> {
    return of(this.comments.filter(comment => comment.offeringId === offeringId));
  }

  addComment(comment: Omit<Comment, 'id'>): Observable<Comment> {
    const newComment: Comment = {
      ...comment,
      id: this.comments.length + 1
    };
    this.comments.push(newComment);
    return of(newComment);
  }

  getComments():Observable<Comment[]>{
    return of(this.comments);
  }
}