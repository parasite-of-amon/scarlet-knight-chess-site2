import { getPastEvents } from '@/lib/supabase/queries';
import { PastEventsClient } from './client';

export const metadata = {
  title: 'Past Events | Rutgers Chess Club',
  description: 'View past chess tournament results, winners, and event history at Rutgers University Chess Club.',
};

export default async function PastEventsPage() {
  const events = await getPastEvents();

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Past Events & Results
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Celebrate our tournament champions and relive memorable chess events from the
            Rutgers Chess Club history.
          </p>
        </div>
      </section>

      {/* Events with Table Toggle */}
      <PastEventsClient initialEvents={events} />
    </div>
  );
}
