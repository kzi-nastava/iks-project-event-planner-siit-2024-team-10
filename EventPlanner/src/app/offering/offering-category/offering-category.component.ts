import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService, Category } from '../category-service/category.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component'; // Ispravi import ovde

@Component({
  selector: 'app-offering-category',
  templateUrl: './offering-category.component.html',
  styleUrls: ['./offering-category.component.css']
})
export class OfferingCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'offerings', 'actions'];
  dataSource: MatTableDataSource<Category>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.categoryService.categories$.subscribe(categories => {
      this.dataSource = new MatTableDataSource(categories);
      this.dataSource.paginator = this.paginator;
    });

    // Initial fetch of categories
    this.categoryService.fetchCategories().subscribe();
  }

  openAddCategoryDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.addCategory(result).subscribe();
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
        this.categoryService.updateCategory(result).subscribe();
      }
    });
  }

  deleteCategory(category: Category) {
    // You might want to add a confirmation dialog here
    this.categoryService.deleteCategory(category.id).subscribe();
  }
  manageProposals(){
    
  }
}
