import { Organizer } from "../event/model/organizer.model";

export interface Message {
    id?: number;
    content: string;
    timestamp: Date;
    sender: number;
    receiver: number;
    isRead: boolean;
  }