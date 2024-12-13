import { Location } from '../../event/model/location.model';

export interface GetCompany {
  email: string;
  name: string;
  description: string;
  phoneNumber: string;
  photos?: string[];
  location: Location;
}
