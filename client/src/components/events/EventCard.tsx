import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Hash, Trophy } from "lucide-react";
import { Event } from "@/lib/eventTypes";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  variant?: 'upcoming' | 'past' | 'compact';
  onClick?: () => void;
}

export const EventCard = ({ event, variant = 'upcoming', onClick }: EventCardProps) => {
  const isPast = variant === 'past';
  const isCompact = variant === 'compact';

  const coverImage = isPast && event.winnersImage
    ? event.winnersImage
    : event.images[0] || 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1600&h=900&fit=crop';

  const eventDate = parseISO(event.date);
  const formattedDate = format(eventDate, 'MMM dd, yyyy');
  const timeRange = `${event.timeStart} - ${event.timeEnd}`;

  return (
    <Card
      className={cn(
        "group overflow-hidden border-2 hover:border-[#CC0033] transition-all duration-300 cursor-pointer",
        "hover:shadow-xl",
        isCompact && "max-w-sm"
      )}
      onClick={onClick}
      data-testid={`event-card-${event.id}`}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-200">
        <img
          src={coverImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {isPast && event.winnersImage && (
          <div className="absolute top-2 right-2 bg-[#CC0033] text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
            <Trophy className="w-4 h-4" />
            Winners
          </div>
        )}
        {event.isRecurring && (
          <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
            Recurring
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className={cn(
          "font-serif font-bold mb-3 line-clamp-2 group-hover:text-[#CC0033] transition-colors",
          isCompact ? "text-xl" : "text-2xl"
        )}>
          {event.title}
        </h3>

        <div className="space-y-2 mb-4 text-sm text-[#5F6A72]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formattedDate} • {timeRange}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {!isCompact && event.description && (
          <p className="text-sm text-[#5F6A72] mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {event.participants && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {event.participants} players
            </Badge>
          )}
          {event.rounds && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {event.rounds} rounds
            </Badge>
          )}
          {event.rating && (
            <Badge className="bg-[#CC0033] hover:bg-[#CC0033]/90">
              {event.rating}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-[#F7F7F8] text-[#5F6A72] rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {!isPast && !event.winnersImage && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-[#5F6A72] mb-2">Top 3 Placeholders:</div>
            <div className="space-y-1 text-sm text-[#5F6A72]">
              <div>🥇 1st Place: TBD</div>
              <div>🥈 2nd Place: TBD</div>
              <div>🥉 3rd Place: TBD</div>
            </div>
          </div>
        )}

        <Button
          className="w-full mt-4 bg-[#CC0033] hover:bg-[#CC0033]/90 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
