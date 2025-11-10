'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, LogOut, Save } from 'lucide-react';
import type { Event } from '@/types/database';
import type { User } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AdminDashboardClientProps {
  initialEvents: Event[];
  user: User;
}

export function AdminDashboardClient({ initialEvents, user }: AdminDashboardClientProps) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time_start: '',
    time_end: '',
    location: '',
    participants: '',
    rounds: '',
    rating: 'Casual',
    status: 'upcoming',
    tags: '',
    registration_link: '',
    registration_label: '',
    info_link: '',
    info_label: '',
  });

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time_start: '',
      time_end: '',
      location: '',
      participants: '',
      rounds: '',
      rating: 'Casual',
      status: 'upcoming',
      tags: '',
      registration_link: '',
      registration_label: '',
      info_link: '',
      info_label: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time_start: event.time_start || '',
      time_end: event.time_end || '',
      location: event.location,
      participants: event.participants?.toString() || '',
      rounds: event.rounds?.toString() || '',
      rating: event.rating || 'Casual',
      status: event.status,
      tags: event.tags?.join(', ') || '',
      registration_link: event.registration_link || '',
      registration_label: event.registration_label || '',
      info_link: event.info_link || '',
      info_label: event.info_label || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const eventData = {
        title: formData.title,
        description: formData.description,
        event_date: formData.date,
        time_start: formData.time_start,
        time_end: formData.time_end,
        location: formData.location,
        participants: formData.participants ? parseInt(formData.participants) : null,
        rounds: formData.rounds ? parseInt(formData.rounds) : null,
        rating: formData.rating || null,
        status: formData.status,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
        registration_link: formData.registration_link || null,
        registration_label: formData.registration_label || null,
        info_link: formData.info_link || null,
        info_label: formData.info_label || null,
      };

      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        toast.success('Event updated successfully');
      } else {
        // Create new event
        const { error } = await supabase.from('events').insert([eventData]);

        if (error) throw error;
        toast.success('Event created successfully');
      }

      // Refresh events
      const { data: updatedEvents } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (updatedEvents) {
        setEvents(
          updatedEvents.map((e) => ({
            ...e,
            date: e.event_date,
          })) as Event[]
        );
      }

      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('events').delete().eq('id', eventId);

      if (error) throw error;

      setEvents(events.filter((e) => e.id !== eventId));
      toast.success('Event deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-primary-foreground/90">Manage events and tournaments</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {user.email}</span>
              <Button variant="secondary" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Events ({events.length})</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                <DialogDescription>
                  {editingEvent ? 'Update event details' : 'Add a new event to the calendar'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time_start">Start Time</Label>
                    <Input
                      id="time_start"
                      placeholder="7:00 PM"
                      value={formData.time_start}
                      onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time_end">End Time</Label>
                    <Input
                      id="time_end"
                      placeholder="9:00 PM"
                      value={formData.time_end}
                      onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="participants">Participants</Label>
                    <Input
                      id="participants"
                      type="number"
                      value={formData.participants}
                      onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rounds">Rounds</Label>
                    <Input
                      id="rounds"
                      type="number"
                      value={formData.rounds}
                      onChange={(e) => setFormData({ ...formData, rounds: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USCF">USCF</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Unrated">Unrated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="tournament, blitz, casual"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registration_link">Registration Link</Label>
                    <Input
                      id="registration_link"
                      type="url"
                      value={formData.registration_link}
                      onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration_label">Registration Label</Label>
                    <Input
                      id="registration_label"
                      placeholder="Register Now"
                      value={formData.registration_label}
                      onChange={(e) => setFormData({ ...formData, registration_label: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="info_link">Info Link</Label>
                    <Input
                      id="info_link"
                      type="url"
                      value={formData.info_link}
                      onChange={(e) => setFormData({ ...formData, info_link: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="info_label">Info Label</Label>
                    <Input
                      id="info_label"
                      placeholder="More Info"
                      value={formData.info_label}
                      onChange={(e) => setFormData({ ...formData, info_label: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="gap-2">
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="font-semibold text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.slug}</div>
                  </TableCell>
                  <TableCell>{format(new Date(event.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-sm">{event.location}</TableCell>
                  <TableCell>
                    <Badge className={`status-pill status-pill-${event.status}`}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.participants || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
