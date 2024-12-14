
export interface PricelistItem {
  id: number;
  name: string;
  price: number;
  discount?: number;
  priceWithDiscount: number;
}

export const MOCK_PRICELIST_DATA: PricelistItem[] = [
  {
      id: 1,
      name: 'Basic Consultation',
      price: 50,
      discount: 10,
      priceWithDiscount: 45
  },
  {
      id: 2,
      name: 'Standard Package',
      price: 120,
      discount: 15,
      priceWithDiscount: 102
  },
  {
      id: 3,
      name: 'Premium Service',
      price: 250,
      discount: 20,
      priceWithDiscount: 200
  },
  {
      id: 4,
      name: 'Elite Support',
      price: 500,
      discount: 25,
      priceWithDiscount: 375
  },
  {
      id: 5,
      name: 'Pro Consultation',
      price: 150,
      discount: 12,
      priceWithDiscount: 132
  },
  {
      id: 6,
      name: 'Executive Package',
      price: 750,
      discount: 30,
      priceWithDiscount: 525
  },
  {
      id: 7,
      name: 'Ultimate Service',
      price: 1000,
      discount: 35,
      priceWithDiscount: 650
  },
  {
      id: 8,
      name: 'Comprehensive Support',
      price: 300,
      discount: 18,
      priceWithDiscount: 246
  }
];

// pricelist.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})
export class PricelistComponent {
  pricelistItems: PricelistItem[] = [...MOCK_PRICELIST_DATA];
  editingItemId: number | null = null;
  editedItem: Partial<PricelistItem> = {};

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