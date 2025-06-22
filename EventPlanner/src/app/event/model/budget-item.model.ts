import { Offering } from "../../offering/model/offering.model";
import { Category } from "../../offering/model/category.model";

export interface BudgetItem {
    id: number;
    amount: number;
    isDeleted: boolean;
    category: Category;
    offerings: Offering[];
  }
