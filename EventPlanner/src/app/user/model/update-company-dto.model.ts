import {CreateLocationDTO} from '../../infrastructure/auth/model/create-location-dto.model';

export interface UpdateCompanyDTO{
  phoneNumber:string;
  description:string;
  location:CreateLocationDTO
}
