'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ExternalLink,
  Download,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import type { EventWithWinners } from '@/types/database';
import { format } from 'date-fns';

interface EventDetailClientProps {
  event: EventWithWinners;
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  const [selectedTab, setSelectedTab] = useState('overview');

  const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
  const timeRange =
    event.time_start && event.time_end
      ? `${event.time_start} - ${event.time_end}`
      : event.time_start || '';

  const hasWinners = event.winners && event.winners.length > 0;
  const isPastEvent = event.status === 'past';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description || '',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddToCalendar = () => {
    const startDate = new Date(event.date);
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || '');
    const location = encodeURIComponent(event.location);

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;

    window.open(googleCalUrl, '_blank');
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[400px] bg-gray-900">
        <Image
          src={
            isPastEvent && event.winners_image
              ? event.winners_image
              : event.images?.[0] || 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1600'
          }
          alt={event.title}
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Link href={isPastEvent ? '/events/past' : '/events/upcoming'}>
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Button>
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Badge className={`status-pill status-pill-${event.status} mb-4`}>
              {event.status.toUpperCase()}
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              {timeRange && (
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>{timeRange}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {event.status === 'upcoming' && (
              <Button onClick={handleAddToCalendar} className="gap-2">
                <Calendar className="w-4 h-4" />
                Add to Calendar
              </Button>
            )}
            {event.registration_link && (
              <Button asChild>
                <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                  {event.registration_label || 'Register'}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
            {event.info_link && (
              <Button variant="outline" asChild>
                <a href={event.info_link} target="_blank" rel="noopener noreferrer">
                  {event.info_label || 'More Info'}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="results" disabled={!hasWinners}>
                Results {hasWinners && `(${event.winners.length})`}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Event Details Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="font-serif text-2xl font-bold mb-4">Event Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {event.participants && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Participants</div>
                          <div className="font-semibold text-gray-900">{event.participants} players</div>
                        </div>
                      </div>
                    )}

                    {event.rounds && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Rounds</div>
                          <div className="font-semibold text-gray-900">{event.rounds} rounds</div>
                        </div>
                      </div>
                    )}

                    {event.rating && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Rating</div>
                          <div className="font-semibold text-gray-900">{event.rating}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Date</div>
                      <div className="font-semibold text-gray-900">{formattedDate}</div>
                    </div>

                    {timeRange && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Time</div>
                        <div className="font-semibold text-gray-900">{timeRange}</div>
                      </div>
                    )}

                    <div>
                      <div className="text-sm text-gray-600 mb-1">Location</div>
                      <div className="font-semibold text-gray-900">{event.location}</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="font-serif text-2xl font-bold mb-4">About This Event</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                </div>
              )}

              {/* Image Gallery */}
              {event.images && event.images.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="font-serif text-2xl font-bold mb-4">Photos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.images.map((image, index) => (
                      <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                        <Image
                          src={image}
                          alt={`${event.title} - Photo ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-6">
              {hasWinners && (
                <>
                  {/* Winners Podium */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-serif text-2xl font-bold">Tournament Winners</h2>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export Results
                      </Button>
                    </div>

                    {/* Top 3 Podium */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                      {event.winners.slice(0, 3).map((winner) => (
                        <div
                          key={winner.id}
                          className="text-center p-6 bg-gradient-to-b from-primary/5 to-transparent rounded-lg border-2 border-primary/20"
                        >
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                            <Trophy className={`w-8 h-8 ${winner.place === 1 ? 'text-yellow-500' : winner.place === 2 ? 'text-gray-400' : 'text-amber-700'}`} />
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-1">{winner.place}{winner.place === 1 ? 'st' : winner.place === 2 ? 'nd' : 'rd'} Place</div>
                          <div className="font-serif text-xl font-semibold text-primary mb-1">{winner.name}</div>
                          {winner.score && <div className="text-sm text-gray-600">Score: {winner.score}</div>}
                        </div>
                      ))}
                    </div>

                    {/* Full Results Table */}
                    {event.winners.length > 3 && (
                      <>
                        <h3 className="font-semibold text-lg mb-4">Complete Results</h3>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Place</TableHead>
                                <TableHead>Player</TableHead>
                                <TableHead>Score</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {event.winners.map((winner) => (
                                <TableRow key={winner.id}>
                                  <TableCell className="font-medium">{winner.place}</TableCell>
                                  <TableCell className="font-semibold">{winner.name}</TableCell>
                                  <TableCell>{winner.score || '-'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Winners Photo */}
                  {event.winners_image && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="font-semibold text-lg mb-4">Winners Photo</h3>
                      <div className="relative aspect-video overflow-hidden rounded-lg">
                        <Image
                          src={event.winners_image}
                          alt="Tournament Winners"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
