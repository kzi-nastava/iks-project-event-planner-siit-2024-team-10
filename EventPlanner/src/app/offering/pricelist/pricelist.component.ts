import { Component, OnInit } from '@angular/core';
import { PricelistItem } from '../model/pricelist-item.model';
import { PricelistService } from '../pricelist-service/pricelist.service';

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})
export class PricelistComponent implements OnInit {
  pricelistItems: PricelistItem[] = [];
  editingItemId: number | null = null;
  editedItem: Partial<PricelistItem> = {};

  constructor(private pricelistService: PricelistService) {}

  ngOnInit() {
    this.pricelistService.getAll().subscribe({
      next: (data) => {
        this.pricelistItems = data;
      },
      error: (err) => {
        console.error('Error fetching pricelist:', err);
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
        console.error('Discount must be between 0 and 100');
        return;
      }
      const discountAmount = this.editedItem.price * (this.editedItem.discount / 100);
      this.editedItem.priceWithDiscount = Number((this.editedItem.price - discountAmount).toFixed(2));
    }
  }

  saveChanges() {
    if (this.editingItemId !== null && this.editedItem) {
      const updateDto= {
        offeringId: this.editingItemId,
        price: this.editedItem.price!,
        discount: this.editedItem.discount
      };

      this.pricelistService.edit(updateDto).subscribe({
        next: (updatedItem) => {
          this.updateLocalItem(updatedItem);
          this.cancelEditing();
        },
        error: (err) => console.error('Error saving changes:', err)
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
    }
  }
}
