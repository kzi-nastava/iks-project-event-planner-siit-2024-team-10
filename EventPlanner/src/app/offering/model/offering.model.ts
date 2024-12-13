import { GetProvider } from "../../user/model/get_provider.model";
import { Category } from "./category.model";
import { Location } from "../../event/model/location.model";
export interface Offering {
    id: number;
    name: string;
    category: Category;
    description: string;
    discount?: number;
    picture?: string[];
    provider: GetProvider;
    location: Location;
    price: number;
    averageRating: string;
    eventTypes?: string[];
    isAvailable?: boolean;
    isVisible?: boolean;
    isProduct: boolean;
}