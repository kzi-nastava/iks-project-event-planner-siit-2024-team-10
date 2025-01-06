import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../infrastructure/auth/auth.service';
import { Provider } from '../user/model/provider.model';
import { Offering } from '../offering/model/offering.model';
import { forkJoin, map } from 'rxjs';
import { Comment } from '../offering/model/comment.model';
import { OfferingService } from '../offering/offering-service/offering.service';
import { environment } from '../../env/environment';

@Component({
  selector: 'app-provider-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.css']
})
export class ProviderProfileComponent implements OnInit {
  provider?: Provider;
  offerings: Offering[] = [];
  totalOfferings: number = 0;
  totalComments: number = 0;
  averageRating: number = 0;

  businessHours = [
    { day: 'Monday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Tuesday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Thursday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Saturday', hours: 'Closed' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private offeringService: OfferingService
  ) {}

  ngOnInit() {
    if (history.state.provider) {
      this.provider = history.state.provider;
      this.loadOfferingsWithComments(this.provider.id);
    } else {
      const providerId = this.route.snapshot.params['id'];
      this.loadOfferingsWithComments(providerId);
    }
    console.log(this.provider);
  }

  /*
  try it when pictures are in db
  get companyPhoto(): string {
    const photo = this.provider.company?.photos[0];
    const fileName = photo.split('\\').pop()?.split('/').pop();
    return `${environment.apiHost}/images/${fileName}`;
  }
  */

  get profilePhoto(): string {
    const photo = this.provider.profilePhoto;
    console.log(photo);
    const fileName = photo.split('\\').pop()?.split('/').pop();
    return `${environment.apiHost}/images/${fileName}`;
  }

  loadOfferingsWithComments(providerId: number) {
    this.offeringService.getOfferingsByProviderId(providerId).subscribe((offerings) => {
      this.offerings = offerings;
      this.totalOfferings = offerings.length; // Count offerings
      let totalCommentsCount = 0;
      let totalRatings = 0;

      const commentsObservables = offerings.map((offering) =>
        this.offeringService.getComments(offering.id).pipe(
          map((comments) => {
            offering.comments = comments; 
            totalCommentsCount += comments.length;
            comments.forEach((comment) => {
              totalRatings += comment.rating;
            });
          })
        )
      );

      // Wait for all comment requests to complete
      forkJoin(commentsObservables).subscribe(() => {
        this.totalComments = totalCommentsCount;
        this.averageRating = totalRatings / (totalCommentsCount || 1); // Avoid division by zero
      });
    });
  }  

  isCurrentDay(day: string): boolean {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
  }

  reportProvider() {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please log in to report a provider', 'Close', {
        duration: 3000
      });
      return;
    }
  }

  getStarRating(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
