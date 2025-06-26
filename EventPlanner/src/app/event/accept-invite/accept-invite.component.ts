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
    } else {
      this.acceptInvite(token);
    }
  }

  acceptInvite(token: string): void {
    this.email = this.authService.getEmail();
    this.eventService.acceptInvite(token, this.email).subscribe({
      next: () => {
        this.snackBar.open('The event invitation has been accepted','OK',{duration:5000});
        this.router.navigate(['/user-details']);
      },
      error: (err) => {
        if (err.status === 400) {
          // User who is logged in is not the user who clicked the invitation -> Log user out
          localStorage.removeItem('user');
          this.authService.setUser();
          this.router.navigate(['/login'], { queryParams: { 'invitation-token': token } });
        }
        
        else {
          this.snackBar.open('An error occured while trying to accept the request','OK',{duration:5000});
          this.router.navigate(['/home']);
        }
      }
    });
  }
}
