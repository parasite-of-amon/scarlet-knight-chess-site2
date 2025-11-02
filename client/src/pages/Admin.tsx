import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedEventModal } from '@/components/UnifiedEventModal';
import { AdminLogin } from '@/components/AdminLogin';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Calendar, Trophy, Users } from 'lucide-react';
import type { UnifiedEvent, Sponsor } from '@shared/schema';

const Admin = () => {
  const { isAdmin } = useAuth();
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<UnifiedEvent | undefined>();

  const { data: events = [] } = useQuery({
    queryKey: ['unified-events'],
    queryFn: async () => {
      const response = await apiRequest('/api/events/unified');
      return response as UnifiedEvent[];
    },
  });

  const { data: sponsors = [] } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const response = await apiRequest('/api/sponsors');
      return response as Sponsor[];
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await apiRequest(`/api/events/unified/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-events'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
      queryClient.invalidateQueries({ queryKey: ['past-events'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast.success('Event deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete event');
    },
  });

  const deleteSponsorMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await apiRequest(`/api/sponsors/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      toast.success('Sponsor deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete sponsor');
    },
  });

  const handleEditEvent = (event: UnifiedEvent) => {
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  const handleDeleteEvent = (id: string | number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate(id);
    }
  };

  const handleDeleteSponsor = (id: string | number) => {
    if (confirm('Are you sure you want to delete this sponsor?')) {
      deleteSponsorMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setEventModalOpen(false);
    setSelectedEvent(undefined);
  };

  const categorizeEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming: UnifiedEvent[] = [];
    const past: UnifiedEvent[] = [];

    events.forEach(event => {
      if (event.isRecurring) {
        upcoming.push(event);
      } else {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        if (eventDate >= today) {
          upcoming.push(event);
        } else {
          past.push(event);
        }
      }
    });

    return { upcoming, past };
  };

  const { upcoming, past } = categorizeEvents();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              Please login to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <AdminLogin />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <AdminLogin />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcoming.length} upcoming, {past.length} past
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recurring Events</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => e.isRecurring).length}
              </div>
              <p className="text-xs text-muted-foreground">Weekly meetings and more</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sponsors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sponsors.length}</div>
              <p className="text-xs text-muted-foreground">Active sponsors</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Event Management</h2>
              <Button onClick={() => setEventModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Upcoming Events ({upcoming.length})</h3>
                <div className="grid grid-cols-1 gap-4">
                  {upcoming.map(event => (
                    <Card key={event.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>
                              {event.date} {event.time && `• ${event.time}`}
                              {event.isRecurring && ' • Recurring'}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      {event.description && (
                        <CardContent>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          {event.location && (
                            <p className="text-sm text-gray-500 mt-2">📍 {event.location}</p>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                  {upcoming.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No upcoming events</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Past Events ({past.length})</h3>
                <div className="grid grid-cols-1 gap-4">
                  {past.map(event => (
                    <Card key={event.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>
                              {event.date} {event.time && `• ${event.time}`}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      {event.description && (
                        <CardContent>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          {event.location && (
                            <p className="text-sm text-gray-500 mt-2">📍 {event.location}</p>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                  {past.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No past events</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sponsors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Sponsor Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Sponsor
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsors.map(sponsor => (
                <Card key={sponsor.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{sponsor.name}</CardTitle>
                        <CardDescription>{sponsor.tier}</CardDescription>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSponsor(sponsor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  {sponsor.website && (
                    <CardContent>
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </CardContent>
                  )}
                </Card>
              ))}
              {sponsors.length === 0 && (
                <p className="text-gray-500 text-center py-8 col-span-2">No sponsors</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <UnifiedEventModal
        open={eventModalOpen}
        onOpenChange={handleCloseModal}
        event={selectedEvent}
      />
    </div>
  );
};

export default Admin;
