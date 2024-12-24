import {CreateCompanyDTO} from './create-company-dto.model';
import {CreateLocationDTO} from './create-location-dto.model';

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  location:CreateLocationDTO;
  phoneNumber: string;
  company:CreateCompanyDTO;
  role:string;
}
