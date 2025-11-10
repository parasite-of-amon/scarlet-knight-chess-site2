'use client';

import { useState, useMemo } from 'react';
import { EventCard } from '@/components/events/EventCard';
import { FilterBar, type FilterValues } from '@/components/events/FilterBar';
import type { Event } from '@/types/database';
import { Calendar } from 'lucide-react';

interface UpcomingEventsClientProps {
  initialEvents: Event[];
}

export function UpcomingEventsClient({ initialEvents }: UpcomingEventsClientProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    type: 'all',
    rating: 'all',
    rounds: 'all',
  });

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(searchLower);
        const matchesDescription = event.description?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }

      // Type filter (check tags)
      if (filters.type !== 'all') {
        const hasTypeTag = event.tags?.some((tag) =>
          tag.toLowerCase().includes(filters.type.toLowerCase())
        );
        if (!hasTypeTag) return false;
      }

      // Rating filter
      if (filters.rating !== 'all' && event.rating !== filters.rating) {
        return false;
      }

      // Rounds filter
      if (filters.rounds !== 'all') {
        if (!event.rounds) return false;
        const roundsNum = parseInt(filters.rounds);
        if (filters.rounds === '8') {
          if (event.rounds < 8) return false;
        } else {
          if (event.rounds !== roundsNum) return false;
        }
      }

      return true;
    });
  }, [initialEvents, filters]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Filter Bar */}
        <div className="mb-8">
          <FilterBar onFilterChange={setFilters} showDateRange={false} />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredEvents.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{initialEvents.length}</span> events
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} variant="upcoming" />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {filters.search || filters.type !== 'all' || filters.rating !== 'all' || filters.rounds !== 'all'
                ? "Try adjusting your filters to see more events."
                : "No upcoming events scheduled at this time. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
