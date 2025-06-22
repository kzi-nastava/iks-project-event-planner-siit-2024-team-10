import {CreateLocationDTO} from './create-location-dto.model';

export interface UpdateEventDTO {
  eventTypeId:number;
  name:string;
  description:string;
  maxParticipants:number;
  isOpen:boolean;
  date:string;
  location:CreateLocationDTO;
}
