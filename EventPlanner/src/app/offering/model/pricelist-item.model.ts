export interface PricelistItem{
    offeringId: number;
    name:string;
    price:number;
    discount?:number;
    priceWithDiscount:number;
}