import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  custom_links: Array<{ title: string; url: string }>;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  display_order: number;
  created_at: string;
}

export interface PageContent {
  id: string;
  page_name: string;
  content: Record<string, any>;
  updated_at: string;
}

export interface Admin {
  id: string;
  username: string;
  created_at: string;
}
