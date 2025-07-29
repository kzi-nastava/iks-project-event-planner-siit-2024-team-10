import {CreateLocationDTO} from '../../infrastructure/auth/model/create-location-dto.model';

export interface UpdateUserDTO{
  firstName: string,
  lastName: string,
  phoneNumber: string,
  location: CreateLocationDTO
}
