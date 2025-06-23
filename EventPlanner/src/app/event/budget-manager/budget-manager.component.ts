import { Component, OnInit } from '@angular/core';
import { BudgetItemService } from '../budget-item.service';
import { BudgetItem } from '../model/budget-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-budget-manager',
  templateUrl: './budget-manager.component.html',
  styleUrls: ['./budget-manager.component.css']
})
export class BudgetManagerComponent implements OnInit {
  budgetItems: BudgetItem[] = [];
  displayedColumns: string[] = ['category', 'amount', 'offerings', 'edit', 'delete'];

  constructor(
    private budgetItemService: BudgetItemService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBudgetItems();
  }

  loadBudgetItems(): void {
    this.budgetItemService.getAll().subscribe({
      next: (items) => this.budgetItems = items,
      error: () => this.snackBar.open('Failed to load budget items', 'Close', { duration: 3000 })
    });
  }

  edit(item: BudgetItem): void {
    // TODO: Open dialog/form for editing
    this.snackBar.open(`Edit clicked for item #${item.id}`, 'OK', { duration: 2000 });
  }

  delete(item: BudgetItem): void {
    // TODO: pozovi DELETE ako postoji ili postavi `isDeleted=true`
    this.snackBar.open(`Delete clicked for item #${item.id}`, 'OK', { duration: 2000 });
  }
}
