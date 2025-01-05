import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '../comments/comment.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Service } from '../model/service.model';
import { Product } from '../model/product.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';
import { ServiceService } from '../service-service/service.service';
import { OfferingService } from '../offering-service/offering.service';
import { Comment } from '../model/comment.model';
import { CreateCommentDTO } from '../model/create-comment-dto.model';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../env/environment';
import { ProductService } from '../product.service';

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
  isEventOrganizer = false;
  role: string = '';

  newComment = {
    rating: 0,
    text: ''
  };

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private productService: ProductService,
    private commentService: CommentService,
    private offeringService: OfferingService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log(this.authService.getUserId());
    this.authService.userState.subscribe((result) => {
          console.log(result);
          this.role = result;
        })

    this.isEventOrganizer = this.role === 'EVENT_ORGANIZER';

    this.route.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        console.log(id);
        
        return this.serviceService.getById(id).pipe(
          catchError(error => {
            console.log('Service not found, trying product service');
            return this.productService.getById(id);
          })
        );
      }),
      map(offering => {
        if (offering && offering.photos) {
          offering.photos = offering.photos.map(photo => {
            const fileName = photo.split('\\').pop()?.split('/').pop();
            console.log(fileName);
            return `${environment.apiHost}/images/${fileName}`;
          });
        }
        return offering;
      })
    ).subscribe(offering => {
      this.offering = offering;
      console.log('Offering:', this.offering);
      if (this.offering && this.offering.photos) {
        this.images = this.offering.photos;
      }
      this.loadComments();
    });
  }
  
  isService(offering: Product | Service): offering is Service {
    const isService = (offering as Service).specification !== undefined;
    return isService;
  }

  loadComments(): void {
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
  
    if (this.offering && this.newComment.text && this.newComment.rating) {
      const newComment: CreateCommentDTO = {
        rating: this.newComment.rating,
        content: this.newComment.text,
        account: this.authService.getUserId()
      };
  
      console.log(newComment);
  
      this.commentService.add(newComment, this.offering.id)
        .subscribe({
          next: () => {
            this.loadComments();
            this.newComment = {
              rating: 0,
              text: ''
            };
            this.userRating = 0;
            this.snackBar.open('Comment submitted successfully! Waiting for admin approval.', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.snackBar.open('Error submitting comment. Please try again.', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
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

  openReservationDialog(): void {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please log in to make a reservation', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['warning-snackbar']
      });
      return;
    }

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

  chat() {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please log in to chat with the provider', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['warning-snackbar']
      });
      return;
    }
    
    console.log('chat with provider...');
  }
}