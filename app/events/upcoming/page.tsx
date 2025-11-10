import { getUpcomingEvents } from '@/lib/supabase/queries';
import { UpcomingEventsClient } from './client';

export const metadata = {
  title: 'Upcoming Events | Rutgers Chess Club',
  description: 'View upcoming chess tournaments, meetings, and events at Rutgers University Chess Club.',
};

export default async function UpcomingEventsPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Upcoming Events
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Join us for exciting chess tournaments, casual games, and community events.
            All skill levels welcome!
          </p>
        </div>
      </section>

      {/* Events Grid with Filtering */}
      <UpcomingEventsClient initialEvents={events} />
    </div>
  );
}
