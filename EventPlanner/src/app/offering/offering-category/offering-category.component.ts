import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../category-service/category.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import {Category} from '../model/category.model'; 
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
@Component({
  selector: 'app-offering-category',
  templateUrl: './offering-category.component.html',
  styleUrls: ['./offering-category.component.css']
})

export class OfferingCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'approve', 'actions'];
  dataSource: MatTableDataSource<Category>;
  snackBar:MatSnackBar = inject(MatSnackBar);
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.refreshDataSource();
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
        // Automatically set pending to true for new categories
        const newCategory = { 
          ...result, 
          pending: true,
          deleted: false
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
    // TODO: notifications
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
    this.categoryService.delete(category.id).subscribe({
      next: (response) => {
        this.refreshDataSource();
        this.snackBar.open('Category deleted successfully','OK',{duration:3000});
      },
      error: (err) => console.error('Error deleting category:', err),
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
}