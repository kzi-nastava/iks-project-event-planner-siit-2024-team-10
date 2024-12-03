import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from './model/event.model';

const TOP_EVENTS: Event[] = [
  {
    id: 1,
    name: 'Tech Innovation Summit',
    eventType: { id: 1, name: 'Conference' },
    organizer: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      location: {
        id: 1,
        country: 'USA',
        city: 'San Francisco',
        street: 'Tech Blvd',
        houseNumber: '123',
      },
      email: 'johndoe@techworld.com',
      phoneNumber: '+123456789',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'An annual gathering of industry leaders discussing the latest in technology, innovation, and startups.',
    maxParticipants: 500,
    isOpen: true,
    date: new Date('2024-12-10T09:00:00'),
    location: {
      id: 2,
      country: 'USA',
      city: 'San Francisco',
      street: 'Event Street',
      houseNumber: '456',
    },
    rating: 4.8,
    agenda:[
      {id:1,name:'Ceremony',description:'The official wedding ceremony where the couple exchanges vows.',startTime:'2:00 PM',endTime:'3:00 PM',location:'Rose Garden'},
      {id:2,name:'Cocktail hour',description:'A relaxed gathering with drinks and appetizers for guests to mingle before the reception.',startTime:'3:00 PM',endTime:'4:00 PM',location:'Garden Terrace'}
    ]
  },
  {
    id: 2,
    name: 'Global Health Conference',
    eventType: { id: 2, name: 'Seminar' },
    organizer: {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      location: {
        id: 3,
        country: 'Switzerland',
        city: 'Geneva',
        street: 'Health Ave',
        houseNumber: '78',
      },
      email: 'jane.smith@who.org',
      phoneNumber: '+987654321',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'A global seminar bringing together experts to discuss new health strategies and medical breakthroughs.',
    maxParticipants: 300,
    isOpen: true,
    date: new Date('2024-11-15T08:00:00'),
    location: {
      id: 4,
      country: 'Switzerland',
      city: 'Geneva',
      street: 'Conference Rd',
      houseNumber: '22',
    },
    rating: 4.7,
    agenda: [
      { id: 1, name: 'Opening Keynote', description: 'Welcoming speech by the organizer.', startTime: '9:00 AM', endTime: '10:00 AM', location: 'Main Hall' },
      { id: 2, name: 'Panel Discussion', description: 'Experts discuss emerging trends in technology.', startTime: '10:30 AM', endTime: '12:00 PM', location: 'Conference Room A' },
    ]
  },
  {
    id: 3,
    name: 'Summer Music Festival',
    eventType: { id: 3, name: 'Festival' },
    organizer: {
      id: 3,
      firstName: 'Mark',
      lastName: 'Johnson',
      location: {
        id: 5,
        country: 'USA',
        city: 'Los Angeles',
        street: 'Music Way',
        houseNumber: '88',
      },
      email: 'mark.johnson@livenation.com',
      phoneNumber: '+123987654',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'A weekend of live performances featuring top artists from around the world in various music genres.',
    maxParticipants: 10000,
    isOpen: true,
    date: new Date('2025-06-20T12:00:00'),
    location: {
      id: 6,
      country: 'USA',
      city: 'Los Angeles',
      street: 'Festival Grounds',
      houseNumber: '99',
    },
    rating: 4.9,
    agenda: [
      { id: 1, name: 'Registration & Breakfast', description: 'Guests register and network over breakfast.', startTime: '8:00 AM', endTime: '9:00 AM', location: 'Lobby' },
      { id: 2, name: 'Keynote: Innovations in Global Health', description: 'Discussion on breakthroughs in healthcare.', startTime: '9:30 AM', endTime: '11:00 AM', location: 'Auditorium' },
    ],
  },
  {
    id: 4,
    name: 'Foodie Expo 2024',
    eventType: { id: 4, name: 'Exhibition' },
    organizer: {
      id: 4,
      firstName: 'Emily',
      lastName: 'Brown',
      location: {
        id: 7,
        country: 'USA',
        city: 'New York',
        street: 'Food St',
        houseNumber: '50',
      },
      email: 'emily.brown@foodnetwork.com',
      phoneNumber: '+123111222',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'A food lover’s paradise with the best chefs, restaurants, and food brands showcasing their latest offerings.',
    maxParticipants: 2000,
    isOpen: true,
    date: new Date('2024-12-05T10:00:00'),
    location: {
      id: 8,
      country: 'USA',
      city: 'New York',
      street: 'Expo Blvd',
      houseNumber: '12',
    },
    rating: 4.5,
    agenda: [
      { id: 1, name: 'Opening Act', description: 'A performance by a rising star.', startTime: '12:00 PM', endTime: '1:00 PM', location: 'Main Stage' },
      { id: 2, name: 'Headline Performance', description: 'A concert by the main artist of the evening.', startTime: '8:00 PM', endTime: '10:00 PM', location: 'Main Stage' },
    ],
  },
  {
    id: 5,
    name: 'Space Exploration Symposium',
    eventType: { id: 5, name: 'Conference' },
    organizer: {
      id: 5,
      firstName: 'Sarah',
      lastName: 'Connor',
      location: {
        id: 9,
        country: 'USA',
        city: 'Houston',
        street: 'Space Rd',
        houseNumber: '101',
      },
      email: 'sarah.connor@nasa.com',
      phoneNumber: '+123444555',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'A symposium discussing the latest advancements in space exploration and research.',
    maxParticipants: 500,
    isOpen: true,
    date: new Date('2025-01-10T09:00:00'),
    location: {
      id: 10,
      country: 'USA',
      city: 'Houston',
      street: 'Research Dr',
      houseNumber: '25',
    },
    rating: 4.8,
    agenda: [
      { id: 1, name: 'Registration & Breakfast', description: 'Guests register and network over breakfast.', startTime: '8:00 AM', endTime: '9:00 AM', location: 'Lobby' },
      { id: 2, name: 'Keynote: Innovations in Global Health', description: 'Discussion on breakthroughs in healthcare.', startTime: '9:30 AM', endTime: '11:00 AM', location: 'Auditorium' },
    ],
  },
];

const EVENTS: Event[] = [
  {
    id: 1,
    name: 'Tech Innovation Summit',
    eventType: { id: 1, name: 'Conference' },
    organizer: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      location: {
        id: 1,
        country: 'USA',
        city: 'San Francisco',
        street: 'Tech Blvd',
        houseNumber: '123',
      },
      email: 'johndoe@techworld.com',
      phoneNumber: '+123456789',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'An annual gathering of industry leaders discussing the latest in technology, innovation, and startups.',
    maxParticipants: 500,
    isOpen: true,
    date: new Date('2024-12-10T09:00:00'),
    location: {
      id: 2,
      country: 'USA',
      city: 'San Francisco',
      street: 'Event Street',
      houseNumber: '456',
    },
    rating: 4.8,
    agenda:[
      {id:1,name:'Ceremony',description:'The official wedding ceremony where the couple exchanges vows.',startTime:'2:00 PM',endTime:'3:00 PM',location:'Rose Garden'},
      {id:2,name:'Cocktail hour',description:'A relaxed gathering with drinks and appetizers for guests to mingle before the reception.',startTime:'3:00 PM',endTime:'4:00 PM',location:'Garden Terrace'}
    ]
  },
  {
    id: 2,
    name: 'Global Health Conference',
    eventType: { id: 2, name: 'Seminar' },
    organizer: {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      location: {
        id: 3,
        country: 'Switzerland',
        city: 'Geneva',
        street: 'Health Ave',
        houseNumber: '78',
      },
      email: 'jane.smith@who.org',
      phoneNumber: '+987654321',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'A global seminar bringing together experts to discuss new health strategies and medical breakthroughs.',
    maxParticipants: 300,
    isOpen: true,
    date: new Date('2024-11-15T08:00:00'),
    location: {
      id: 4,
      country: 'Switzerland',
      city: 'Geneva',
      street: 'Conference Rd',
      houseNumber: '22',
    },
    rating: 4.7,
    agenda: [
      { id: 1, name: 'Opening Keynote', description: 'Welcoming speech by the organizer.', startTime: '9:00 AM', endTime: '10:00 AM', location: 'Main Hall' },
      { id: 2, name: 'Panel Discussion', description: 'Experts discuss emerging trends in technology.', startTime: '10:30 AM', endTime: '12:00 PM', location: 'Conference Room A' },
    ]
  },
  {
    id: 3,
    name: 'Summer Music Festival',
    eventType: { id: 3, name: 'Festival' },
    organizer: {
      id: 3,
      firstName: 'Mark',
      lastName: 'Johnson',
      location: {
        id: 5,
        country: 'USA',
        city: 'Los Angeles',
        street: 'Music Way',
        houseNumber: '88',
      },
      email: 'mark.johnson@livenation.com',
      phoneNumber: '+123987654',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'A weekend of live performances featuring top artists from around the world in various music genres.',
    maxParticipants: 10000,
    isOpen: true,
    date: new Date('2025-06-20T12:00:00'),
    location: {
      id: 6,
      country: 'USA',
      city: 'Los Angeles',
      street: 'Festival Grounds',
      houseNumber: '99',
    },
    rating: 4.9,
    agenda: [
      { id: 1, name: 'Registration & Breakfast', description: 'Guests register and network over breakfast.', startTime: '8:00 AM', endTime: '9:00 AM', location: 'Lobby' },
      { id: 2, name: 'Keynote: Innovations in Global Health', description: 'Discussion on breakthroughs in healthcare.', startTime: '9:30 AM', endTime: '11:00 AM', location: 'Auditorium' },
    ],
  },
  {
    id: 4,
    name: 'Foodie Expo 2024',
    eventType: { id: 4, name: 'Exhibition' },
    organizer: {
      id: 4,
      firstName: 'Emily',
      lastName: 'Brown',
      location: {
        id: 7,
        country: 'USA',
        city: 'New York',
        street: 'Food St',
        houseNumber: '50',
      },
      email: 'emily.brown@foodnetwork.com',
      phoneNumber: '+123111222',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'A food lover’s paradise with the best chefs, restaurants, and food brands showcasing their latest offerings.',
    maxParticipants: 2000,
    isOpen: true,
    date: new Date('2024-12-05T10:00:00'),
    location: {
      id: 8,
      country: 'USA',
      city: 'New York',
      street: 'Expo Blvd',
      houseNumber: '12',
    },
    rating: 4.5,
    agenda: [
      { id: 1, name: 'Opening Act', description: 'A performance by a rising star.', startTime: '12:00 PM', endTime: '1:00 PM', location: 'Main Stage' },
      { id: 2, name: 'Headline Performance', description: 'A concert by the main artist of the evening.', startTime: '8:00 PM', endTime: '10:00 PM', location: 'Main Stage' },
    ],
  },
  {
    id: 5,
    name: 'Space Exploration Symposium',
    eventType: { id: 5, name: 'Conference' },
    organizer: {
      id: 5,
      firstName: 'Sarah',
      lastName: 'Connor',
      location: {
        id: 9,
        country: 'USA',
        city: 'Houston',
        street: 'Space Rd',
        houseNumber: '101',
      },
      email: 'sarah.connor@nasa.com',
      phoneNumber: '+123444555',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'A symposium discussing the latest advancements in space exploration and research.',
    maxParticipants: 500,
    isOpen: true,
    date: new Date('2025-01-10T09:00:00'),
    location: {
      id: 10,
      country: 'USA',
      city: 'Houston',
      street: 'Research Dr',
      houseNumber: '25',
    },
    rating: 4.8,
    agenda: [
      { id: 1, name: 'Registration & Breakfast', description: 'Guests register and network over breakfast.', startTime: '8:00 AM', endTime: '9:00 AM', location: 'Lobby' },
      { id: 2, name: 'Keynote: Innovations in Global Health', description: 'Discussion on breakthroughs in healthcare.', startTime: '9:30 AM', endTime: '11:00 AM', location: 'Auditorium' },
    ],
  },
  {
    id: 6,
    name: 'Fashion Week Paris',
    eventType: { id: 6, name: 'Runway Show' },
    organizer: {
      id: 6,
      firstName: 'Sophia',
      lastName: 'Lemoine',
      location: {
        id: 11,
        country: 'France',
        city: 'Paris',
        street: 'Fashion Blvd',
        houseNumber: '7',
      },
      email: 'sophia.lemoine@fashionweekparis.com',
      phoneNumber: '+33123456789',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'A world-renowned fashion event showcasing the newest collections from top designers.',
    maxParticipants: 1000,
    isOpen: false,
    date: new Date('2024-10-01T14:00:00'),
    location: {
      id: 12,
      country: 'France',
      city: 'Paris',
      street: 'Runway St',
      houseNumber: '22',
    },
    rating: 5.0,
    agenda: [
      { id: 1, name: 'Opening Keynote', description: 'Welcoming speech by the organizer.', startTime: '9:00 AM', endTime: '10:00 AM', location: 'Main Hall' },
      { id: 2, name: 'Panel Discussion', description: 'Experts discuss emerging trends in technology.', startTime: '10:30 AM', endTime: '12:00 PM', location: 'Conference Room A' },
    ],
  },
  {
    id: 7,
    name: 'Blockchain Revolution Summit',
    eventType: { id: 7, name: 'Conference' },
    organizer: {
      id: 7,
      firstName: 'Alice',
      lastName: 'Miller',
      location: {
        id: 13,
        country: 'UK',
        city: 'London',
        street: 'Crypto Ave',
        houseNumber: '10',
      },
      email: 'alice.miller@cryptoinnovate.com',
      phoneNumber: '+441234567890',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'A summit focused on the future of blockchain technology and its applications in various industries.',
    maxParticipants: 700,
    isOpen: true,
    date: new Date('2024-11-22T09:00:00'),
    location: {
      id: 14,
      country: 'UK',
      city: 'London',
      street: 'Summit Rd',
      houseNumber: '18',
    },
    rating: 4.6,
    agenda: [
      { id: 1, name: 'Opening Keynote', description: 'Welcoming speech by the organizer.', startTime: '9:00 AM', endTime: '10:00 AM', location: 'Main Hall' },
      { id: 2, name: 'Panel Discussion', description: 'Experts discuss emerging trends in technology.', startTime: '10:30 AM', endTime: '12:00 PM', location: 'Conference Room A' },
    ],
  },
  {
    id: 8,
    name: 'International Film Festival',
    eventType: { id: 8, name: 'Festival' },
    organizer: {
      id: 8,
      firstName: 'Francois',
      lastName: 'Dubois',
      location: {
        id: 15,
        country: 'France',
        city: 'Cannes',
        street: 'Film St',
        houseNumber: '5',
      },
      email: 'francois.dubois@cannesfilmfestival.com',
      phoneNumber: '+33199887766',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'An international film festival showcasing groundbreaking films and performances.',
    maxParticipants: 2000,
    isOpen: false,
    date: new Date('2024-05-15T18:00:00'),
    location: {
      id: 16,
      country: 'France',
      city: 'Cannes',
      street: 'Cinema Rd',
      houseNumber: '12',
    },
    rating: 4.9,
    agenda: [
      { id: 1, name: 'Astronomy Panel', description: 'Discussion with top astronomers.', startTime: '9:00 AM', endTime: '11:00 AM', location: 'Galaxy Room' },
      { id: 2, name: 'Future of Space Missions', description: 'Exploration of next-gen spacecraft technologies.', startTime: '1:00 PM', endTime: '3:00 PM', location: 'Mission Hall' },
    ],
  },
  {
    id: 9,
    name: 'Entrepreneurship Expo 2024',
    eventType: { id: 9, name: 'Expo' },
    organizer: {
      id: 9,
      firstName: 'Ethan',
      lastName: 'Wright',
      location: {
        id: 17,
        country: 'USA',
        city: 'Austin',
        street: 'Startup Ave',
        houseNumber: '30',
      },
      email: 'ethan.wright@startupnation.com',
      phoneNumber: '+123777888',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'An expo where entrepreneurs can showcase their startups and find investment opportunities.',
    maxParticipants: 1000,
    isOpen: true,
    date: new Date('2024-12-01T10:00:00'),
    location: {
      id: 18,
      country: 'USA',
      city: 'Austin',
      street: 'Expo Center Rd',
      houseNumber: '44',
    },
    rating: 4.7,
    agenda: [
      { id: 1, name: 'Astronomy Panel', description: 'Discussion with top astronomers.', startTime: '9:00 AM', endTime: '11:00 AM', location: 'Galaxy Room' },
      { id: 2, name: 'Future of Space Missions', description: 'Exploration of next-gen spacecraft technologies.', startTime: '1:00 PM', endTime: '3:00 PM', location: 'Mission Hall' },
    ],
  },
  {
    id: 10,
    name: 'Art Biennale 2025',
    eventType: { id: 10, name: 'Exhibition' },
    organizer: {
      id: 10,
      firstName: 'Laura',
      lastName: 'Gomez',
      location: {
        id: 19,
        country: 'Italy',
        city: 'Venice',
        street: 'Art Way',
        houseNumber: '2',
      },
      email: 'laura.gomez@artbiennale.com',
      phoneNumber: '+39123456789',
      profilePhoto:'https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=612x612&w=0&k=20&c=8ssXDNTp1XAPan8Bg6mJRwG7EXHshFO5o0v9SIj96nY='
    },
    description:
      'An international art exhibition highlighting contemporary artworks from around the world.',
    maxParticipants: 1500,
    isOpen: true,
    date: new Date('2025-04-20T09:00:00'),
    location: {
      id: 20,
      country: 'Italy',
      city: 'Venice',
      street: 'Gallery St',
      houseNumber: '25',
    },
    rating: 4.8,
    agenda: [
      { id: 1, name: 'AI Basics in Medicine', description: 'Introduction to AI concepts and applications in healthcare.', startTime: '9:00 AM', endTime: '11:00 AM', location: 'Room A' },
      { id: 2, name: 'Hands-on Session', description: 'Participants develop basic AI models.', startTime: '11:30 AM', endTime: '1:30 PM', location: 'Lab 1' },
    ],
  },
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
        rating: eventObj.rating,
        agenda:eventObj.agenda
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
        rating: eventObj.rating,
        agenda:eventObj.agenda
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

  getEvent(id:number): Event {
    return this.eventList.at(id-1);
  }
}
