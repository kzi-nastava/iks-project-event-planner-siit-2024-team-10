import { Offering } from "../../offering/model/offering.model";
import { Category } from "../../offering/model/category.model";
import { Product } from "../../offering/model/product.model";
import { Service } from "../../offering/model/service.model";

export interface BudgetItem {
    id: number;
    amount: number;
    isDeleted: boolean;
    category: Category;
    services: Service[];
    products:Product[];
  }
