import {CreateLocationDTO} from './create-location-dto.model';

export interface CreateEventDTO {
  eventTypeId:number;
  organizerId:number;
  name:string;
  description:string;
  maxParticipants:number;
  isOpen:boolean;
  date:string;
  location:CreateLocationDTO;
}
