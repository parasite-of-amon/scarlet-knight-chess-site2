import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, Edit } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type UnifiedEvent, type WinnerInput } from "@shared/schema";
import { UnifiedEventModal } from "@/components/UnifiedEventModal";
import { ImageCarousel } from "@/components/ImageCarousel";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parse,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfDay
} from "date-fns";

const Calendar = () => {
  const { isAdmin } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UnifiedEvent | null>(null);

  const { data: allEvents = [] } = useQuery<UnifiedEvent[]>({
    queryKey: ['/api/events/unified'],
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/events/unified/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events/unified'] });
      toast.success("Event deleted successfully");
    },
  });

  const handleEventCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/events/unified'] });
  };

  const handleEventUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/events/unified'] });
  };

  const handleDeleteEvent = (event: UnifiedEvent) => {
    if (!event.id) return;
    deleteEventMutation.mutate(event.id);
  };

  const parseEventDate = (dateString: string): Date | null => {
    const formats = ['MMMM d, yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'];
    
    for (const formatString of formats) {
      try {
        const parsed = parse(dateString, formatString, new Date());
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      } catch {
        continue;
      }
    }
    
    return null;
  };

  const getAllEventsForDate = (date: Date): UnifiedEvent[] => {
    return allEvents.filter(event => {
      const eventDate = parseEventDate(event.date);
      if (!eventDate) return false;
      return isSameDay(eventDate, date);
    });
  };

  const getEventColor = (event: UnifiedEvent): string => {
    const today = startOfDay(new Date());
    const eventDate = parseEventDate(event.date);
    
    if (!eventDate) return 'bg-gray-500';
    
    if (event.isRecurring) return 'bg-green-500';
    
    if (isBefore(startOfDay(eventDate), today)) {
      return 'bg-gray-500';
    }
    
    if (event.winners || event.participants || event.rounds || event.rating) {
      return 'bg-blue-500';
    }
    
    return 'bg-blue-500';
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Page Header */}
      <section className="relative py-32 bg-dark-bg text-dark-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/40 to-dark-bg/20 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1200')",
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-20">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Event Calendar</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <Link href="/" className="hover:text-primary" data-testid="link-home">Home</Link>
            <span>/</span>
            <span className="text-primary">Calendar</span>
          </div>
        </div>
      </section>

      {/* Calendar Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {isAdmin && (
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-create-event"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          )}

          <div className="text-center mb-8">
            <h2 className="font-serif text-4xl font-bold mb-4">📅 Event Calendar</h2>
            <p className="text-muted-foreground">Color-coded events: 🟩 Recurring Events • 🟦 Upcoming Events • ⬜ Past Events</p>
          </div>

          {/* Calendar Navigation */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                data-testid="button-prev-month"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h3 className="font-serif text-3xl font-bold">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              
              <Button
                variant="outline"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                data-testid="button-next-month"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <Card>
              <CardContent className="p-4">
                {/* Week Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map(day => {
                    const dayEvents = getAllEventsForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <div
                        key={day.toString()}
                        className={`min-h-[100px] p-2 border rounded-lg ${
                          !isCurrentMonth ? 'bg-muted/20' : 'bg-background'
                        } ${isToday ? 'border-primary border-2' : 'border-border'}`}
                        data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          !isCurrentMonth ? 'text-muted-foreground' : 
                          isToday ? 'text-primary font-bold' : ''
                        }`}>
                          {format(day, 'd')}
                        </div>
                        
                        <div className="space-y-1">
                          {dayEvents.map((event, idx) => (
                            <div
                              key={`${event.id}-${idx}`}
                              className={`${getEventColor(event)} text-white text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity`}
                              title={event.title}
                              data-testid={`event-unified-${event.id}`}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Today's Button */}
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentMonth(new Date())}
                data-testid="button-today"
              >
                Today
              </Button>
            </div>
          </div>

          {/* Event List for Current Month */}
          <div className="max-w-4xl mx-auto mt-12">
            <h3 className="font-serif text-2xl font-bold mb-6">Events in {format(currentMonth, 'MMMM yyyy')}</h3>
            
            <div className="space-y-4">
              {allEvents
                .filter(event => {
                  const eventDate = parseEventDate(event.date);
                  return eventDate && isSameMonth(eventDate, currentMonth);
                })
                .map(event => {
                  const today = startOfDay(new Date());
                  const eventDate = parseEventDate(event.date);
                  const isPastEvent = eventDate && isBefore(startOfDay(eventDate), today);
                  
                  const colorClass = event.isRecurring 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : isPastEvent
                    ? 'bg-gray-500/10 border-gray-500/20'
                    : 'bg-blue-500/10 border-blue-500/20';
                  
                  const eventImages = event.imagePaths ? JSON.parse(event.imagePaths) : [];
                  const winners: WinnerInput[] = event.winners ? JSON.parse(event.winners) : [];
                  
                  return (
                    <Card key={event.id} className={`${colorClass} border-2 hover:border-scarlet transition-colors`} data-testid={`card-calendar-event-${event.id}`}>
                      <CardContent className="p-6">
                        {eventImages.length > 0 && (
                          <div className="mb-4">
                            <ImageCarousel images={eventImages} alt={event.title} />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">
                            {event.isRecurring ? '🟩' :
                             isPastEvent ? '⬜' : '🟦'}
                          </span>
                          <h4 className="font-serif text-xl font-bold">{event.title}</h4>
                        </div>
                        <p className="text-muted-foreground mb-2">{event.date}</p>
                        {event.time && <p className="font-medium">{event.time}</p>}
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                        {event.description && (
                          <p className="text-sm mt-3 mb-4 text-muted-foreground">{event.description}</p>
                        )}
                        {(event.participants || event.rounds || event.rating) && (
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                            {event.participants && (
                              <span>Participants: {event.participants}</span>
                            )}
                            {event.rounds && (
                              <span>Rounds: {event.rounds}</span>
                            )}
                            {event.rating && (
                              <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                {event.rating}
                              </span>
                            )}
                          </div>
                        )}
                        {winners.length > 0 && (
                          <div className="bg-secondary/50 rounded-lg p-4 mt-4">
                            <h5 className="font-semibold mb-2">Winners</h5>
                            <div className="space-y-1 text-sm">
                              {winners.map((winner, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span>{winner.place}: {winner.name}</span>
                                  {winner.score && <span className="font-bold">{winner.score}</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {isAdmin && (
                          <div className="flex gap-3 mt-4">
                            <Button
                              size="sm"
                              onClick={() => event.id && deleteEventMutation.mutate(event.id)}
                              disabled={deleteEventMutation.isPending}
                              className="bg-scarlet text-white hover:bg-scarlet-600"
                              data-testid={`button-delete-calendar-${event.id}`}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingEvent(event);
                                setIsEditModalOpen(true);
                              }}
                              data-testid={`button-edit-calendar-${event.id}`}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>

            {/* Calendar Info */}
            <div className="mt-12 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    Subscribe to Calendar
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Stay updated with all club events by subscribing to our calendar. Sync with Google Calendar, Apple Calendar, or your phone.
                  </p>
                  <Link href="/contact">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-subscribe-calendar">
                      Subscribe to Calendar
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-serif text-lg font-bold mb-4">Important Notes</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>No fees required to attend meetings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>No attendance obligation - come when you can</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Equipment provided (boards, pieces, clocks)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Free for all Rutgers students and staff</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <UnifiedEventModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {editingEvent && (
        <UnifiedEventModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          event={editingEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
