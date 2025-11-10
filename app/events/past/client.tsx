'use client';

import { useState, useMemo } from 'react';
import { EventCard } from '@/components/events/EventCard';
import { FilterBar, type FilterValues } from '@/components/events/FilterBar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { EventWithWinners } from '@/types/database';
import { LayoutGrid, Table as TableIcon, Trophy, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface PastEventsClientProps {
  initialEvents: EventWithWinners[];
}

type SortField = 'date' | 'title' | 'participants' | 'rounds';
type SortDirection = 'asc' | 'desc';

export function PastEventsClient({ initialEvents }: PastEventsClientProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    type: 'all',
    rating: 'all',
    rounds: 'all',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter and sort events
  const processedEvents = useMemo(() => {
    let filtered = initialEvents.filter((event) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(searchLower);
        const matchesDescription = event.description?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }

      if (filters.type !== 'all') {
        const hasTypeTag = event.tags?.some((tag) =>
          tag.toLowerCase().includes(filters.type.toLowerCase())
        );
        if (!hasTypeTag) return false;
      }

      if (filters.rating !== 'all' && event.rating !== filters.rating) {
        return false;
      }

      if (filters.rounds !== 'all') {
        if (!event.rounds) return false;
        const roundsNum = parseInt(filters.rounds);
        if (filters.rounds === '8') {
          if (event.rounds < 8) return false;
        } else {
          if (event.rounds !== roundsNum) return false;
        }
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'participants':
          comparison = (a.participants || 0) - (b.participants || 0);
          break;
        case 'rounds':
          comparison = (a.rounds || 0) - (b.rounds || 0);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [initialEvents, filters, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar onFilterChange={setFilters} showDateRange={false} />
        </div>

        {/* View Toggle & Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{processedEvents.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{initialEvents.length}</span> events
          </p>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <TableIcon className="w-4 h-4 mr-2" />
              Table
            </Button>
          </div>
        </div>

        {/* Content */}
        {processedEvents.length > 0 ? (
          viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="past" />
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        onClick={() => toggleSort('date')}
                        className="flex items-center gap-1 hover:text-primary focus-ring"
                      >
                        Date
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => toggleSort('title')}
                        className="flex items-center gap-1 hover:text-primary focus-ring"
                      >
                        Event
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>
                      <button
                        onClick={() => toggleSort('rounds')}
                        className="flex items-center gap-1 hover:text-primary focus-ring"
                      >
                        Rounds
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </TableHead>
                    <TableHead>Winner</TableHead>
                    <TableHead>
                      <button
                        onClick={() => toggleSort('participants')}
                        className="flex items-center gap-1 hover:text-primary focus-ring"
                      >
                        Players
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedEvents.map((event) => {
                    const firstPlace = event.winners?.find((w) => w.place === 1);
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500">{event.location}</div>
                        </TableCell>
                        <TableCell>
                          {event.rating && (
                            <Badge variant="secondary" className="text-xs">
                              {event.rating}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{event.rounds || '-'}</TableCell>
                        <TableCell>
                          {firstPlace ? (
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <div>
                                <div className="font-medium">{firstPlace.name}</div>
                                <div className="text-xs text-gray-500">{firstPlace.score}</div>
                              </div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{event.participants || '-'}</TableCell>
                        <TableCell>
                          <Link href={`/events/${event.slug}`}>
                            <Button size="sm" variant="ghost">
                              View Details
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">No past events found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filters.search || filters.type !== 'all' || filters.rating !== 'all' || filters.rounds !== 'all'
                ? 'Try adjusting your filters to see more events.'
                : 'No past events available.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
