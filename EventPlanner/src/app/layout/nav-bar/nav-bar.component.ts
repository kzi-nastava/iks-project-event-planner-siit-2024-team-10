import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  navigateToAdminSection(section: string) {
    this.router.navigate([`/admin/${section}`]);
  }
}