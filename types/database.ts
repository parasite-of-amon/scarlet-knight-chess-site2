export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time_start: string;
  time_end: string;
  location: string;
  images: string[];
  winners_image?: string;
  participants?: number;
  rounds?: number;
  rating?: 'USCF' | 'Casual' | 'Unrated';
  status: 'upcoming' | 'past' | 'live';
  is_recurring?: boolean;
  tags: string[];
  registration_link?: string;
  registration_label?: string;
  info_link?: string;
  info_label?: string;
  resource_link?: string;
  resource_label?: string;
  created_at: string;
  updated_at: string;
}

export interface Winner {
  id: string;
  event_id: string;
  place: number;
  name: string;
  score: string;
}

export type EventWithWinners = Event & {
  winners: Winner[];
};
