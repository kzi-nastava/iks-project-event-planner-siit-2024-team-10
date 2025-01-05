import { GetProvider } from "../../user/model/get_provider.model";
import { Category } from "./category.model";
import { Location } from "../../event/model/location.model";
export interface Offering {
    id: number;
    name: string;
    category: Category;
    description: string;
    discount?: number;
    photos?: string[];
    provider: GetProvider;
    location: Location;
    price: number;
    specification?: string;
    averageRating: string;
    eventTypes?: string[];
    available?: boolean;
    visible?: boolean;
    isProduct: boolean;
    deleted:boolean;
}