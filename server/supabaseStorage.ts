import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import type {
  AdminUser,
  InsertAdminUser,
  UnifiedEvent,
  InsertUnifiedEvent,
  Sponsor,
  InsertSponsor,
  SponsorFlyer,
  InsertSponsorFlyer,
  AboutContent,
  InsertAboutContent,
  UpcomingEvent,
  InsertUpcomingEvent,
  PastEvent,
  InsertPastEvent,
  InsertPastEventWinner,
  PastEventWithWinners,
  CalendarEvent,
  InsertCalendarEvent
} from "@shared/schema";
import type { IStorage } from "./storage";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class SupabaseStorage implements IStorage {

  async verifyAdmin(username: string, password: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error || !data) {
      console.error('Admin verification error:', error);
      return null;
    }

    const isValid = await bcrypt.compare(password, data.password_hash);
    if (!isValid) {
      console.error('Invalid password for username:', username);
      return null;
    }

    return {
      id: data.id,
      username: data.username,
      password: data.password_hash
    };
  }

  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const passwordHash = await bcrypt.hash(admin.password, 10);

    const { data, error } = await supabase
      .from('admins')
      .insert({
        username: admin.username,
        password_hash: passwordHash
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      username: data.username,
      password: data.password_hash
    };
  }

  async getUnifiedEvents(): Promise<UnifiedEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) throw error;

    return (data || []).map(event => ({
      id: parseInt(event.id),
      title: event.title,
      date: event.event_date,
      time: event.event_time || null,
      location: event.location || null,
      description: event.description || null,
      participants: null,
      rounds: null,
      rating: null,
      winners: null,
      imagePaths: null,
      isRecurring: event.is_recurring,
      recurrencePattern: null,
      customLinks: event.custom_links || []
    }));
  }

  private parseEventDate(dateString: string): Date | null {
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
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: event.title,
        description: event.description || '',
        event_date: event.date,
        event_time: event.time || '',
        location: event.location || '',
        custom_links: event.customLinks || [],
        is_recurring: event.isRecurring || false
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: parseInt(data.id),
      title: data.title,
      date: data.event_date,
      time: data.event_time || null,
      location: data.location || null,
      description: data.description || null,
      participants: null,
      rounds: null,
      rating: null,
      winners: null,
      imagePaths: null,
      isRecurring: data.is_recurring,
      recurrencePattern: null,
      customLinks: data.custom_links || []
    };
  }

  async updateUnifiedEvent(id: string | number, updates: Partial<InsertUnifiedEvent>): Promise<void> {
    const updateData: any = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.date !== undefined) updateData.event_date = updates.date;
    if (updates.time !== undefined) updateData.event_time = updates.time;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.customLinks !== undefined) updateData.custom_links = updates.customLinks;
    if (updates.isRecurring !== undefined) updateData.is_recurring = updates.isRecurring;

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async deleteUnifiedEvent(id: string | number): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getSponsors(): Promise<Sponsor[]> {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return (data || []).map(sponsor => ({
      id: parseInt(sponsor.id),
      name: sponsor.name,
      logo: sponsor.logo_url,
      website: sponsor.website_url,
      tier: sponsor.tier,
      order: sponsor.display_order
    }));
  }

  async addSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
    const { data, error } = await supabase
      .from('sponsors')
      .insert({
        name: sponsor.name,
        logo_url: sponsor.logo || '',
        website_url: sponsor.website || '',
        tier: sponsor.tier || 'bronze',
        display_order: sponsor.order || 0
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: parseInt(data.id),
      name: data.name,
      logo: data.logo_url,
      website: data.website_url,
      tier: data.tier,
      order: data.display_order
    };
  }

  async updateSponsor(id: string | number, updates: Partial<InsertSponsor>): Promise<void> {
    const updateData: any = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.logo !== undefined) updateData.logo_url = updates.logo;
    if (updates.website !== undefined) updateData.website_url = updates.website;
    if (updates.tier !== undefined) updateData.tier = updates.tier;
    if (updates.order !== undefined) updateData.display_order = updates.order;

    const { error } = await supabase
      .from('sponsors')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async deleteSponsor(id: string | number): Promise<void> {
    const { error } = await supabase
      .from('sponsors')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getSponsorFlyer(): Promise<SponsorFlyer | null> {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_name', 'sponsor_flyer')
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: parseInt(data.id),
      pdfUrl: data.content.pdfUrl || ''
    };
  }

  async setSponsorFlyer(flyer: InsertSponsorFlyer): Promise<SponsorFlyer> {
    const { data, error } = await supabase
      .from('page_content')
      .upsert({
        page_name: 'sponsor_flyer',
        content: { pdfUrl: flyer.pdfUrl }
      }, { onConflict: 'page_name' })
      .select()
      .single();

    if (error) throw error;

    return {
      id: parseInt(data.id),
      pdfUrl: data.content.pdfUrl || ''
    };
  }

  async getAboutContent(section: string): Promise<AboutContent | null> {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_name', `about_${section}`)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: parseInt(data.id),
      section,
      heading: data.content.heading || '',
      content: data.content.content || ''
    };
  }

  async getAllAboutContent(): Promise<AboutContent[]> {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .like('page_name', 'about_%');

    if (error) throw error;

    return (data || []).map(item => ({
      id: parseInt(item.id),
      section: item.page_name.replace('about_', ''),
      heading: item.content.heading || '',
      content: item.content.content || ''
    }));
  }

  async setAboutContent(content: InsertAboutContent): Promise<AboutContent> {
    const { data, error } = await supabase
      .from('page_content')
      .upsert({
        page_name: `about_${content.section}`,
        content: {
          heading: content.heading,
          content: content.content
        }
      }, { onConflict: 'page_name' })
      .select()
      .single();

    if (error) throw error;

    return {
      id: parseInt(data.id),
      section: content.section,
      heading: data.content.heading || '',
      content: data.content.content || ''
    };
  }

  async updateAboutContent(id: string | number, updates: Partial<InsertAboutContent>): Promise<void> {
    const { data: existing } = await supabase
      .from('page_content')
      .select('*')
      .eq('id', id)
      .single();

    if (!existing) throw new Error('Content not found');

    const updatedContent = {
      ...existing.content,
      ...(updates.heading !== undefined && { heading: updates.heading }),
      ...(updates.content !== undefined && { content: updates.content })
    };

    const { error } = await supabase
      .from('page_content')
      .update({ content: updatedContent, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  async getUpcomingEvents(): Promise<UpcomingEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .or(`is_recurring.eq.true,event_date.gte.${new Date().toISOString().split('T')[0]}`)
      .order('event_date', { ascending: true });

    if (error) throw error;

    return (data || []).map(event => ({
      id: parseInt(event.id),
      title: event.title,
      date: event.event_date,
      time: event.event_time || null,
      location: event.location || null,
      description: event.description || null,
      imagePaths: null,
      isRecurring: event.is_recurring,
      recurrencePattern: null
    }));
  }

  async getPastEvents(): Promise<PastEventWithWinners[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_recurring', false)
      .lt('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: false });

    if (error) throw error;

    return (data || []).map(event => ({
      id: parseInt(event.id),
      title: event.title,
      date: event.event_date,
      participants: null,
      rounds: null,
      rating: null,
      description: event.description || null,
      imagePaths: null,
      winners: []
    }));
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) throw error;

    return (data || []).map(event => ({
      id: parseInt(event.id),
      title: event.title,
      date: event.event_date,
      time: event.event_time || null,
      location: event.location || null,
      description: event.description || null,
      eventType: event.is_recurring ? 'meeting' : 'tournament',
      colorCode: event.is_recurring ? 'green' : 'blue',
      imagePaths: null,
      isRecurring: event.is_recurring,
      recurrencePattern: null
    }));
  }

  async addUpcomingEvent(event: InsertUpcomingEvent): Promise<UpcomingEvent> {
    const result = await this.addUnifiedEvent({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      isRecurring: event.isRecurring,
      customLinks: []
    });

    return {
      id: result.id,
      title: result.title,
      date: result.date,
      time: result.time,
      location: result.location,
      description: result.description,
      imagePaths: null,
      isRecurring: result.isRecurring,
      recurrencePattern: null
    };
  }

  async addPastEvent(event: InsertPastEvent, winners: InsertPastEventWinner[] = []): Promise<PastEventWithWinners> {
    const result = await this.addUnifiedEvent({
      title: event.title,
      date: event.date,
      description: event.description,
      isRecurring: false,
      customLinks: []
    });

    return {
      id: result.id,
      title: result.title,
      date: result.date,
      participants: event.participants,
      rounds: event.rounds,
      rating: event.rating,
      description: result.description,
      imagePaths: null,
      winners: []
    };
  }

  async addCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const result = await this.addUnifiedEvent({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      isRecurring: event.isRecurring,
      customLinks: []
    });

    return {
      id: result.id,
      title: result.title,
      date: result.date,
      time: result.time,
      location: result.location,
      description: result.description,
      eventType: event.eventType || 'meeting',
      colorCode: event.colorCode || 'green',
      imagePaths: null,
      isRecurring: result.isRecurring,
      recurrencePattern: null
    };
  }

  async updateUpcomingEvent(id: string | number, updates: Partial<InsertUpcomingEvent>): Promise<void> {
    await this.updateUnifiedEvent(id, updates);
  }

  async updatePastEvent(id: string | number, updates: Partial<InsertPastEvent>, winners?: InsertPastEventWinner[]): Promise<void> {
    await this.updateUnifiedEvent(id, updates);
  }

  async updateCalendarEvent(id: string | number, updates: Partial<InsertCalendarEvent>): Promise<void> {
    await this.updateUnifiedEvent(id, updates);
  }

  async deleteUpcomingEvent(id: string | number): Promise<void> {
    await this.deleteUnifiedEvent(id);
  }

  async deletePastEvent(id: string | number): Promise<void> {
    await this.deleteUnifiedEvent(id);
  }

  async deleteCalendarEvent(id: string | number): Promise<void> {
    await this.deleteUnifiedEvent(id);
  }

  async seedData(): Promise<void> {
    const { count } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    if (count && count > 0) return;

    await this.addUnifiedEvent({
      title: "Weekly Chess Club Meeting",
      date: "2025-11-02",
      time: "7:00 PM - 9:00 PM",
      location: "Busch Student Center - Food Court",
      description: "Join us for casual games, practice, and chess discussion. All skill levels welcome!",
      isRecurring: true,
      recurrencePattern: "weekly_tuesday",
      customLinks: []
    });

    const pastDate1 = new Date();
    pastDate1.setMonth(pastDate1.getMonth() - 6);

    await this.addUnifiedEvent({
      title: "Spring 2025 Blitz Tournament",
      date: pastDate1.toISOString().split('T')[0],
      time: "2:00 PM - 6:00 PM",
      location: "Busch Student Center",
      description: "Fast-paced blitz tournament with prizes for top finishers. USCF rated event.",
      isRecurring: false,
      customLinks: [
        { title: "Tournament Results", url: "https://example.com/results" }
      ]
    });

    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);

    await this.addUnifiedEvent({
      title: "Fall 2025 Championship",
      date: futureDate.toISOString().split('T')[0],
      time: "1:00 PM - 7:00 PM",
      location: "College Avenue Student Center",
      description: "Annual championship tournament. Register now to compete for the club title!",
      isRecurring: false,
      customLinks: [
        { title: "Register Here", url: "https://example.com/register" },
        { title: "Tournament Rules", url: "https://example.com/rules" }
      ]
    });
  }
}

export const storage = new SupabaseStorage();
