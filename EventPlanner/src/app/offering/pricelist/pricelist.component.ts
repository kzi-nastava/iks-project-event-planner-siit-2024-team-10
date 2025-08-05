import { Component, OnInit } from '@angular/core';
import { PricelistItem } from '../model/pricelist-item.model';
import { PricelistService } from '../pricelist-service/pricelist.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';  // Import MatSnackBar

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})
export class PricelistComponent implements OnInit {
  pricelistItems: PricelistItem[] = [];
  editingItemId: number | null = null;
  editedItem: Partial<PricelistItem> = {};

  constructor(private pricelistService: PricelistService, private http: HttpClient, private snackBar: MatSnackBar) {}  // Inject MatSnackBar

  ngOnInit() {
    this.pricelistService.getAll().subscribe({
      next: (data) => {
        this.pricelistItems = data;
        this.sortItems();
      },
      error: (err) => {
        this.openSnackbar('Error fetching pricelist');
      }
    });
  }

  startEditing(item: PricelistItem) {
    this.editingItemId = item.offeringId;
    this.editedItem = { ...item };
  }

  calculateDiscountedPrice() {
    if (this.editedItem.price && this.editedItem.discount !== undefined) {
      if (this.editedItem.discount < 0 || this.editedItem.discount > 100) {
        this.openSnackbar('Discount must be between 0 and 100');
        return;
      }
      const discountAmount = this.editedItem.price * (this.editedItem.discount / 100);
      this.editedItem.priceWithDiscount = Number((this.editedItem.price - discountAmount).toFixed(2));
    }
  }

  saveChanges() {
    if (this.editingItemId !== null && this.editedItem) {
      const updateDto = {
        offeringId: this.editingItemId,
        price: this.editedItem.price!,
        discount: this.editedItem.discount
      };

      this.pricelistService.edit(updateDto).subscribe({
        next: (updatedItem) => {
          this.updateLocalItem(updatedItem);

          this.pricelistService.getAll().subscribe({
            next: (data) => {
              this.pricelistItems = data;
              this.sortItems();
            },
            error: (err) => {
              this.openSnackbar('Error fetching pricelist after save');
            }
          });

          this.cancelEditing();
        },
        error: (err) => {
          this.openSnackbar('Error saving changes');
        }
      });
    }
  }

  cancelEditing() {
    this.editingItemId = null;
    this.editedItem = {};
  }

  isEditing(itemId: number): boolean {
    return this.editingItemId === itemId;
  }

  private updateLocalItem(updatedItem: PricelistItem) {
    const index = this.pricelistItems.findIndex(item => item.offeringId === updatedItem.offeringId);
    if (index !== -1) {
      this.pricelistItems[index] = updatedItem;
      this.sortItems();
    }
  }

  private sortItems() {
    this.pricelistItems.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }

  generateReport() {
    this.pricelistService.generateReport().subscribe({
      next: (pdfBlob: Blob) => {
        const fileURL = URL.createObjectURL(pdfBlob);
        window.open(fileURL);
      },
      error: (err) => {
        this.openSnackbar('Error generating report');
      }
    });
  }

  private openSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,  
    });
  }
}
