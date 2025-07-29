import {Category} from '../../offering/model/category.model';

export interface EventType {
  id:number;
  name: string;
  description?: string;
  active?:boolean;
  recommendedCategories?:Category[];
}
