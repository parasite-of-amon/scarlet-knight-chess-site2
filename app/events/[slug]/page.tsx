import { getEventBySlug } from '@/lib/supabase/queries';
import { notFound } from 'next/navigation';
import { EventDetailClient } from './client';
import type { Metadata } from 'next';

interface EventPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    return {
      title: 'Event Not Found | Rutgers Chess Club',
    };
  }

  return {
    title: `${event.title} | Rutgers Chess Club`,
    description: event.description || `Join us for ${event.title} at ${event.location}`,
    openGraph: {
      title: event.title,
      description: event.description || '',
      images: event.images?.[0] ? [event.images[0]] : [],
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  return <EventDetailClient event={event} />;
}
