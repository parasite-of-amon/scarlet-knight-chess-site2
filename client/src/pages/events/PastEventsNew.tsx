import { useState, useMemo } from "react";
import { Event, EventFilters } from "@/lib/eventTypes";
import { eventsStorage } from "@/lib/eventsStorage";
import { EventCard } from "@/components/events/EventCard";
import { EventModal } from "@/components/events/EventModal";
import { FilterBar } from "@/components/events/FilterBar";
import { AdminBar } from "@/components/events/AdminBar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Calendar, MapPin, Users, Hash } from "lucide-react";
import { format, parseISO } from "date-fns";

type ViewMode = 'grid' | 'table';

const PastEventsNew = () => {
  const [events] = useState<Event[]>(() => eventsStorage.getPastEvents());
  const [filters, setFilters] = useState<EventFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState<'date' | 'participants' | 'rounds'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
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

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'participants') {
        comparison = (a.participants || 0) - (b.participants || 0);
      } else if (sortField === 'rounds') {
        comparison = (a.rounds || 0) - (b.rounds || 0);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [events, filters, sortField, sortDirection]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSort = (field: 'date' | 'participants' | 'rounds') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
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
            <h1 className="font-serif text-5xl font-bold mb-4">Past Events</h1>
            <p className="text-lg text-[#5F6A72]">Our tournament history and achievements</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <FilterBar filters={filters} onFiltersChange={setFilters} />
          </div>

          <div className="flex justify-end gap-2 mb-6">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-[#CC0033]' : ''}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-[#CC0033]' : ''}
            >
              <List className="w-4 h-4 mr-2" />
              Table
            </Button>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">♟️</div>
              <h3 className="font-serif text-2xl font-bold mb-2">No past events found</h3>
              <p className="text-[#5F6A72]">Try adjusting your filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="past"
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border-2 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Event</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </div>
                      </TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('participants')}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Players {sortField === 'participants' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('rounds')}
                      >
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          Rounds {sortField === 'rounds' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </div>
                      </TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map(event => (
                      <TableRow
                        key={event.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleEventClick(event)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {event.winnersImage && (
                              <img
                                src={event.winnersImage}
                                alt={event.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm text-[#5F6A72] flex flex-wrap gap-1 mt-1">
                                {event.tags.slice(0, 2).map(tag => (
                                  <span key={tag} className="text-xs px-2 py-0.5 bg-[#F7F7F8] rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{format(parseISO(event.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-[#5F6A72]">
                            <MapPin className="w-4 h-4" />
                            {event.location.split(',')[0]}
                          </div>
                        </TableCell>
                        <TableCell>{event.participants || '-'}</TableCell>
                        <TableCell>{event.rounds || '-'}</TableCell>
                        <TableCell>
                          {event.rating ? (
                            <Badge className="bg-[#CC0033]">{event.rating}</Badge>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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

export default PastEventsNew;
