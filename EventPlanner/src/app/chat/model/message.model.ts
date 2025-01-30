export interface Message {
    id?:number;
    content: string;
    timestamp: Date;
    senderId: number;
    receiverId: number;
  }