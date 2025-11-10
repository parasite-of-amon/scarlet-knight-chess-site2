'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Users, Trophy, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/types/database';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  variant?: 'upcoming' | 'past' | 'compact';
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export function EventCard({ event, variant = 'upcoming', onEdit, onDelete, isAdmin }: EventCardProps) {
  const imageUrl = variant === 'past' && event.winners_image
    ? event.winners_image
    : event.images?.[0] || 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=800';

  const formattedDate = format(new Date(event.date), 'MMMM d, yyyy');
  const timeRange = event.time_start && event.time_end
    ? `${event.time_start} - ${event.time_end}`
    : event.time_start || '';

  return (
    <Card className="event-card hover-lift overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-16-9 overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <Badge className={`status-pill status-pill-${event.status}`}>
            {event.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-serif text-xl font-bold text-gray-900 line-clamp-2">
          {event.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-grow space-y-3">
        {/* Date & Time */}
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <div>
            <div className="font-medium">{formattedDate}</div>
            {timeRange && <div className="text-xs">{timeRange}</div>}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <span>{event.location}</span>
        </div>

        {/* Event Details */}
        {variant === 'past' && (event.participants || event.rounds) && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {event.participants && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-primary" />
                <span>{event.participants} players</span>
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

        {variant === 'upcoming' && event.participants && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-primary" />
            <span>Expected: {event.participants} participants</span>
          </div>
        )}

        {/* Description Preview */}
        {event.description && variant !== 'compact' && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Custom Links */}
        <div className="flex flex-wrap gap-2 pt-2">
          {event.registration_link && (
            <Button size="sm" asChild className="text-xs">
              <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                {event.registration_label || 'Register'}
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          )}
          {event.info_link && (
            <Button size="sm" variant="outline" asChild className="text-xs">
              <a href={event.info_link} target="_blank" rel="noopener noreferrer">
                {event.info_label || 'More Info'}
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-4 border-t">
        <Link href={`/events/${event.slug}`} className="w-full">
          <Button className="w-full btn-primary">
            View Details
          </Button>
        </Link>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete} className="flex-1">
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
