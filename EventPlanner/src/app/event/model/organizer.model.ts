import {Location} from './location.model';

export interface Organizer {
  id: number;
  firstName: string;
  lastName: string;
  location:Location;
  email: string;
  phoneNumber: string;
  profilePhoto: string;
}
