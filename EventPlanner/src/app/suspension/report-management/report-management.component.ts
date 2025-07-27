import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { AccountReport } from '../model/account-report.model';
import { SuspensionService } from '../suspension.service';

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrl: './report-management.component.css'
})
export class ReportManagementComponent implements OnInit{
  dataSource: MatTableDataSource<AccountReport>;
  displayedColumns: string[] = ['reportee', 'reporter', 'reason', 'actions'];
  snackBar: MatSnackBar = inject(MatSnackBar);
  @ViewChild(MatSort) sort!: MatSort;
  accountId: number;

  constructor(private service: SuspensionService,
              private authService: AuthService) {}
  
  ngOnInit(): void {
    this.accountId = this.authService.getAccountId();
    this.refreshDataSource();
  }
  private refreshDataSource() {
    this.service.getAllReports().subscribe({
      next: (reports: AccountReport[]) => {
        reports.sort((a, b) => a.reporteeEmail.localeCompare(b.reporteeEmail));
        this.dataSource = new MatTableDataSource<AccountReport>(reports);
        this.dataSource.sort = this.sort;
      },
      error: (_) => {
        this.snackBar.open("There has been an error loading reports", "Close", { duration: 5000 });
      }
    })
  }


    accept(reportId: number) {
      this.service.acceptReport(reportId).subscribe({
        next: () => {
          this.snackBar.open("Account report accepted", "Close", { duration: 3000 });
          this.refreshDataSource();
        },
        error: () => {
          this.snackBar.open("Failed to accept reservation", "Close", { duration: 3000 });
        }
      });
    }

  deny(reportId: number) {
    this.service.rejectReport(reportId).subscribe({
      next: () => {
        this.snackBar.open("Account report denied", "Close", { duration: 3000 });
        this.refreshDataSource();
      },
      error: () => {
        this.snackBar.open("Failed to deny reservation", "Close", { duration: 3000 });
      }
    });
  }

}
