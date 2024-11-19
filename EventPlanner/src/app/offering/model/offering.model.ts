export interface Offering {
    id: number;
    name: string;
    category: string;
    description?: string;
    discount?: number;
    picture: string;
    provider: string;
    price: number;
    rating: string;
    eventTypes?: string[];
    isAvailable?: boolean;
    isVisible?: boolean;
    isProduct: boolean;
}