import { Location } from '../../event/model/location.model';

export interface GetCompany {
  email: string;
  name: string;
  description: string;
  photos?: string[];
  location: Location;
}
