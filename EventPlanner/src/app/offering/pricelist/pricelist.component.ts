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
    this.pricelistService.getAll().subscribe(data => {
      this.pricelistItems = data;
    });
  }

  startEditing(item: PricelistItem) {
    this.editingItemId = item.id;
    this.editedItem = { ...item };
  }

  calculateDiscountedPrice() {
    if (this.editedItem.price && this.editedItem.discount) {
      const discountAmount = this.editedItem.price * (this.editedItem.discount / 100);
      this.editedItem.priceWithDiscount = Number((this.editedItem.price - discountAmount).toFixed(2));
    }
  }

  saveChanges() {
    const index = this.pricelistItems.findIndex(item => item.id === this.editingItemId);
    if (index !== -1 && this.editedItem) {
      this.pricelistItems[index] = {
        ...this.pricelistItems[index],
        ...this.editedItem
      };
      this.cancelEditing();
    }
  }

  cancelEditing() {
    this.editingItemId = null;
    this.editedItem = {};
  }

  isEditing(itemId: number): boolean {
    return this.editingItemId === itemId;
  }
}
