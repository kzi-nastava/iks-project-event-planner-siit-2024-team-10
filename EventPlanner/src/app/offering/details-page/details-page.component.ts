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
import { MatIconModule } from "@angular/material/icon";
import { AccountService } from '../../account/account.service';
import { MatButtonModule } from '@angular/material/button';
import { BudgetItemService } from '../../event/budget-item.service';
import { ProductReservationDialogComponent } from '../product-reservation-dialog/product-reservation-dialog.component';
import {Offering} from '../model/offering.model';

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
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
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
  isFavourite:boolean=false;
  loggedInUserId:number;
  loggedInAccountId: number;
  canEditOffering: boolean = false;
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
    private accountService: AccountService,
    private authService: AuthService,
    private budgetItemService: BudgetItemService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.authService.userState.subscribe((result) => {
      console.log(result);
      this.role = result;
    })

    this.loggedInAccountId = this.authService.getAccountId();

    this.isEventOrganizer = this.role === 'EVENT_ORGANIZER';

    const passedOffering = history.state.offering as Product | Service;
    console.log(passedOffering)

  if (passedOffering && passedOffering.id) {
    this.offering = passedOffering;
    this.setupOffering(this.offering);
  } 
  else{
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
            return `${environment.apiHost}/images/${fileName}`;
          });
        }
        return offering;
      })
    ).subscribe(offering => {
      this.offering = offering;
      if (this.offering && this.offering.photos) {
        this.images = this.offering.photos;
      }
      this.loadComments();
      
      console.log('Offering loaded:', this.offering);
      this.canEditOffering = this.offering?.provider?.accountId === this.authService.getAccountId();

      if (this.offering) {
        this.accountService.getFavouriteOffering(this.offering.id).subscribe({
          next: (offering:Offering) => {
            this.isFavourite = true;
          },
          error: (err) => {
            if(err.status===404)
              this.isFavourite = false;
            else{
              this.snackBar.open('Error fetching favourite offerings','OK',{duration:5000});
              console.error('Error fetching favourite offerings:', err);
            }
          }
        });
      }
    });
  }
}

setupOffering(offering: Product | Service): void {
  if (!offering) return;

  if (offering.photos) {
    offering.photos = offering.photos.map(photo => {
      const fileName = photo.split('\\').pop()?.split('/').pop();
      return `${environment.apiHost}/images/${fileName}`;
    });
  }

  this.offering = offering;
  this.images = offering.photos || [];

  this.loadComments();

  this.accountService.getFavouriteOffering(offering.id).subscribe({
    next: (offering:Offering) => {
      this.isFavourite = true;
    },
    error: (err) => {
      if(err.status===404)
        this.isFavourite = false;
      else{
        this.snackBar.open('Error fetching favourite offering','OK',{duration:5000});
        console.error('Error fetching favourite offering:', err);
      }
    }
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

  toggleFavorite(): void {
    if(this.isFavourite){
      console.log('Removing offering from favourites...');
      this.accountService.removeOfferingFromFavourites(this.offering.id).subscribe({
        next: () => {
          this.isFavourite = !this.isFavourite;
          console.log(this.isFavourite);
        },
        error: (err) => {
          this.snackBar.open('Error adding offering to favourites','OK',{duration:5000});
          console.error('Error adding offering to favourites:', err);
        }
      });
    }
    else {
      console.log('Adding offering to favourites...');
      this.accountService.addOfferingToFavourites(this.offering.id).subscribe({
        next: () => {
          this.isFavourite = !this.isFavourite;
        },
        error: (err) => {
          this.snackBar.open('Error removing offering from favourites','OK',{duration:5000});
          console.error('Error removing offering from favourites:', err);
        }
      });
    }
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
          this.serviceService.delete(this.offering.id).subscribe({
            next: () => {
              this.snackBar.open('Offering deleted successfully.', 'OK', {
                duration: 3000
              });
              this.router.navigate(['/manage-offerings']);
            },
            error: (error) => {
              if (error.status === 404) {
                this.snackBar.open('Service not found.', 'Dismiss', { duration: 3000 });
              } else if (error.status === 409) {
                this.snackBar.open('Service cannot be deleted because it has reservations.', 'Dismiss', {
                  duration: 4000
                });
              } else {
                this.snackBar.open('Failed to delete offering.', 'Dismiss', {
                  duration: 3000
                });
              }
              console.error('Error deleting offering:', error);
            }
          });
        }
      }
    }
    
  
  viewProviderProfile() {
    if (this.offering && this.offering.provider) {
      this.router.navigate(['/provider', this.offering.provider.id], {
        state: { provider: this.offering.provider }
      });
    }
  }

  get profilePhoto(): string {
    try{
      const photo = this.offering.provider?.profilePhoto;
      const fileName = photo.split('\\').pop()?.split('/').pop();
      return `${environment.apiHost}/images/${fileName}`;
      } catch (error) {
        return `${environment.apiHost}/images/placeholder-image.png`;
    }
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
    
    if (!this.isService(this.offering)) {
      const dialogRef = this.dialog.open(ProductReservationDialogComponent, {
        width: '600px',
        data: { offering: this.offering }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.snackBar.open('Product reserved successfully!', 'Close', { duration: 3000 });
          this.isCommentingEnabled = true;
        } else {
          console.log('Product reservation cancelled.');
        }
      });
      return;
    }    
    
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
      width: '700px',
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

    const sender = this.authService.getAccountId();
    const recipient = this.offering.provider.accountId;
    console.log(sender);
    console.log(recipient);
    this.router.navigate(['/chat'], {
      state: {
        loggedInUserId: sender,
        organizerId: recipient
      }
    });
  }

  reportAccount(accountId: number): void {
    console.log('Reported account:', accountId);
  }
}
