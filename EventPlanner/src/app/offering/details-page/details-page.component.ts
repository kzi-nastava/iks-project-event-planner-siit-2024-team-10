import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { OfferingService } from '../offering.service';
import { CommentService, Comment } from '../comment.service';
import { Offering } from '../model/offering.model';
import { switchMap } from 'rxjs/operators';
import { Service } from '../model/service.model';
import { Product } from '../model/product.model';
import { Router } from '@angular/router';

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
  offering: Product | Service;
  images: string[] = [];
  activeImage = 0;
  userRating = 0;
  comments: Comment[] = [];
  
  newComment = {
    userName: '',
    rating: 0,
    text: ''
  };

  constructor(
    private route: ActivatedRoute,
    private offeringService: OfferingService,
    private commentService: CommentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        return this.offeringService.getOfferingById(id);
      })
    ).subscribe(offering => {
      this.offering = offering;
      console.log('Offering:', this.offering);  // Check if specification exists
      if (this.offering) {
        this.images = [this.offering.picture];
        this.loadComments();
      }
    });
  }
  
  isService(offering: Product | Service): offering is Service {
    const isService = (offering as Service).specification !== undefined;
    console.log('Is service:', isService);  // Check the result of the check
    return isService;
  }

  private loadComments(): void {
    if (this.offering) {
      this.commentService.getCommentsByOfferingId(this.offering.id)
        .subscribe(comments => {
          this.comments = comments;
        });
    }
  }

  setActiveImage(index: number): void {
    this.activeImage = index;
  }

  setRating(rating: number): void {
    this.userRating = rating;
    this.newComment.rating = rating;
  }

  submitComment(): void {
    if (this.offering && this.newComment.userName && this.newComment.text && this.newComment.rating) {
      const newComment = {
        offeringId: this.offering.id,
        userName: this.newComment.userName,
        rating: this.newComment.rating,
        text: this.newComment.text,
        date: new Date()
      };

      this.commentService.addComment(newComment)
        .subscribe(() => {
          this.loadComments();
          // Reset form
          this.newComment = {
            userName: '',
            rating: 0,
            text: ''
          };
          this.userRating = 0;
        });
    }
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }
  isFavorite: boolean = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
}
navigateToEdit(): void {
  const prefilledData = {
    serviceCategory: 'Default Category',
    name: 'Sample Service',
    description: 'A brief description of the service',
    specification: 'Detailed specifications',
    price: 100,
    discount: 10,
    timeType: 'fixed',
    fixedTime: 2,
    minTime: '',
    maxTime: '',
    reservationDeadline: '1day',
    cancellationDeadline: '3days',
    isAvailable: true,
    isVisible: true
  };

  // navigate to 'edit-service' and pass data (adjust routing if necessary)
  this.router.navigate(['/edit-service'], { state: { data: prefilledData } });
}
}