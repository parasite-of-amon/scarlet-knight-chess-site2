export interface EventLink {
  url: string;
  label: string;
}

export interface EventLinks {
  registration?: EventLink;
  info?: EventLink;
  resource?: EventLink;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date
  timeStart: string; // HH:mm format
  timeEnd: string; // HH:mm format
  location: string;
  images: string[];
  winnersImage?: string;
  participants?: number;
  rounds?: number;
  rating?: string;
  status: 'upcoming' | 'past';
  isRecurring?: boolean;
  tags: string[];
  links: EventLinks;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventFilters {
  search?: string;
  type?: string;
  rating?: string;
  rounds?: number;
  year?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface WinnerResult {
  place: number;
  name: string;
  score: string;
  rating?: string;
}
