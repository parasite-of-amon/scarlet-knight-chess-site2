import { Event } from './eventTypes';

const STORAGE_KEY = 'rutgers_chess_events';

// Seed data with Unsplash chess tournament photos
const seedEvents: Event[] = [
  {
    id: '1',
    slug: 'fall-championship-2025',
    title: 'Fall Championship Tournament',
    description: 'Join us for our annual Fall Championship! This prestigious tournament brings together the best chess players from Rutgers and surrounding universities. Compete for trophies, prizes, and the title of Fall Champion.',
    date: '2025-12-15',
    timeStart: '10:00',
    timeEnd: '18:00',
    location: 'Busch Campus Center, Room 250',
    images: ['https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1600&h=900&fit=crop'],
    winnersImage: 'https://images.unsplash.com/photo-1624953587687-766d32c8a7f8?w=1600&h=900&fit=crop',
    participants: 32,
    rounds: 5,
    rating: 'USCF',
    status: 'past',
    tags: ['Tournament', 'Championship', 'USCF'],
    links: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'weekly-blitz-dec-20',
    title: 'Weekly Blitz Night',
    description: 'Fast-paced blitz chess every Friday! Sharpen your tactics and quick thinking in our friendly blitz tournament format. All skill levels welcome.',
    date: '2025-12-20',
    timeStart: '19:00',
    timeEnd: '21:00',
    location: 'Student Center, Game Room',
    images: ['https://images.unsplash.com/photo-1551817958-20bcb27333b0?w=1600&h=900&fit=crop'],
    participants: 18,
    rounds: 5,
    status: 'upcoming',
    isRecurring: true,
    tags: ['Blitz', 'Weekly', 'Casual'],
    links: {
      registration: {
        url: 'https://forms.gle/example',
        label: 'Register Now',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    slug: 'spring-open-2025',
    title: 'Spring Open Tournament',
    description: 'Kick off the spring semester with our largest tournament of the year! Open to all Rutgers students, faculty, and community members. USCF rated with cash prizes for top finishers.',
    date: '2026-02-15',
    timeStart: '09:00',
    timeEnd: '19:00',
    location: 'College Avenue Student Center',
    images: ['https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1600&h=900&fit=crop'],
    participants: 45,
    rounds: 6,
    rating: 'USCF',
    status: 'upcoming',
    tags: ['Tournament', 'Open', 'USCF', 'Prizes'],
    links: {
      registration: {
        url: 'https://forms.gle/example2',
        label: 'Early Bird Registration',
      },
      info: {
        url: 'https://rutgerschess.org/spring-open',
        label: 'Tournament Details',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    slug: 'beginner-workshop-oct',
    title: 'Beginner Chess Workshop',
    description: 'Never played chess before? No problem! Join our friendly workshop where we teach the basics, from piece movement to simple tactics. Boards and pieces provided.',
    date: '2025-10-10',
    timeStart: '14:00',
    timeEnd: '16:00',
    location: 'Livingston Student Center, Room 101',
    images: ['https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1600&h=900&fit=crop'],
    status: 'past',
    tags: ['Workshop', 'Beginner', 'Social'],
    links: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    slug: 'team-championship-nov',
    title: 'Rutgers Team Championship',
    description: 'Form teams of 4 players and compete for the team championship trophy! This unique format encourages collaboration and strategy across multiple boards.',
    date: '2025-11-20',
    timeStart: '11:00',
    timeEnd: '17:00',
    location: 'Busch Campus Center',
    images: ['https://images.unsplash.com/photo-1611195974226-ef7f1a2e6e7b?w=1600&h=900&fit=crop'],
    winnersImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1600&h=900&fit=crop',
    participants: 24,
    rounds: 4,
    rating: 'USCF',
    status: 'past',
    tags: ['Tournament', 'Team', 'USCF'],
    links: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    slug: 'chess-social-mixer',
    title: 'Chess Social Mixer',
    description: 'Meet fellow chess enthusiasts in a relaxed, casual setting. Casual games, snacks, and great conversation. Perfect for making new friends who share your passion for chess!',
    date: '2026-01-25',
    timeStart: '18:00',
    timeEnd: '20:00',
    location: 'College Avenue Student Center Lounge',
    images: ['https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=1600&h=900&fit=crop'],
    status: 'upcoming',
    tags: ['Social', 'Casual', 'Mixer'],
    links: {
      info: {
        url: 'https://rutgerschess.org/social',
        label: 'Event Info',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    slug: 'bullet-madness-sep',
    title: 'Bullet Chess Madness',
    description: 'Lightning-fast 1-minute games! Test your nerves and instincts in this adrenaline-pumping bullet tournament. Who has the fastest hands?',
    date: '2025-09-15',
    timeStart: '19:00',
    timeEnd: '21:00',
    location: 'Student Center',
    images: ['https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=1600&h=900&fit=crop'],
    winnersImage: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=1600&h=900&fit=crop',
    participants: 20,
    rounds: 7,
    status: 'past',
    tags: ['Bullet', 'Speed', 'Tournament'],
    links: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    slug: 'grandmaster-simul',
    title: 'Grandmaster Simultaneous Exhibition',
    description: 'A rare opportunity to play against a Grandmaster! Our visiting GM will play against 20+ players simultaneously. Sign up early - spots fill fast!',
    date: '2026-03-10',
    timeStart: '15:00',
    timeEnd: '19:00',
    location: 'Busch Campus Center Ballroom',
    images: ['https://images.unsplash.com/photo-1560759645-45f97b14be26?w=1600&h=900&fit=crop'],
    participants: 25,
    status: 'upcoming',
    tags: ['Exhibition', 'Grandmaster', 'Special'],
    links: {
      registration: {
        url: 'https://forms.gle/gm-simul',
        label: 'Register for Simul',
      },
      info: {
        url: 'https://rutgerschess.org/gm-visit',
        label: 'About the GM',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    slug: 'rapid-tournament-oct',
    title: 'October Rapid Tournament',
    description: 'Classic rapid chess with 25+10 time control. Perfect balance between thoughtful play and exciting action. USCF rated event with prizes for top 3.',
    date: '2025-10-28',
    timeStart: '10:00',
    timeEnd: '17:00',
    location: 'Livingston Student Center',
    images: ['https://images.unsplash.com/photo-1568330955993-c92d49d9dee5?w=1600&h=900&fit=crop'],
    winnersImage: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1600&h=900&fit=crop',
    participants: 28,
    rounds: 5,
    rating: 'USCF',
    status: 'past',
    tags: ['Tournament', 'Rapid', 'USCF'],
    links: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    slug: 'chess-tactics-masterclass',
    title: 'Chess Tactics Masterclass',
    description: 'Learn advanced tactical patterns from our club experts. Interactive session covering pins, forks, skewers, and more. Includes practice puzzles and Q&A.',
    date: '2026-01-15',
    timeStart: '16:00',
    timeEnd: '18:00',
    location: 'College Avenue Student Center, Room 203',
    images: ['https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=1600&h=900&fit=crop'],
    status: 'upcoming',
    tags: ['Workshop', 'Education', 'Tactics'],
    links: {
      resource: {
        url: 'https://rutgerschess.org/tactics-guide',
        label: 'Tactics Study Guide',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '11',
    slug: 'weekly-blitz-dec-27',
    title: 'Weekly Blitz Night',
    description: 'Fast-paced blitz chess every Friday! Sharpen your tactics and quick thinking in our friendly blitz tournament format. All skill levels welcome.',
    date: '2025-12-27',
    timeStart: '19:00',
    timeEnd: '21:00',
    location: 'Student Center, Game Room',
    images: ['https://images.unsplash.com/photo-1551817958-20bcb27333b0?w=1600&h=900&fit=crop'],
    participants: 16,
    rounds: 5,
    status: 'upcoming',
    isRecurring: true,
    tags: ['Blitz', 'Weekly', 'Casual'],
    links: {
      registration: {
        url: 'https://forms.gle/example',
        label: 'Register Now',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    slug: 'endgame-workshop-feb',
    title: 'Endgame Excellence Workshop',
    description: 'Master the endgame! Learn essential king and pawn endings, rook endgames, and theoretical positions that every player should know.',
    date: '2026-02-20',
    timeStart: '17:00',
    timeEnd: '19:00',
    location: 'Busch Campus Center, Room 150',
    images: ['https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=1600&h=900&fit=crop'],
    status: 'upcoming',
    tags: ['Workshop', 'Education', 'Endgame'],
    links: {
      resource: {
        url: 'https://rutgerschess.org/endgame-theory',
        label: 'Endgame Theory PDF',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class EventsStorage {
  private initialized = false;

  private initialize() {
    if (this.initialized) return;

    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedEvents));
    }
    this.initialized = true;
  }

  getAllEvents(): Event[] {
    this.initialize();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getEventById(id: string): Event | null {
    const events = this.getAllEvents();
    return events.find(e => e.id === id) || null;
  }

  getEventBySlug(slug: string): Event | null {
    const events = this.getAllEvents();
    return events.find(e => e.slug === slug) || null;
  }

  createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event {
    const events = this.getAllEvents();
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    events.push(newEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<Event>): Event | null {
    const events = this.getAllEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;

    events[index] = {
      ...events[index],
      ...updates,
      id: events[index].id,
      createdAt: events[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return events[index];
  }

  deleteEvent(id: string): boolean {
    const events = this.getAllEvents();
    const filtered = events.filter(e => e.id !== id);
    if (filtered.length === events.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  getUpcomingEvents(): Event[] {
    return this.getAllEvents()
      .filter(e => e.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getPastEvents(): Event[] {
    return this.getAllEvents()
      .filter(e => e.status === 'past')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

export const eventsStorage = new EventsStorage();
