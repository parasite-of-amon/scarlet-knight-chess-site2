import type { 
  UpcomingEvent, 
  PastEvent, 
  PastEventWinner, 
  CalendarEvent,
  InsertUpcomingEvent,
  InsertPastEvent,
  InsertPastEventWinner,
  InsertCalendarEvent,
  PastEventWithWinners,
  AdminUser,
  InsertAdminUser,
  UnifiedEvent,
  InsertUnifiedEvent,
  Sponsor,
  InsertSponsor,
  SponsorFlyer,
  InsertSponsorFlyer,
  AboutContent,
  InsertAboutContent
} from "@shared/schema";

export interface IStorage {
  verifyAdmin(username: string, password: string): Promise<AdminUser | null>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;

  getUnifiedEvents(): Promise<UnifiedEvent[]>;
  addUnifiedEvent(event: InsertUnifiedEvent): Promise<UnifiedEvent>;
  updateUnifiedEvent(id: string | number, event: Partial<InsertUnifiedEvent>): Promise<void>;
  deleteUnifiedEvent(id: string | number): Promise<void>;

  getSponsors(): Promise<Sponsor[]>;
  addSponsor(sponsor: InsertSponsor): Promise<Sponsor>;
  updateSponsor(id: string | number, sponsor: Partial<InsertSponsor>): Promise<void>;
  deleteSponsor(id: string | number): Promise<void>;

  getSponsorFlyer(): Promise<SponsorFlyer | null>;
  setSponsorFlyer(flyer: InsertSponsorFlyer): Promise<SponsorFlyer>;

  getAboutContent(section: string): Promise<AboutContent | null>;
  getAllAboutContent(): Promise<AboutContent[]>;
  setAboutContent(content: InsertAboutContent): Promise<AboutContent>;
  updateAboutContent(id: string | number, content: Partial<InsertAboutContent>): Promise<void>;

  getUpcomingEvents(): Promise<UpcomingEvent[]>;
  getPastEvents(): Promise<PastEventWithWinners[]>;
  getCalendarEvents(): Promise<CalendarEvent[]>;

  addUpcomingEvent(event: InsertUpcomingEvent): Promise<UpcomingEvent>;
  addPastEvent(event: InsertPastEvent, winners?: InsertPastEventWinner[]): Promise<PastEventWithWinners>;
  addCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;

  updateUpcomingEvent(id: string | number, event: Partial<InsertUpcomingEvent>): Promise<void>;
  updatePastEvent(id: string | number, event: Partial<InsertPastEvent>, winners?: InsertPastEventWinner[]): Promise<void>;
  updateCalendarEvent(id: string | number, event: Partial<InsertCalendarEvent>): Promise<void>;

  deleteUpcomingEvent(id: string | number): Promise<void>;
  deletePastEvent(id: string | number): Promise<void>;
  deleteCalendarEvent(id: string | number): Promise<void>;
}

export class MemStorage implements IStorage {
  private adminUsers: AdminUser[] = [];
  private unifiedEvents: UnifiedEvent[] = [];
  private sponsors: Sponsor[] = [];
  private sponsorFlyer: SponsorFlyer | null = null;
  private aboutContent: AboutContent[] = [];
  private upcomingEvents: UpcomingEvent[] = [];
  private pastEvents: PastEvent[] = [];
  private pastEventWinners: PastEventWinner[] = [];
  private calendarEvents: CalendarEvent[] = [];
  private nextAdminId = 1;
  private nextUnifiedEventId = 1;
  private nextSponsorId = 1;
  private nextSponsorFlyerId = 1;
  private nextAboutContentId = 1;
  private nextUpcomingId = 1;
  private nextPastEventId = 1;
  private nextWinnerId = 1;
  private nextCalendarId = 1;
  
  constructor() {
    this.createAdmin({ username: "admin", password: "RutgersChessClub@123" });
  }
  
  async verifyAdmin(username: string, password: string): Promise<AdminUser | null> {
    const admin = this.adminUsers.find(a => a.username === username && a.password === password);
    return admin || null;
  }
  
  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const newAdmin: AdminUser = {
      id: this.nextAdminId++,
      ...admin,
    };
    this.adminUsers.push(newAdmin);
    return newAdmin;
  }
  
  async getUnifiedEvents(): Promise<UnifiedEvent[]> {
    return [...this.unifiedEvents];
  }
  
  private parseEventDate(dateString: string): Date | null {
    const formats = [
      /^(\w+)\s+(\d+),\s+(\d{4})$/,
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      /^(\d{4})-(\d{2})-(\d{2})$/,
    ];
    
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch {
      return null;
    }
    
    return null;
  }
  
  private categorizeEvent(event: InsertUnifiedEvent): 'upcoming' | 'past' {
    if (event.isRecurring) {
      return 'upcoming';
    }
    
    const eventDate = this.parseEventDate(event.date);
    if (!eventDate) {
      return 'upcoming';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    return eventDate < today ? 'past' : 'upcoming';
  }

  async addUnifiedEvent(event: InsertUnifiedEvent): Promise<UnifiedEvent> {
    const newEvent: UnifiedEvent = {
      id: this.nextUnifiedEventId++,
      ...event,
      isRecurring: event.isRecurring ?? false,
    };
    this.unifiedEvents.push(newEvent);
    
    const category = this.categorizeEvent(event);
    
    if (category === 'upcoming') {
      await this.addUpcomingEvent({
        title: event.title,
        date: event.date,
        time: event.time ?? null,
        location: event.location ?? null,
        description: event.description ?? null,
        imagePaths: event.imagePaths ?? null,
        isRecurring: event.isRecurring ?? false,
        recurrencePattern: event.recurrencePattern ?? null,
      });
      
      await this.addCalendarEvent({
        title: event.title,
        date: event.date,
        time: event.time ?? null,
        location: event.location ?? null,
        description: event.description ?? null,
        eventType: "meeting",
        colorCode: "green",
        imagePaths: event.imagePaths ?? null,
        isRecurring: event.isRecurring ?? false,
        recurrencePattern: event.recurrencePattern ?? null,
      });
    } else {
      let winners: any[] = [];
      if (event.winners) {
        try {
          winners = JSON.parse(event.winners);
        } catch (e) {
          winners = [];
        }
      }
      
      await this.addPastEvent({
        title: event.title,
        date: event.date,
        participants: event.participants ?? null,
        rounds: event.rounds ?? null,
        rating: event.rating ?? null,
        description: event.description ?? null,
        imagePaths: event.imagePaths ?? null,
      }, winners);
      
      await this.addCalendarEvent({
        title: event.title,
        date: event.date,
        time: event.time ?? null,
        location: event.location ?? null,
        description: event.description ?? null,
        eventType: "tournament",
        colorCode: "blue",
        imagePaths: event.imagePaths ?? null,
        isRecurring: false,
        recurrencePattern: null,
      });
    }
    
    return newEvent;
  }
  
  async updateUnifiedEvent(id: number, updates: Partial<InsertUnifiedEvent>): Promise<void> {
    const index = this.unifiedEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.unifiedEvents[index] = { ...this.unifiedEvents[index], ...updates };
      
      const updatedEvent = this.unifiedEvents[index];
      const category = this.categorizeEvent(updatedEvent);
      
      this.upcomingEvents = this.upcomingEvents.filter(e => e.title !== updatedEvent.title || e.date !== updatedEvent.date);
      this.pastEvents = this.pastEvents.filter(e => e.title !== updatedEvent.title || e.date !== updatedEvent.date);
      this.calendarEvents = this.calendarEvents.filter(e => e.title !== updatedEvent.title || e.date !== updatedEvent.date);
      
      if (category === 'upcoming') {
        await this.addUpcomingEvent({
          title: updatedEvent.title,
          date: updatedEvent.date,
          time: updatedEvent.time ?? null,
          location: updatedEvent.location ?? null,
          description: updatedEvent.description ?? null,
          imagePaths: updatedEvent.imagePaths ?? null,
          isRecurring: updatedEvent.isRecurring ?? false,
          recurrencePattern: updatedEvent.recurrencePattern ?? null,
        });
        
        await this.addCalendarEvent({
          title: updatedEvent.title,
          date: updatedEvent.date,
          time: updatedEvent.time ?? null,
          location: updatedEvent.location ?? null,
          description: updatedEvent.description ?? null,
          eventType: "meeting",
          colorCode: "green",
          imagePaths: updatedEvent.imagePaths ?? null,
          isRecurring: updatedEvent.isRecurring ?? false,
          recurrencePattern: updatedEvent.recurrencePattern ?? null,
        });
      } else {
        let winners: any[] = [];
        if (updatedEvent.winners) {
          try {
            winners = JSON.parse(updatedEvent.winners);
          } catch (e) {
            winners = [];
          }
        }
        
        await this.addPastEvent({
          title: updatedEvent.title,
          date: updatedEvent.date,
          participants: updatedEvent.participants ?? null,
          rounds: updatedEvent.rounds ?? null,
          rating: updatedEvent.rating ?? null,
          description: updatedEvent.description ?? null,
          imagePaths: updatedEvent.imagePaths ?? null,
        }, winners);
        
        await this.addCalendarEvent({
          title: updatedEvent.title,
          date: updatedEvent.date,
          time: updatedEvent.time ?? null,
          location: updatedEvent.location ?? null,
          description: updatedEvent.description ?? null,
          eventType: "tournament",
          colorCode: "blue",
          imagePaths: updatedEvent.imagePaths ?? null,
          isRecurring: false,
          recurrencePattern: null,
        });
      }
    }
  }
  
  async deleteUnifiedEvent(id: number): Promise<void> {
    const event = this.unifiedEvents.find(e => e.id === id);
    if (event) {
      this.upcomingEvents = this.upcomingEvents.filter(e => e.title !== event.title || e.date !== event.date);
      this.pastEvents = this.pastEvents.filter(e => e.title !== event.title || e.date !== event.date);
      this.calendarEvents = this.calendarEvents.filter(e => e.title !== event.title || e.date !== event.date);
    }
    this.unifiedEvents = this.unifiedEvents.filter(e => e.id !== id);
  }
  
  async getSponsors(): Promise<Sponsor[]> {
    return [...this.sponsors].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  
  async addSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
    const newSponsor: Sponsor = {
      id: this.nextSponsorId++,
      ...sponsor,
      order: sponsor.order ?? 0,
    };
    this.sponsors.push(newSponsor);
    return newSponsor;
  }
  
  async updateSponsor(id: number, updates: Partial<InsertSponsor>): Promise<void> {
    const index = this.sponsors.findIndex(s => s.id === id);
    if (index !== -1) {
      this.sponsors[index] = { ...this.sponsors[index], ...updates };
    }
  }
  
  async deleteSponsor(id: number): Promise<void> {
    this.sponsors = this.sponsors.filter(s => s.id !== id);
  }
  
  async getSponsorFlyer(): Promise<SponsorFlyer | null> {
    return this.sponsorFlyer;
  }
  
  async setSponsorFlyer(flyer: InsertSponsorFlyer): Promise<SponsorFlyer> {
    const newFlyer: SponsorFlyer = {
      id: this.nextSponsorFlyerId++,
      ...flyer,
    };
    this.sponsorFlyer = newFlyer;
    return newFlyer;
  }
  
  async getAboutContent(section: string): Promise<AboutContent | null> {
    return this.aboutContent.find(c => c.section === section) || null;
  }
  
  async getAllAboutContent(): Promise<AboutContent[]> {
    return [...this.aboutContent];
  }
  
  async setAboutContent(content: InsertAboutContent): Promise<AboutContent> {
    const existing = this.aboutContent.findIndex(c => c.section === content.section);
    if (existing !== -1) {
      this.aboutContent[existing] = { ...this.aboutContent[existing], ...content };
      return this.aboutContent[existing];
    } else {
      const newContent: AboutContent = {
        id: this.nextAboutContentId++,
        ...content,
      };
      this.aboutContent.push(newContent);
      return newContent;
    }
  }
  
  async updateAboutContent(id: number, updates: Partial<InsertAboutContent>): Promise<void> {
    const index = this.aboutContent.findIndex(c => c.id === id);
    if (index !== -1) {
      this.aboutContent[index] = { ...this.aboutContent[index], ...updates };
    }
  }

  async getUpcomingEvents(): Promise<UpcomingEvent[]> {
    return [...this.upcomingEvents];
  }

  async getPastEvents(): Promise<PastEventWithWinners[]> {
    return this.pastEvents.map(event => ({
      ...event,
      winners: this.pastEventWinners.filter(w => w.pastEventId === event.id)
    }));
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return [...this.calendarEvents];
  }

  async addUpcomingEvent(event: InsertUpcomingEvent): Promise<UpcomingEvent> {
    const newEvent: UpcomingEvent = {
      id: this.nextUpcomingId++,
      ...event,
      isRecurring: event.isRecurring ?? false,
    };
    this.upcomingEvents.push(newEvent);
    return newEvent;
  }

  async addPastEvent(event: InsertPastEvent, winners: InsertPastEventWinner[] = []): Promise<PastEventWithWinners> {
    const newEvent: PastEvent = {
      id: this.nextPastEventId++,
      ...event,
    };
    this.pastEvents.push(newEvent);

    const newWinners: PastEventWinner[] = winners.map(w => ({
      id: this.nextWinnerId++,
      pastEventId: newEvent.id,
      ...w,
    }));
    this.pastEventWinners.push(...newWinners);

    return {
      ...newEvent,
      winners: newWinners,
    };
  }

  async addCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const newEvent: CalendarEvent = {
      id: this.nextCalendarId++,
      ...event,
      eventType: event.eventType ?? "meeting",
      colorCode: event.colorCode ?? "green",
      isRecurring: event.isRecurring ?? false,
    };
    this.calendarEvents.push(newEvent);
    return newEvent;
  }

  async updateUpcomingEvent(id: number, updates: Partial<InsertUpcomingEvent>): Promise<void> {
    const index = this.upcomingEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.upcomingEvents[index] = { ...this.upcomingEvents[index], ...updates };
    }
  }

  async updatePastEvent(id: number, updates: Partial<InsertPastEvent>, winners?: InsertPastEventWinner[]): Promise<void> {
    const index = this.pastEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.pastEvents[index] = { ...this.pastEvents[index], ...updates };
    }

    if (winners !== undefined) {
      this.pastEventWinners = this.pastEventWinners.filter(w => w.pastEventId !== id);
      const newWinners: PastEventWinner[] = winners.map(w => ({
        id: this.nextWinnerId++,
        pastEventId: id,
        ...w,
      }));
      this.pastEventWinners.push(...newWinners);
    }
  }

  async updateCalendarEvent(id: number, updates: Partial<InsertCalendarEvent>): Promise<void> {
    const index = this.calendarEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.calendarEvents[index] = { ...this.calendarEvents[index], ...updates };
    }
  }

  async deleteUpcomingEvent(id: number): Promise<void> {
    this.upcomingEvents = this.upcomingEvents.filter(e => e.id !== id);
  }

  async deletePastEvent(id: number): Promise<void> {
    this.pastEvents = this.pastEvents.filter(e => e.id !== id);
    this.pastEventWinners = this.pastEventWinners.filter(w => w.pastEventId !== id);
  }

  async deleteCalendarEvent(id: number): Promise<void> {
    this.calendarEvents = this.calendarEvents.filter(e => e.id !== id);
  }

  async seedData(): Promise<void> {
    if (this.upcomingEvents.length > 0) return;

    await this.addUpcomingEvent({
      title: "Weekly Meeting",
      date: "Every Tuesday",
      time: "7:00 PM - 9:00 PM",
      location: "Busch Student Center - Food Court",
      description: "Casual games, practice, and chess discussion",
      imagePaths: null,
      isRecurring: true,
      recurrencePattern: "weekly_tuesday"
    });

    await this.addUpcomingEvent({
      title: "Weekly Meeting",
      date: "Every Friday",
      time: "7:00 PM - 9:00 PM",
      location: "Busch Student Center - The Cove or Food Court",
      description: "Casual games, practice, and chess discussion",
      imagePaths: null,
      isRecurring: true,
      recurrencePattern: "weekly_friday"
    });

    await this.addPastEvent({
      title: "Spring 2023 Blitz Tournament",
      date: "May 7, 2023",
      participants: "18 participants",
      rounds: "5 rounds",
      rating: "USCF Rated",
      description: null,
      imagePaths: null,
    }, [
      { pastEventId: 0, place: "1st", name: "Ansh Shah", score: "5-0" },
      { pastEventId: 0, place: "2nd", name: "Joaquin Carlson", score: "4-1" },
      { pastEventId: 0, place: "3rd", name: "Jouan Yu", score: "3.5-1.5" },
    ]);

    await this.addPastEvent({
      title: "Fall 2023 Blitz Tournament",
      date: "November 11, 2023",
      participants: "16 participants",
      rounds: "7 rounds",
      rating: "USCF Rated",
      description: null,
      imagePaths: null,
    }, [
      { pastEventId: 0, place: "1st", name: "Aravind Kumar", score: "7-0" },
      { pastEventId: 0, place: "2nd (tie)", name: "Lev Zilbermintz & Ansh Shah", score: "5-2" },
      { pastEventId: 0, place: "3rd", name: "Jatin Thakkar", score: "4.5-2.5" },
      { pastEventId: 0, place: "Unrated Winner", name: "Joe", score: "" },
    ]);

    await this.addPastEvent({
      title: "US Amateur Team East 2023",
      date: "February 2023",
      participants: "Team Event",
      rounds: null,
      rating: null,
      description: "Rutgers Chess Club participated in this prestigious team tournament.",
      imagePaths: null,
    });

    await this.addCalendarEvent({
      title: "Tuesday Meetings",
      date: "Every Tuesday",
      time: "7:00 PM - 9:00 PM",
      location: "Busch Student Center - Food Court",
      description: "Casual games, practice, and chess discussion",
      eventType: "meeting",
      colorCode: "green",
      imagePaths: null,
      isRecurring: true,
      recurrencePattern: "weekly_tuesday"
    });

    await this.addCalendarEvent({
      title: "Friday Meetings",
      date: "Every Friday",
      time: "7:00 PM - 9:00 PM",
      location: "Busch Student Center - The Cove or Food Court",
      description: "Casual games, practice, and chess discussion",
      eventType: "meeting",
      colorCode: "green",
      imagePaths: null,
      isRecurring: true,
      recurrencePattern: "weekly_friday"
    });
  }
}

export const storage = new MemStorage();
