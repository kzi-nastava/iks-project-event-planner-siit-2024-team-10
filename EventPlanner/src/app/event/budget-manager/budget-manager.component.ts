import { Component, OnInit } from '@angular/core';
import { BudgetItemService } from '../budget-item.service';
import { BudgetItem } from '../model/budget-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../event.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { Event } from '../model/event.model';
import { UpdateBudgetItemDTO } from '../../offering/model/edit-budget-item-dto.model';
import { AddBudgetItemDialogComponent } from '../add-budget-item-dialog/add-budget-item-dialog.component';
import { CreateBudgetItemDTO } from '../../offering/model/create-budget-item-dto.models';
import { CategoryService } from '../../offering/category-service/category.service';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../offering/model/product.model';
import { Service } from '../../offering/model/service.model';

@Component({
  selector: 'app-budget-manager',
  templateUrl: './budget-manager.component.html',
  styleUrls: ['./budget-manager.component.css']
})
export class BudgetManagerComponent implements OnInit {
  budgetItems: BudgetItem[] = [];
  displayedColumns: string[] = ['category', 'amount', 'offerings', 'delete'];
  events: Event[] = [];
  selectedEventId: number | null = null;
  totalBudget: number = 0;

  constructor(
    private budgetItemService: BudgetItemService,
    private eventService: EventService,
    private authService: AuthService, 
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }
  
  loadEvents(): void {
    this.eventService.getMyEvents(this.authService.getUserId()).subscribe({
      next: (events) => {
        this.events = events;
        if (events.length) {
          this.selectedEventId = events[0].id;
          this.loadBudgetItems();
        }
      },
      error: () => this.snackBar.open('Failed to load events', 'Close', { duration: 3000 })
    });
  }
  
  loadBudgetItems(): void {
    if (!this.selectedEventId) return;
  
    this.budgetItemService.getByEvent(this.selectedEventId).subscribe({
      next: (items) => {
        console.log('Vraćene budžetske stavke:', items);
        this.budgetItems = items;
        this.totalBudget = items.reduce((sum, item) => sum + item.amount, 0);
      },
      error: () => {
        this.snackBar.open('Failed to load budget items', 'Close', { duration: 3000 });
      }
    });
  }  

  onEventChange(): void {
    this.loadBudgetItems();
  }  

  delete(item: BudgetItem): void {
    console.log(this.budgetItems);
    this.budgetItemService.delete(this.selectedEventId, item.id).subscribe(success => {
      if (success) {
        this.snackBar.open("Budget item deleted", "Close", { duration: 2000 });
        this.loadBudgetItems();
      } else {
        this.snackBar.open("Budget item has not been deleted, you have reserved offerings.", "Close", { duration: 2000 });
      }
    });
    
  }

  updateAmount(item: BudgetItem): void {
    if (!this.selectedEventId || !item.id) {
      this.snackBar.open('Invalid event or budget item', 'Close', { duration: 2000 });
      return;
    }
  
    this.budgetItemService.updateAmount(this.selectedEventId, item.id, item.amount).subscribe({
      next: () => {
        this.snackBar.open('Amount updated', 'Close', { duration: 2000 });
        
        this.totalBudget = this.budgetItems.reduce((sum, bi) => sum + bi.amount, 0);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to update amount', 'Close', { duration: 2000 });
      }      
    });
  }  
  
  openAddBudgetItemDialog(): void {
    if (!this.selectedEventId) {
      this.snackBar.open('Please select an event first.', 'Close', { duration: 3000 });
      return;
    }
  
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        const usedCategories = this.budgetItems.map(b => b.category).filter(c => c != null);
  
        const dialogRef = this.dialog.open(AddBudgetItemDialogComponent, {
          width: '400px',
          data: {
            categories,
            usedCategories
          }
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const dto: CreateBudgetItemDTO = {
              amount: +result.amount,
              categoryId: result.category.id,
              eventId: this.selectedEventId!,
            };
  
            this.budgetItemService.add(dto).subscribe({
              next: () => {
                this.snackBar.open('Budget item added', 'Close', { duration: 2000 });
                this.loadBudgetItems();
              },
              error: () => {
                this.snackBar.open('Failed to add budget item', 'Close', { duration: 3000 });
              }
            });
          }
        });
      },
      error: () => {
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
      }
    });
  }  
  getAllOfferings(item: BudgetItem): (Product | Service)[] {
    const offerings = [...(item.products || []), ...(item.services || [])];
    return offerings;
  }  
}