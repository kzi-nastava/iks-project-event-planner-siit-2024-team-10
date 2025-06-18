import {CreateLocationDTO} from '../../infrastructure/auth/model/create-location-dto.model';
import {Location} from '../../event/model/location.model';

export interface UpdatedUSerDTO{
  id:number;
  firstName: string,
  lastName: string,
  phoneNumber: string,
  location: Location
}
