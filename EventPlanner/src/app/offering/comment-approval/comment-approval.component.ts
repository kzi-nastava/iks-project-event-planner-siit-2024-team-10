import { Component, inject, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Comment } from '../model/comment.model';
import { MatSort } from '@angular/material/sort';
import { CommentService } from '../comments/comment.service';
import { AuthService } from '../../infrastructure/auth/auth.service';

@Component({
  selector: 'app-comment-approval',
  templateUrl: './comment-approval.component.html',
  styleUrl: './comment-approval.component.css'
})
export class CommentApprovalComponent {
dataSource: MatTableDataSource<Comment>;
  displayedColumns: string[] = ['sender', 'rating', 'content', 'actions'];
  snackBar: MatSnackBar = inject(MatSnackBar);
  @ViewChild(MatSort) sort!: MatSort;
  accountId: number;

  constructor(private service:CommentService,
              private authService: AuthService) {}
  
  ngOnInit(): void {
    this.accountId = this.authService.getAccountId();
    this.refreshDataSource();
  }
  private refreshDataSource() {
    this.service.getPendingComments().subscribe({
      next: (comments: Comment[]) => {
        comments.sort((a, b) => a.user.localeCompare(b.user));
        this.dataSource = new MatTableDataSource<Comment>(comments);
        this.dataSource.sort = this.sort;
      },
      error: (_) => {
        console.error("Error loading comments");
      }
    })
  }


    accept(commentId: number) {
      this.service.approve(commentId).subscribe({
        next: () => {
          this.snackBar.open("Comment accepted", "Close", { duration: 3000 });
          this.refreshDataSource();
        },
        error: () => {
          this.snackBar.open("Failed to accept comment", "Close", { duration: 3000 });
        }
      });
    }

  deny(commentId: number) {
    this.service.delete(commentId).subscribe({
      next: () => {
        this.snackBar.open("Comment denied", "Close", { duration: 3000 });
        this.refreshDataSource();
      },
      error: () => {
        this.snackBar.open("Failed to deny Comment", "Close", { duration: 3000 });
      }
    });
  }

}
