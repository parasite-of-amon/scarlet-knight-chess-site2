import { useState, useMemo } from "react";
import { Event, EventFilters } from "@/lib/eventTypes";
import { eventsStorage } from "@/lib/eventsStorage";
import { EventCard } from "@/components/events/EventCard";
import { EventModal } from "@/components/events/EventModal";
import { FilterBar } from "@/components/events/FilterBar";
import { AdminBar } from "@/components/events/AdminBar";
import { Skeleton } from "@/components/ui/skeleton";

const UpcomingEventsNew = () => {
  const [events] = useState<Event[]>(() => eventsStorage.getUpcomingEvents());
  const [filters, setFilters] = useState<EventFilters>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !event.title.toLowerCase().includes(searchLower) &&
          !event.description.toLowerCase().includes(searchLower) &&
          !event.location.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      if (filters.type && !event.tags.includes(filters.type)) {
        return false;
      }

      if (filters.rating && event.rating !== filters.rating) {
        return false;
      }

      if (filters.rounds && event.rounds !== filters.rounds) {
        return false;
      }

      if (filters.year) {
        const eventYear = new Date(event.date).getFullYear();
        if (eventYear !== filters.year) {
          return false;
        }
      }

      return true;
    });
  }, [events, filters]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    if (!selectedEvent) return;
    const currentIndex = filteredEvents.findIndex(e => e.id === selectedEvent.id);
    if (currentIndex < filteredEvents.length - 1) {
      setSelectedEvent(filteredEvents[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (!selectedEvent) return;
    const currentIndex = filteredEvents.findIndex(e => e.id === selectedEvent.id);
    if (currentIndex > 0) {
      setSelectedEvent(filteredEvents[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl font-bold mb-4">Upcoming Events</h1>
            <p className="text-lg text-[#5F6A72]">Join us for exciting chess tournaments and gatherings</p>
          </div>

          <FilterBar filters={filters} onFiltersChange={setFilters} />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">♟️</div>
              <h3 className="font-serif text-2xl font-bold mb-2">No events found</h3>
              <p className="text-[#5F6A72]">
                {filters.search || filters.type || filters.rating
                  ? "Try adjusting your filters"
                  : "Check back soon for upcoming events"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="upcoming"
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <EventModal
        event={selectedEvent}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <AdminBar onCreateClick={() => console.log('Create event')} />
    </div>
  );
};

export default UpcomingEventsNew;
