import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, Users, Plus, Trash2, Edit } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type UnifiedEvent, type WinnerInput } from "@shared/schema";
import { UnifiedEventModal } from "@/components/UnifiedEventModal";
import { ImageCarousel } from "@/components/ImageCarousel";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { parse, isBefore, startOfDay } from "date-fns";

const PastEvents = () => {
  const { isAdmin } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UnifiedEvent | null>(null);

  const { data: allEvents = [], isLoading: pastLoading } = useQuery<UnifiedEvent[]>({
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

  const pastEvents = useMemo(() => {
    const today = startOfDay(new Date());
    return allEvents.filter(event => {
      if (event.isRecurring) return false;
      const eventDate = parseEventDate(event.date);
      if (!eventDate) return false;
      return isBefore(startOfDay(eventDate), today);
    });
  }, [allEvents]);

  const deletePastMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/events/unified/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events/unified'] });
      toast.success("Event deleted successfully");
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
  };

  if (pastLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading past events...</p>
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
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Past Events</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <Link href="/" className="hover:text-primary" data-testid="link-home">Home</Link>
            <span>/</span>
            <span className="text-primary">Past Events</span>
          </div>
        </div>
      </section>

      {/* Past Events Content */}
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
            <h2 className="font-serif text-4xl font-bold mb-4">Past Events</h2>
            <p className="text-muted-foreground">Our tournament history and achievements</p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {pastEvents.map((event) => {
              const eventImages = event.imagePaths ? JSON.parse(event.imagePaths) : [];
              const winners: WinnerInput[] = event.winners ? JSON.parse(event.winners) : [];
              return (
                <Card key={event.id} className="border-2 hover:border-scarlet transition-colors" data-testid={`card-past-event-${event.id}`}>
                  <CardContent className="p-8">
                    {eventImages.length > 0 && (
                      <ImageCarousel images={eventImages} alt={event.title} />
                    )}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="font-serif text-2xl font-bold mb-2">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            {event.date}
                          </span>
                          {event.participants && (
                            <span className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" />
                              {event.participants}
                            </span>
                          )}
                          {event.rounds && (
                            <span className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-primary" />
                              {event.rounds}
                            </span>
                          )}
                          {event.rating && (
                            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                              {event.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {winners.length > 0 && (
                      <div className="bg-secondary rounded-lg p-6 mb-6">
                        <h4 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-primary" />
                          Winners
                        </h4>
                        <div className="space-y-2">
                          {winners.map((winner, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="font-medium">{winner.place}: {winner.name}</span>
                              {winner.score && <span className="text-primary font-bold">{winner.score}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {event.description && (
                      <p className="text-muted-foreground mb-6">{event.description}</p>
                    )}
                    {isAdmin && (
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          onClick={() => event.id && deletePastMutation.mutate(event.id)}
                          disabled={deletePastMutation.isPending}
                          className="bg-scarlet text-white hover:bg-scarlet-600"
                          data-testid={`button-delete-past-${event.id}`}
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
                          data-testid={`button-edit-past-${event.id}`}
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

export default PastEvents;
