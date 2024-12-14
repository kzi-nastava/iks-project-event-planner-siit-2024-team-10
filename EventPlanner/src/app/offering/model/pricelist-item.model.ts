export interface PricelistItem{
    id: number;
    name:string;
    price:number;
    discount?:number;
    priceWithDiscount:number;
}