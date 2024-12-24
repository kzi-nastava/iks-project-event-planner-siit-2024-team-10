import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.css'
})
export class ActivateComponent {

  constructor(
    private route: ActivatedRoute,
    private authService:AuthService,
    private router: Router,) {}

  snackBar:MatSnackBar = inject(MatSnackBar)

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      this.authService.activate(token).subscribe({
        next: (response) => {
          this.snackBar.open('Account activated successfully','OK',{duration:5000});
        },
        error: (err) => this.snackBar.open(err.error,'OK',{duration:3000})
      });
    });
    this.router.navigate(['home']);
  }


}
