'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { Event } from '@/types/database';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Trophy, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface CalendarClientProps {
  initialEvents: Event[];
}

export function CalendarClient({ initialEvents }: CalendarClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Convert events to FullCalendar format
  const calendarEvents = initialEvents.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.date,
    backgroundColor: event.status === 'upcoming' ? '#CC0033' : '#5F6A72',
    borderColor: event.status === 'upcoming' ? '#CC0033' : '#5F6A72',
    textColor: '#FFFFFF',
    extendedProps: {
      event: event,
    },
  }));

  // Handle date click
  const handleDateClick = (arg: any) => {
    const clickedDate = arg.date;
    setSelectedDate(clickedDate);

    // Find all events on this date
    const eventsOnDate = initialEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === clickedDate.getFullYear() &&
        eventDate.getMonth() === clickedDate.getMonth() &&
        eventDate.getDate() === clickedDate.getDate()
      );
    });

    setSelectedEvents(eventsOnDate);
    setDrawerOpen(true);
  };

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event.extendedProps.event as Event;
    setSelectedDate(new Date(event.date));
    setSelectedEvents([event]);
    setDrawerOpen(true);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Calendar Container */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <style jsx global>{`
            .fc {
              font-family: Inter, sans-serif;
            }
            .fc .fc-button {
              background-color: #CC0033;
              border-color: #CC0033;
              text-transform: capitalize;
              font-weight: 600;
            }
            .fc .fc-button:hover {
              background-color: #990029;
              border-color: #990029;
            }
            .fc .fc-button-active {
              background-color: #66001A !important;
              border-color: #66001A !important;
            }
            .fc .fc-daygrid-day-number {
              color: #000000;
              font-weight: 500;
            }
            .fc .fc-col-header-cell-cushion {
              color: #5F6A72;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 0.75rem;
            }
            .fc .fc-event {
              cursor: pointer;
              font-size: 0.875rem;
              padding: 2px 4px;
              border-radius: 4px;
            }
            .fc .fc-event:hover {
              opacity: 0.9;
            }
            .fc .fc-daygrid-day:hover {
              background-color: #F7F7F8;
              cursor: pointer;
            }
            .fc-theme-standard td,
            .fc-theme-standard th {
              border-color: #e5e7eb;
            }
          `}</style>

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth',
            }}
            height="auto"
            contentHeight="auto"
            aspectRatio={1.8}
            eventDisplay="block"
            displayEventTime={false}
          />
        </div>

        {/* Side Drawer for Day Details */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-serif text-2xl">
                {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
              </SheetTitle>
              <SheetDescription>
                {selectedEvents.length === 0
                  ? 'No events scheduled for this day.'
                  : `${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''} on this day`}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {selectedEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  {/* Status Badge */}
                  <Badge className={`status-pill status-pill-${event.status}`}>
                    {event.status.toUpperCase()}
                  </Badge>

                  {/* Title */}
                  <h3 className="font-serif text-xl font-bold text-gray-900">{event.title}</h3>

                  {/* Time */}
                  {event.time_start && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>
                        {event.time_start}
                        {event.time_end && ` - ${event.time_end}`}
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{event.location}</span>
                  </div>

                  {/* Event Details */}
                  {(event.participants || event.rounds) && (
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {event.participants && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{event.participants} participants</span>
                        </div>
                      )}
                      {event.rounds && (
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-primary" />
                          <span>{event.rounds} rounds</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {event.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
                  )}

                  {/* Custom Links */}
                  <div className="flex flex-wrap gap-2">
                    {event.registration_link && (
                      <Button size="sm" asChild>
                        <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                          {event.registration_label || 'Register'}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                    {event.info_link && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={event.info_link} target="_blank" rel="noopener noreferrer">
                          {event.info_label || 'More Info'}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Link href={`/events/${event.slug}`}>
                    <Button className="w-full btn-primary">View Full Details</Button>
                  </Link>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
