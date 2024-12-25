import { Organizer } from "../event/model/organizer.model";

interface Message {
    id?: number;
    content: string;
    timestamp: Date;
    sender: Organizer;
    isRead: boolean;
  }