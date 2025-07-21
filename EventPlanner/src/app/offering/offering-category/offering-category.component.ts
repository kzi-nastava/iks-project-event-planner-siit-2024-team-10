import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../category-service/category.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import {Category} from '../model/category.model'; 
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import { ChangeCategoryDialogComponent } from '../../change-category-dialog/change-category-dialog.component';
import { Offering } from '../model/offering.model';
import { OfferingService } from '../offering-service/offering.service';
import { AuthService } from '../../infrastructure/auth/auth.service';

@Component({
  selector: 'app-offering-category',
  templateUrl: './offering-category.component.html',
  styleUrls: ['./offering-category.component.css']
})

export class OfferingCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'approve', 'actions', 'changeCategory','offerings'];
  dataSource: MatTableDataSource<Category>;
  snackBar:MatSnackBar = inject(MatSnackBar);
  offeringsByCategory: { [categoryId: number]: Offering[] } = {};

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategoryService,
    private offeringService: OfferingService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.refreshDataSource();
    this.loadOfferingsGroupedByCategory();
  }
  
  private refreshDataSource() {
    this.categoryService.getAll().subscribe({
      next: (categories: Category[]) => {
        const activeCategories = categories.filter(category => !category.deleted);
        activeCategories.sort((a, b) => a.name.localeCompare(b.name));
        this.dataSource = new MatTableDataSource<Category>(activeCategories);
      },
      error: (_) => {
        console.error("Error loading categories");
      }
    });
  }
  
  openAddCategoryDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newCategory = { 
          ...result, 
          pending: true,
          deleted: false,
          creatorId: this.authService.getAccountId()
        };
        this.categoryService.add(newCategory).subscribe({
          next: (response) => {
            this.refreshDataSource();
            this.snackBar.open('Category added successfully','OK',{duration:3000});
          },
          error: (err) => console.error('Error adding category:', err),
        });
      }
    });
  }

  editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { mode: 'edit', category: { ...category } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.edit(result).subscribe({
          next: (response) => {
            this.refreshDataSource();
            this.snackBar.open('Category updated successfully','OK',{duration:3000});
          },
          error: (err) => console.error('Error updating category:', err),
        });
      }
    });  
  }

  deleteCategory(category: Category) {
    this.categoryService.delete(category.id).subscribe(success => {
      if (success) {
        this.snackBar.open('Category successfully deleted.', 'OK', { duration: 3000 });
        this.refreshDataSource();
      } else {
        this.snackBar.open('Category was not deleted because it has related offerings.', 'OK', { duration: 3000 });
      }
    }, error => {
      this.snackBar.open('Category not found.', 'OK', { duration: 3000 });
    });    
  }

  approveCategory(category: Category) {
    this.categoryService.approve(category.id).subscribe({
      next: (response) => {
        this.refreshDataSource();
        this.snackBar.open('Category approved successfully', 'OK', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error approving category:', err);
        this.snackBar.open('Error approving category', 'OK', { duration: 3000 });
      }
    });
  }  

  openChangeCategoryDialog(offering: Offering) {
    const dialogRef = this.dialog.open(ChangeCategoryDialogComponent, {
      width: '400px',
      data: { currentCategory: offering.category }
    });
  
    dialogRef.afterClosed().subscribe(newCategory => {
      if (newCategory && newCategory.id !== offering.id) {
        this.offeringService.changeOfferingCategory(offering.id, newCategory.id).subscribe({
          next: () => {
            this.snackBar.open('Category changed successfully.', 'OK', { duration: 3000 });
            this.refreshDataSource();
            this.loadOfferingsGroupedByCategory();
          },
          error: () => {
            this.snackBar.open('Failed to change category.', 'OK', { duration: 3000 });
          }
        });
      }
    });
  }
  private loadOfferingsGroupedByCategory() {
    this.offeringService.getAllNonPaged().subscribe({
      next: (offerings) => {
        if (!Array.isArray(offerings)) {
          console.error('Offerings is not an array!');
          return;
        }
      
        this.offeringsByCategory = {};
        for (const offering of offerings) {
          if (offering.category && !offering.category.deleted) {
            if (!this.offeringsByCategory[offering.category.id]) {
              this.offeringsByCategory[offering.category.id] = [];
            }
            this.offeringsByCategory[offering.category.id].push(offering);
          }
        }
      }
      
    });
  }
  
}