import { getEvents } from '@/lib/supabase/queries';
import { CalendarClient } from './client';

export const metadata = {
  title: 'Event Calendar | Rutgers Chess Club',
  description: 'View all chess events in a monthly calendar format at Rutgers University Chess Club.',
};

export default async function CalendarPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Event Calendar
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            View all upcoming and past events in a monthly calendar format. Click on any event for more details.
          </p>
        </div>
      </section>

      {/* Calendar */}
      <CalendarClient initialEvents={events} />
    </div>
  );
}
