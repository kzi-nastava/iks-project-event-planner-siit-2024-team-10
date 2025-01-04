import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '../comment-service/comment.service';
import { switchMap } from 'rxjs/operators';
import { Service } from '../model/service.model';
import { Product } from '../model/product.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';
import { ServiceService } from '../service-service/service.service';
import { OfferingService } from '../offering-service/offering.service';
import { Comment } from '../model/comment.model';

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
  isCommentingEnabled = false; 
  
  newComment = {
    userName: '',
    rating: 0,
    text: ''
  };

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private commentService: CommentService,
    private offeringService: OfferingService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        console.log(id)
        return this.serviceService.getById(id);
      })
    ).subscribe(offering => {
      this.offering = offering;
      console.log('Offering:', this.offering); 
      if (this.offering) {
        this.images = Array.isArray(this.offering.picture) ? this.offering.picture : [this.offering.picture];
        this.loadComments();
      }
    });
  }  
  
  isService(offering: Product | Service): offering is Service {
    const isService = (offering as Service).specification !== undefined;
    return isService;
  }

  private loadComments(): void {
    if (this.offering) {
      this.offeringService.getComments(this.offering.id)
        .subscribe(comments => {
          this.comments = comments;
          console.log(comments)
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
    if (!this.isCommentingEnabled) {
      return;
    }
    
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

// prefill podatke za edit
navigateToEdit(): void {
  if (this.offering) {
    const prefilledData = {
      id: this.offering.id,
      serviceCategory: this.offering.category || 'Default Category',
      name: this.offering.name || '',
      description: this.offering.description || '',
      specification: this.isService(this.offering) ? this.offering.specification || '' : '',
      price: this.offering.price || 0,
      discount: this.offering.discount || 0,
      fixedTime: this.isService(this.offering) ? this.offering.fixedTime || 0 : '',
      minTime: this.isService(this.offering) ? this.offering.minDuration || '' : '',
      maxTime: this.isService(this.offering) ? this.offering.maxDuration || '' : '',
      reservationPeriod: this.isService(this.offering) ? this.offering.reservationPeriod || '' : '',
      cancellationPeriod: this.isService(this.offering) ? this.offering.cancellationPeriod || '' : '',
      isAvailable: this.offering.available || false,
      isVisible: this.offering.visible || false,
      autoConfirm: this.isService(this.offering) ? this.offering.autoConfirm || false : false,    
      eventTypes:this.offering.eventTypes
    };

    this.router.navigate(['/edit-service'], { state: { data: prefilledData } });
    }
  }
  deleteOffering(): void {
    if (this.offering) {
      const confirmation = confirm('Are you sure you want to delete this offering?');
      if (confirmation) {
        this.serviceService.delete(this.offering.id).subscribe(
          () => {
            console.log('Offering deleted successfully');
            this.router.navigate(['/manage-offerings']); 
          },
          error => {
            console.error('Error deleting offering:', error);
          }
        );
      }
    }
  }
  
  viewProviderProfile() {
    console.log('Viewing provider profile...');
  }

  chat() {
    console.log('chat with provider...');
  }
  openReservationDialog(): void {
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '1000px',
      data: { offering: this.offering }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Reservation data:', result);
        this.isCommentingEnabled = true; 
      } else {
        console.log('Dialog closed without reservation.');
      }
    });
  }
}