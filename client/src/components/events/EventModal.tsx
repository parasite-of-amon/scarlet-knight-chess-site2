import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Hash, Trophy, ExternalLink, Download, ChevronLeft, ChevronRight, Link as LinkIcon } from "lucide-react";
import { Event, WinnerResult } from "@/lib/eventTypes";
import { format, parseISO } from "date-fns";
import { useEffect } from "react";

interface EventModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

// Sample results data for demonstration
const sampleResults: WinnerResult[] = [
  { place: 1, name: "Alex Johnson", score: "4.5/5", rating: "1850" },
  { place: 2, name: "Sarah Chen", score: "4.0/5", rating: "1720" },
  { place: 3, name: "Michael Torres", score: "3.5/5", rating: "1680" },
  { place: 4, name: "Emily Rodriguez", score: "3.5/5", rating: "1650" },
  { place: 5, name: "David Kim", score: "3.0/5", rating: "1590" },
];

export const EventModal = ({ event, open, onOpenChange, onPrevious, onNext }: EventModalProps) => {
  if (!event) return null;

  const eventDate = parseISO(event.date);
  const formattedDate = format(eventDate, 'EEEE, MMMM dd, yyyy');
  const timeRange = `${event.timeStart} - ${event.timeEnd}`;

  // Google Maps link
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;

  // Generate ICS file
  const generateICS = () => {
    const startDateTime = `${event.date}T${event.timeStart.replace(':', '')}00`;
    const endDateTime = `${event.date}T${event.timeEnd.replace(':', '')}00`;

    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.slug}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowLeft' && onPrevious) {
        e.preventDefault();
        onPrevious();
      }
      if (e.key === 'ArrowRight' && onNext) {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onPrevious, onNext]);

  const isPastEvent = event.status === 'past';
  const heroImage = isPastEvent && event.winnersImage ? event.winnersImage : event.images[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-modal="true"
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl font-bold">{event.title}</DialogTitle>
          <DialogDescription>
            {formattedDate} • {timeRange}
          </DialogDescription>
        </DialogHeader>

        {/* Navigation arrows */}
        <div className="absolute top-4 right-16 flex gap-2">
          {onPrevious && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              aria-label="Previous event"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          {onNext && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              aria-label="Next event"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Hero Image */}
            {heroImage && (
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={heroImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {event.isRecurring && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium">
                    Recurring Event
                  </div>
                )}
              </div>
            )}

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#CC0033] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{formattedDate}</div>
                    <div className="text-sm text-[#5F6A72]">{timeRange}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#CC0033] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{event.location}</div>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#CC0033] hover:underline inline-flex items-center gap-1"
                    >
                      View on Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {event.participants && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#5F6A72]" />
                    <span className="text-sm">{event.participants} Participants</span>
                  </div>
                )}
                {event.rounds && (
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-[#5F6A72]" />
                    <span className="text-sm">{event.rounds} Rounds</span>
                  </div>
                )}
                {event.rating && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#5F6A72]" />
                    <Badge className="bg-[#CC0033]">{event.rating} Rated</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h3 className="font-serif text-xl font-bold mb-3">About This Event</h3>
                <p className="text-[#5F6A72] leading-relaxed">{event.description}</p>
              </div>
            )}

            {/* Tags */}
            {event.tags.length > 0 && (
              <div>
                <h3 className="font-serif text-lg font-bold mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Links */}
            {(event.links.registration || event.links.info || event.links.resource) && (
              <div>
                <h3 className="font-serif text-lg font-bold mb-3">Links & Resources</h3>
                <div className="space-y-2">
                  {event.links.registration && (
                    <a
                      href={event.links.registration.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#CC0033] hover:underline"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {event.links.registration.label}
                    </a>
                  )}
                  {event.links.info && (
                    <a
                      href={event.links.info.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#CC0033] hover:underline"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {event.links.info.label}
                    </a>
                  )}
                  {event.links.resource && (
                    <a
                      href={event.links.resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#CC0033] hover:underline"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {event.links.resource.label}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Add to Calendar */}
            <div className="pt-4 border-t">
              <Button
                onClick={generateICS}
                className="w-full bg-[#CC0033] hover:bg-[#CC0033]/90"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6 mt-6">
            {event.winnersImage && (
              <div>
                <h3 className="font-serif text-xl font-bold mb-3 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-[#CC0033]" />
                  Winners Photo
                </h3>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={event.winnersImage}
                    alt={`${event.title} Winners`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div>
              <h3 className="font-serif text-xl font-bold mb-3">Tournament Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#CC0033]">
                      <th className="text-left p-3 font-serif">Place</th>
                      <th className="text-left p-3 font-serif">Player</th>
                      <th className="text-left p-3 font-serif">Score</th>
                      <th className="text-left p-3 font-serif">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleResults.map((result) => (
                      <tr key={result.place} className="border-b hover:bg-[#F7F7F8]">
                        <td className="p-3 font-medium">
                          {result.place === 1 && '🥇'}
                          {result.place === 2 && '🥈'}
                          {result.place === 3 && '🥉'}
                          {result.place > 3 && result.place}
                        </td>
                        <td className="p-3">{result.name}</td>
                        <td className="p-3 font-medium">{result.score}</td>
                        <td className="p-3 text-[#5F6A72]">{result.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download PGN
              </Button>
              <Button variant="outline" className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Full Results
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
