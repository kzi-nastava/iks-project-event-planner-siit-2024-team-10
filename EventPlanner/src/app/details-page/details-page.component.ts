import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Comment {
  userName: string;
  rating: number;
  text: string;
  date: Date;
}

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css'],
  standalone: true,
  imports: [
    MatExpansionModule, 
    CommonModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class DetailsPageComponent implements OnInit {
  images = ['image1.jpg', 'image2.png'];
  activeImage = 0;
  userRating = 0;
  newComment = {
    userName: '',
    rating: 0,
    text: ''
  };

  comments: Comment[] = [
    {
      userName: 'Sarah Johnson',
      rating: 5,
      text: 'Amazing service! The makeup artist was professional and made me look stunning on my wedding day.',
      date: new Date('2024-02-15')
    },
    {
      userName: 'Emma Wilson',
      rating: 4,
      text: 'Great experience overall. Very satisfied with both hair and makeup.',
      date: new Date('2024-02-10')
    }
  ];

  ngOnInit(): void {
    // Initialize component here
    // You can load initial data or perform other setup tasks
  }

  setActiveImage(index: number): void {
    this.activeImage = index;
  }

  setRating(rating: number): void {
    this.userRating = rating;
    this.newComment.rating = rating;
  }

  submitComment(): void {
    if (this.newComment.userName && this.newComment.text && this.newComment.rating) {
      this.comments.unshift({
        ...this.newComment,
        date: new Date()
      });
      // Reset form
      this.newComment = {
        userName: '',
        rating: 0,
        text: ''
      };
      this.userRating = 0;
    }
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }
}