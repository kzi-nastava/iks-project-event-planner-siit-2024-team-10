export interface Event{
    id: number;
    name: string;
    eventType: string;
    organizer: string;
    description: string;
    maxParticipants: number;
    isOpen: boolean;
    date: Date;
    location: string;
    rating: number;
}