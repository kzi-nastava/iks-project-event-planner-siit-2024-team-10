import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-accept-invite',
  templateUrl: './accept-invite.component.html'
})
export class AcceptInviteComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  snackBar:MatSnackBar = inject(MatSnackBar)

  email: string;

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('invitation-token');
    if (!token) {
      this.router.navigate(['/home']);
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { 'invitation-token': token } });
      return;
    }

    const email = this.authService.getEmail();

    this.eventService.processInvitation(token, email).subscribe({
      next: () => {
        this.snackBar.open('You joined the event!', 'OK', { duration: 5000 });
        this.router.navigate(['/user-details']);
      },
      error: (err) => {
        if (err.status === 400) {
          // user mismatch, force re-login
          localStorage.removeItem('user');
          this.authService.setUser();
          this.snackBar.open(err.error, 'OK', { duration: 5000 });
          this.router.navigate(['/login'], { queryParams: { 'invitation-token': token } });
        } else {
          this.snackBar.open('Something went wrong.', 'OK', { duration: 5000 });
        }
      }
    });
  }

}
