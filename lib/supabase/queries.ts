import { createClient } from '@/lib/supabase/server';
import type { Event, EventWithWinners, Winner } from '@/types/database';

export async function getEvents(status?: 'upcoming' | 'past' | 'live') {
  const supabase = await createClient();

  let query = supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: status === 'upcoming' });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  // Transform database fields to match TypeScript types
  return (data || []).map((event) => ({
    ...event,
    date: event.event_date,
    time_start: event.time_start || '',
    time_end: event.time_end || '',
  })) as Event[];
}

export async function getEventBySlug(slug: string): Promise<EventWithWinners | null> {
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !event) {
    console.error('Error fetching event:', error);
    return null;
  }

  // Fetch winners for this event
  const { data: winners } = await supabase
    .from('winners')
    .select('*')
    .eq('event_id', event.id)
    .order('place', { ascending: true });

  return {
    ...event,
    date: event.event_date,
    time_start: event.time_start || '',
    time_end: event.time_end || '',
    winners: (winners || []) as Winner[],
  } as EventWithWinners;
}

export async function getUpcomingEvents() {
  return getEvents('upcoming');
}

export async function getPastEvents(): Promise<EventWithWinners[]> {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from('events')
    .select('*, winners(*)')
    .eq('status', 'past')
    .order('event_date', { ascending: false });

  if (error) {
    console.error('Error fetching past events:', error);
    return [];
  }

  return (events || []).map((event) => ({
    ...event,
    date: event.event_date,
    time_start: event.time_start || '',
    time_end: event.time_end || '',
    winners: event.winners || [],
  })) as EventWithWinners[];
}
