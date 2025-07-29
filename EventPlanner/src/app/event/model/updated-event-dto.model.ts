import {Location} from './location.model';

export interface UpdatedEventDTO {
  id:number;
  eventTypeId:number;
  organizerId:number;
  name:string;
  description:string;
  maxParticipants:number;
  isOpen:boolean;
  date:string;
  isDeleted:boolean;
  location:Location;
}
