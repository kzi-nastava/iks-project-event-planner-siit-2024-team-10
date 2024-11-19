import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from './model/event.model';

const TOP_EVENTS: Event[] = [
  {
    id: 1,
    name: 'Tech Innovation Summit',
    eventType: 'Conference',
    organizer: 'TechWorld Inc.',
    description: 'An annual gathering of industry leaders discussing the latest in technology, innovation, and startups.',
    maxParticipants: 500,
    isOpen: true,
    date: new Date('2024-12-10T09:00:00'),
    location: 'San Francisco, CA',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Global Health Conference',
    eventType: 'Seminar',
    organizer: 'World Health Organization',
    description: 'A global seminar bringing together experts to discuss new health strategies and medical breakthroughs.',
    maxParticipants: 300,
    isOpen: true,
    date: new Date('2024-11-15T08:00:00'),
    location: 'Geneva, Switzerland',
    rating: 4.7
  },
  {
    id: 3,
    name: 'Summer Music Festival',
    eventType: 'Festival',
    organizer: 'LiveNation',
    description: 'A weekend of live performances featuring top artists from around the world in various music genres.',
    maxParticipants: 10000,
    isOpen: true,
    date: new Date('2025-06-20T12:00:00'),
    location: 'Los Angeles, CA',
    rating: 4.9
  },
  {
    id: 4,
    name: 'Foodie Expo 2024',
    eventType: 'Exhibition',
    organizer: 'Food Network',
    description: 'A food lover’s paradise with the best chefs, restaurants, and food brands showcasing their latest offerings.',
    maxParticipants: 2000,
    isOpen: true,
    date: new Date('2024-12-05T10:00:00'),
    location: 'New York, NY',
    rating: 4.5
  },
  {
    id: 5,
    name: 'Space Exploration Symposium',
    eventType: 'Conference',
    organizer: 'NASA',
    description: 'A symposium discussing the latest advancements in space exploration and research.',
    maxParticipants: 500,
    isOpen: true,
    date: new Date('2025-01-10T09:00:00'),
    location: 'Houston, TX',
    rating: 4.8
  }
];

const EVENTS: Event[] = [
  {
    id: 1,
    name: 'Tech Innovation Summit',
    eventType: 'Conference',
    organizer: 'TechWorld Inc.',
    description: 'An annual gathering of industry leaders discussing the latest in technology, innovation, and startups.',
    maxParticipants: 500,
    isOpen: true,
    date: new Date('2024-12-10T09:00:00'),
    location: 'San Francisco, CA',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Global Health Conference',
    eventType: 'Seminar',
    organizer: 'World Health Organization',
    description: 'A global seminar bringing together experts to discuss new health strategies and medical breakthroughs.',
    maxParticipants: 300,
    isOpen: true,
    date: new Date('2024-11-15T08:00:00'),
    location: 'Geneva, Switzerland',
    rating: 4.7
  },
  {
    id: 3,
    name: 'Summer Music Festival',
    eventType: 'Festival',
    organizer: 'LiveNation',
    description: 'A weekend of live performances featuring top artists from around the world in various music genres.',
    maxParticipants: 10000,
    isOpen: true,
    date: new Date('2025-06-20T12:00:00'),
    location: 'Los Angeles, CA',
    rating: 4.9
  },
  {
    id: 4,
    name: 'Foodie Expo 2024',
    eventType: 'Exhibition',
    organizer: 'Food Network',
    description: 'A food lover’s paradise with the best chefs, restaurants, and food brands showcasing their latest offerings.',
    maxParticipants: 2000,
    isOpen: true,
    date: new Date('2024-12-05T10:00:00'),
    location: 'New York, NY',
    rating: 4.5
  },
  {
    id: 5,
    name: 'Space Exploration Symposium',
    eventType: 'Conference',
    organizer: 'NASA',
    description: 'A symposium discussing the latest advancements in space exploration and research.',
    maxParticipants: 500,
    isOpen: true,
    date: new Date('2025-01-10T09:00:00'),
    location: 'Houston, TX',
    rating: 4.8
  },
  {
    id: 6,
    name: 'Fashion Week Paris',
    eventType: 'Runway Show',
    organizer: 'Paris Fashion Week',
    description: 'A world-renowned fashion event showcasing the newest collections from top designers.',
    maxParticipants: 1000,
    isOpen: false,
    date: new Date('2024-10-01T14:00:00'),
    location: 'Paris, France',
    rating: 5.0
  },
  {
    id: 7,
    name: 'Blockchain Revolution Summit',
    eventType: 'Conference',
    organizer: 'CryptoInnovate',
    description: 'A summit focused on the future of blockchain technology and its applications in various industries.',
    maxParticipants: 700,
    isOpen: true,
    date: new Date('2024-11-22T09:00:00'),
    location: 'London, UK',
    rating: 4.6
  },
  {
    id: 8,
    name: 'International Film Festival',
    eventType: 'Festival',
    organizer: 'Cannes Film Festival',
    description: 'An international film festival showcasing groundbreaking films and performances.',
    maxParticipants: 2000,
    isOpen: false,
    date: new Date('2024-05-15T18:00:00'),
    location: 'Cannes, France',
    rating: 4.9
  },
  {
    id: 9,
    name: 'Entrepreneurship Expo 2024',
    eventType: 'Expo',
    organizer: 'StartupNation',
    description: 'An expo where entrepreneurs can showcase their startups and find investment opportunities.',
    maxParticipants: 1000,
    isOpen: true,
    date: new Date('2024-12-01T10:00:00'),
    location: 'Austin, TX',
    rating: 4.7
  },
  {
    id: 10,
    name: 'Environmental Sustainability Conference',
    eventType: 'Conference',
    organizer: 'GreenEarth',
    description: 'A conference dedicated to discussions about climate change, sustainability, and green technologies.',
    maxParticipants: 600,
    isOpen: true,
    date: new Date('2025-02-20T09:00:00'),
    location: 'Berlin, Germany',
    rating: 4.6
  }
];

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventList: Event[] = [];
  private topEventList: Event[] = [];

  constructor() {
    for (let eventObj of EVENTS){
      const event: Event = {
        id: eventObj.id,
        name: eventObj.name,
        eventType: eventObj.eventType,
        organizer: eventObj.organizer,
        description: eventObj.description,
        maxParticipants: eventObj.maxParticipants,
        isOpen: eventObj.isOpen,
        date: eventObj.date,
        location: eventObj.location,
        rating: eventObj.rating
      };
      this.eventList.push(event);
    }
    for (let eventObj of TOP_EVENTS){
      const event: Event = {
        id: eventObj.id,
        name: eventObj.name,
        eventType: eventObj.eventType,
        organizer: eventObj.organizer,
        description: eventObj.description,
        maxParticipants: eventObj.maxParticipants,
        isOpen: eventObj.isOpen,
        date: eventObj.date,
        location: eventObj.location,
        rating: eventObj.rating
      };
      this.topEventList.push(event);
    }
  }

  getAll(): Observable<Event[]> {
    return of(this.eventList);
  }

  getTop(): Observable<Event[]> {
    return of(this.topEventList);
  }
}
