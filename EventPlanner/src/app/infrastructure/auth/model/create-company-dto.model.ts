import {CreateLocationDTO} from '../../../event/model/create-location-dto.model';

export interface CreateCompanyDTO {
  email: string;
  name: string;
  location:CreateLocationDTO
  phoneNumber: string;
  description: string;
  photos: string[];
}
