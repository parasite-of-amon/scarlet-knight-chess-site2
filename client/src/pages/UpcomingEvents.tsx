import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, Plus, Trash2, Edit } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type UnifiedEvent } from "@shared/schema";
import { UnifiedEventModal } from "@/components/UnifiedEventModal";
import { ImageCarousel } from "@/components/ImageCarousel";
import { toast } from "sonner";
import { format, parse, isSameMonth, isBefore, startOfDay } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const UpcomingEvents = () => {
  const { isAdmin } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UnifiedEvent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<UnifiedEvent | null>(null);

  const { data: allEvents = [], isLoading: upcomingLoading } = useQuery<UnifiedEvent[]>({
    queryKey: ['/api/events/unified'],
  });

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

  const upcomingEvents = useMemo(() => {
    const today = startOfDay(new Date());
    return allEvents.filter(event => {
      if (event.isRecurring) return true;
      const eventDate = parseEventDate(event.date);
      if (!eventDate) return false;
      return !isBefore(startOfDay(eventDate), today);
    });
  }, [allEvents]);

  const deleteUpcomingMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/events/unified/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events/unified'] });
      toast.success("Event deleted successfully");
      setIsDetailModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete event: ${error.message}`);
    },
  });

  const handleEventCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/events/unified'] });
  };

  const handleEventUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/events/unified'] });
    setIsDetailModalOpen(false);
  };

  const handleEventClick = (event: UnifiedEvent) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (event: UnifiedEvent) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const sortedEvents = [...upcomingEvents].sort((a, b) => {
    const dateA = parseEventDate(a.date);
    const dateB = parseEventDate(b.date);
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    return dateA.getTime() - dateB.getTime();
  });

  const groupEventsByMonth = () => {
    const grouped: { [key: string]: UpcomingEvent[] } = {};
    
    sortedEvents.forEach(event => {
      const eventDate = parseEventDate(event.date);
      const monthKey = eventDate ? format(eventDate, 'MMMM yyyy') : 'Unscheduled';
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });
    
    return grouped;
  };

  const eventsByMonth = groupEventsByMonth();

  if (upcomingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading upcoming events...</p>
      </div>
    );
  }

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
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Upcoming Events</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <Link href="/" className="hover:text-primary" data-testid="link-home">Home</Link>
            <span>/</span>
            <span className="text-primary">Upcoming Events</span>
          </div>
        </div>
      </section>

      {/* Upcoming Events Content */}
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

          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground">Join us at our regular meetings and upcoming tournaments</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {Object.entries(eventsByMonth).map(([month, events]) => (
              <div key={month} className="space-y-4">
                <h3 className="font-serif text-3xl font-bold text-primary sticky top-20 bg-background py-2 z-10" data-testid={`month-header-${month}`}>
                  {month}
                </h3>
                
                <div className="space-y-3">
                  {events.map((event) => (
                    <Card 
                      key={event.id} 
                      className="border-2 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      onClick={() => handleEventClick(event)}
                      data-testid={`card-upcoming-event-${event.id}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {event.title}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{event.date}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-primary text-2xl group-hover:scale-110 transition-transform">
                            →
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            
            {upcomingEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No upcoming events scheduled yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl">{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              View detailed information about this upcoming event.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              {selectedEvent.imagePaths && JSON.parse(selectedEvent.imagePaths).length > 0 && (
                <ImageCarousel 
                  images={JSON.parse(selectedEvent.imagePaths)} 
                  alt={selectedEvent.title} 
                />
              )}
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-lg">{selectedEvent.date}{selectedEvent.time ? ` • ${selectedEvent.time}` : ''}</span>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-lg">{selectedEvent.location}</span>
                  </div>
                )}
                
                {selectedEvent.description && (
                  <div className="pt-4">
                    <p className="text-muted-foreground leading-relaxed">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
              
              {isAdmin && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    size="sm"
                    onClick={() => selectedEvent.id && deleteUpcomingMutation.mutate(selectedEvent.id)}
                    disabled={deleteUpcomingMutation.isPending}
                    className="bg-scarlet text-white hover:bg-scarlet-600"
                    data-testid={`button-delete-upcoming-${selectedEvent.id}`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Event
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(selectedEvent)}
                    data-testid={`button-edit-upcoming-${selectedEvent.id}`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Event
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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

export default UpcomingEvents;
