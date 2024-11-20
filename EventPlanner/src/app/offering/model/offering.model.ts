import { Provider } from "../../user/model/provider.model";
export interface Offering {
    id: number;
    name: string;
    category: string;
    description: string;
    discount?: number;
    picture: string;
    provider: Provider ;
    price: number;
    rating: string;
    eventTypes?: string[];
    isAvailable?: boolean;
    isVisible?: boolean;
    isProduct: boolean;
}