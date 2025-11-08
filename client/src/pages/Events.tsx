import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Trophy, Users, Plus, Trash2, Edit, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  type UpcomingEvent,
  type PastEventWithWinners,
  type CalendarEvent
} from "@shared/schema";
import { ImageCarousel } from "@/components/ImageCarousel";
import { toast } from "sonner";

const Events = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UpcomingEvent | PastEventWithWinners | CalendarEvent | null>(null);
  const [editingEventType, setEditingEventType] = useState<"upcoming" | "past" | "calendar">("upcoming");

  const { data: upcomingEvents = [], isLoading: upcomingLoading } = useQuery<UpcomingEvent[]>({
    queryKey: ['/api/events/upcoming'],
  });

  const { data: pastEvents = [], isLoading: pastLoading } = useQuery<PastEventWithWinners[]>({
    queryKey: ['/api/events/past'],
  });

  const { data: calendarEvents = [], isLoading: calendarLoading } = useQuery<CalendarEvent[]>({
    queryKey: ['/api/events/calendar'],
  });

  const deleteUpcomingMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/events/upcoming/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events/upcoming'] });
      toast.success("Event deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete event: ${error.message}`);
    },
  });

  const deletePastMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/events/past/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events/past'] });
      toast.success("Event deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete event: ${error.message}`);
    },
  });

  const deleteCalendarMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/events/calendar/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events/calendar'] });
      toast.success("Event deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete event: ${error.message}`);
    },
  });

  const handleEventCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/events/upcoming'] });
    queryClient.invalidateQueries({ queryKey: ['/api/events/past'] });
    queryClient.invalidateQueries({ queryKey: ['/api/events/calendar'] });
  };

  const handleEventUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/events/upcoming'] });
    queryClient.invalidateQueries({ queryKey: ['/api/events/past'] });
    queryClient.invalidateQueries({ queryKey: ['/api/events/calendar'] });
  };

  const loading = upcomingLoading || pastLoading || calendarLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading events...</p>
      </div>
    );
  }

  const meetingCalendarEvents = calendarEvents.filter(event => event.eventType === 'meeting');

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
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Events</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-primary">Events</span>
          </div>
        </div>
      </section>

      {/* Events Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
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

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past" data-testid="tab-past">Past Events</TabsTrigger>
              <TabsTrigger value="calendar" data-testid="tab-calendar">Calendar</TabsTrigger>
            </TabsList>

            {/* Upcoming Events */}
            <TabsContent value="upcoming" className="space-y-6">
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl font-bold mb-4">Upcoming Events</h2>
                <p className="text-muted-foreground">Join us at our regular meetings and upcoming tournaments</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {upcomingEvents.map((event) => {
                  const eventImages = event.imagePaths ? JSON.parse(event.imagePaths) : [];
                  return (
                    <Card key={event.id} className="border-2 hover:border-scarlet transition-colors" data-testid={`card-upcoming-event-${event.id}`}>
                      <CardContent className="p-8">
                        {eventImages.length > 0 && (
                          <ImageCarousel images={eventImages} alt={event.title} />
                        )}
                        <h3 className="font-serif text-2xl font-bold mb-4">{event.title}</h3>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>{event.date}{event.time ? ` • ${event.time}` : ''}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <MapPin className="w-5 h-5 text-primary" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        {event.description && <p className="text-muted-foreground mb-6">{event.description}</p>}

                        {(event.registrationLink || event.infoLink || event.externalLink) && (
                          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b">
                            {event.registrationLink && (
                              <Button
                                asChild
                                variant="default"
                                size="sm"
                                className="gap-2"
                                data-testid={`button-registration-link-${event.id}`}
                              >
                                <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                                  {event.registrationLinkLabel || "Register"}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                            {event.infoLink && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                data-testid={`button-info-link-${event.id}`}
                              >
                                <a href={event.infoLink} target="_blank" rel="noopener noreferrer">
                                  {event.infoLinkLabel || "More Info"}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                            {event.externalLink && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                data-testid={`button-external-link-${event.id}`}
                              >
                                <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
                                  {event.externalLinkLabel || "View Resource"}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            onClick={() => event.id && deleteUpcomingMutation.mutate(event.id)}
                            disabled={deleteUpcomingMutation.isPending}
                            className="bg-scarlet text-white hover:bg-scarlet-600"
                            data-testid={`button-delete-upcoming-${event.id}`}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingEvent(event);
                              setEditingEventType("upcoming");
                              setIsEditModalOpen(true);
                            }}
                            data-testid={`button-edit-upcoming-${event.id}`}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Past Events */}
            <TabsContent value="past" className="space-y-6">
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl font-bold mb-4">Past Events</h2>
                <p className="text-muted-foreground">Our tournament history and achievements</p>
              </div>

              <div className="space-y-8 max-w-4xl mx-auto">
                {pastEvents.map((event) => {
                  const eventImages = event.imagePaths ? JSON.parse(event.imagePaths) : [];
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
                            <span className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" />
                              {event.participants}
                            </span>
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

                      {event.winners && event.winners.length > 0 && (
                        <div className="bg-secondary rounded-lg p-6 mb-6">
                          <h4 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-primary" />
                            Winners
                          </h4>
                          <div className="space-y-2">
                            {event.winners.map((winner, idx) => (
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

                        {(event.registrationLink || event.infoLink || event.externalLink) && (
                          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b">
                            {event.registrationLink && (
                              <Button
                                asChild
                                variant="default"
                                size="sm"
                                className="gap-2"
                                data-testid={`button-registration-link-${event.id}`}
                              >
                                <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                                  {event.registrationLinkLabel || "Register"}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                            {event.infoLink && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                data-testid={`button-info-link-${event.id}`}
                              >
                                <a href={event.infoLink} target="_blank" rel="noopener noreferrer">
                                  {event.infoLinkLabel || "More Info"}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                            {event.externalLink && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                data-testid={`button-external-link-${event.id}`}
                              >
                                <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
                                  {event.externalLinkLabel || "View Resource"}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        )}

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
                              setEditingEventType("past");
                              setIsEditModalOpen(true);
                            }}
                            data-testid={`button-edit-past-${event.id}`}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Calendar */}
            <TabsContent value="calendar">
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl font-bold mb-4">📅 Event Calendar</h2>
                <p className="text-muted-foreground">Color-coded events: 🟩 Meetings • 🟦 Tournaments • 🟨 Social Nights • 🟥 Deadlines</p>
              </div>

              <Card className="max-w-4xl mx-auto">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {meetingCalendarEvents.map((event) => {
                        const colorClass = event.colorCode === 'green' ? 'bg-green-500/10 border-green-500/20' : 'bg-blue-500/10 border-blue-500/20';
                        const eventImages = event.imagePaths ? JSON.parse(event.imagePaths) : [];
                        return (
                          <div key={event.id} className={`${colorClass} border-2 rounded-lg p-6 hover:border-scarlet transition-colors`} data-testid={`card-calendar-event-${event.id}`}>
                            {eventImages.length > 0 && (
                              <div className="mb-4">
                                <ImageCarousel images={eventImages} alt={event.title} />
                              </div>
                            )}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">🟩</span>
                              <h3 className="font-serif text-xl font-bold">{event.title}</h3>
                            </div>
                            <p className="text-muted-foreground mb-2">{event.date}</p>
                            <p className="font-medium">{event.time}</p>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                            <p className="text-sm mt-3 mb-4 text-muted-foreground">{event.description}</p>

                            {(event.registrationLink || event.infoLink || event.externalLink) && (
                              <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b">
                                {event.registrationLink && (
                                  <Button
                                    asChild
                                    variant="default"
                                    size="sm"
                                    className="gap-2"
                                    data-testid={`button-registration-link-${event.id}`}
                                  >
                                    <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                                      {event.registrationLinkLabel || "Register"}
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </Button>
                                )}
                                {event.infoLink && (
                                  <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    data-testid={`button-info-link-${event.id}`}
                                  >
                                    <a href={event.infoLink} target="_blank" rel="noopener noreferrer">
                                      {event.infoLinkLabel || "More Info"}
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </Button>
                                )}
                                {event.externalLink && (
                                  <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    data-testid={`button-external-link-${event.id}`}
                                  >
                                    <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
                                      {event.externalLinkLabel || "View Resource"}
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            )}

                            <div className="flex gap-3">
                              <Button
                                size="sm"
                                onClick={() => event.id && deleteCalendarMutation.mutate(event.id)}
                                disabled={deleteCalendarMutation.isPending}
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
                                  setEditingEventType("calendar");
                                  setIsEditModalOpen(true);
                                }}
                                data-testid={`button-edit-calendar-${event.id}`}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
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
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-serif text-lg font-bold mb-4">Event Filters & Tags</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-block bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-sm">In-Person</span>
                        <span className="inline-block bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-sm">Rated</span>
                        <span className="inline-block bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-sm">Beginner-Friendly</span>
                        <span className="inline-block bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-sm">Social Event</span>
                      </div>
                    </div>

                    <div className="border-t pt-6">
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
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Treat equipment and members with respect</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <CreateEventModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onEventCreated={handleEventCreated}
      />

      {editingEvent && (
        <EditEventModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onEventUpdated={handleEventUpdated}
          eventType={editingEventType}
          event={editingEvent}
        />
      )}
    </div>
  );
};

export default Events;
