'use client';

import { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Search, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

export interface FilterValues {
  search: string;
  type: string;
  rating: string;
  rounds: string;
  dateRange?: DateRange;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void;
  showDateRange?: boolean;
}

export function FilterBar({ onFilterChange, showDateRange = false }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    type: 'all',
    rating: 'all',
    rounds: 'all',
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Trigger filter change when debounced search or other filters change
  useEffect(() => {
    onFilterChange({ ...filters, search: debouncedSearch });
  }, [debouncedSearch, filters.type, filters.rating, filters.rounds, filters.dateRange, onFilterChange]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleTypeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, type: value }));
  };

  const handleRatingChange = (value: string) => {
    setFilters((prev) => ({ ...prev, rating: value }));
  };

  const handleRoundsChange = (value: string) => {
    setFilters((prev) => ({ ...prev, rounds: value }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      rating: 'all',
      rounds: 'all',
      dateRange: undefined,
    });
  };

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.rating !== 'all' ||
    filters.rounds !== 'all' || filters.dateRange;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search events by title or description..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 focus-ring"
        />
        {filters.search && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Type Filter */}
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="focus-ring">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="tournament">Tournament</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="social">Social</SelectItem>
          </SelectContent>
        </Select>

        {/* Rating Filter */}
        <Select value={filters.rating} onValueChange={handleRatingChange}>
          <SelectTrigger className="focus-ring">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="USCF">USCF Rated</SelectItem>
            <SelectItem value="Casual">Casual</SelectItem>
            <SelectItem value="Unrated">Unrated</SelectItem>
          </SelectContent>
        </Select>

        {/* Rounds Filter */}
        <Select value={filters.rounds} onValueChange={handleRoundsChange}>
          <SelectTrigger className="focus-ring">
            <SelectValue placeholder="Rounds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rounds</SelectItem>
            <SelectItem value="3">3 Rounds</SelectItem>
            <SelectItem value="5">5 Rounds</SelectItem>
            <SelectItem value="6">6 Rounds</SelectItem>
            <SelectItem value="7">7 Rounds</SelectItem>
            <SelectItem value="8">8+ Rounds</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        {showDateRange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal focus-ring">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, 'LLL dd, y')} -{' '}
                      {format(filters.dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(filters.dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active Filters & Clear Button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.search}
                <button onClick={() => handleSearchChange('')} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.type !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Type: {filters.type}
                <button onClick={() => handleTypeChange('all')} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.rating !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Rating: {filters.rating}
                <button onClick={() => handleRatingChange('all')} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.rounds !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Rounds: {filters.rounds}
                <button onClick={() => handleRoundsChange('all')} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="flex-shrink-0">
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
