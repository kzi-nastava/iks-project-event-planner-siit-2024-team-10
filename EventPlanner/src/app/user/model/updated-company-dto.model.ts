import {Location} from '../../event/model/location.model';

export interface UpdatedCompanyDTO{
  id:number;
  phoneNumber:string;
  description:string;
  location:Location
}
