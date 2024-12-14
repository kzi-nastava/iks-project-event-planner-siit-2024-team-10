export interface PricelistItem {
    id: number;
    offeringId: number;
    name: string;
    price: number;
    discount?: number;
    priceWithDiscount: number;
  }