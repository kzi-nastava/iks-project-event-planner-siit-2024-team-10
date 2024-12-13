import {EventType} from './event-type.model';
import {Organizer} from './organizer.model';
import {Location} from './location.model';
import {AgendaItem} from './agenda-item.model';

export interface Event{
    id: number;
    name: string;
    eventType: EventType;
    organizer: Organizer;
    description: string;
    maxParticipants: number;
    isOpen: boolean;
    date: Date;
    location: Location;
    averageRating: number;
    agenda?:AgendaItem[];
}
