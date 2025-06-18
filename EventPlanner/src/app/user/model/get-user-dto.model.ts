import {GetCompany} from './company.model';
import { Location } from '../../event/model/location.model';

export interface GetUserDTO {
  accountId:number;
  userId:number;
  email:string;
  role:string;
  firstName:string;
  lastName:string;
  phoneNumber:string;
  profilePhoto:string;
  location:Location;
  company:GetCompany;
}
