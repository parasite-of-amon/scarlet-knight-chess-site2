import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { EventFilters } from "@/lib/eventTypes";

interface FilterBarProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

export const FilterBar = ({ filters, onFiltersChange }: FilterBarProps) => {
  const handleClearAll = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.type ||
    filters.rating ||
    filters.rounds ||
    filters.year
  );

  return (
    <div className="bg-white border-2 rounded-lg p-6 space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#5F6A72]" />
          <Input
            type="text"
            placeholder="Search events..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <Select
          value={filters.type || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, type: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Tournament">Tournament</SelectItem>
            <SelectItem value="Workshop">Workshop</SelectItem>
            <SelectItem value="Social">Social</SelectItem>
            <SelectItem value="Exhibition">Exhibition</SelectItem>
            <SelectItem value="Blitz">Blitz</SelectItem>
          </SelectContent>
        </Select>

        {/* Rating Filter */}
        <Select
          value={filters.rating || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, rating: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="USCF">USCF</SelectItem>
            <SelectItem value="FIDE">FIDE</SelectItem>
            <SelectItem value="Unrated">Unrated</SelectItem>
          </SelectContent>
        </Select>

        {/* Rounds Filter */}
        <Select
          value={filters.rounds?.toString() || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, rounds: value === 'all' ? undefined : parseInt(value) })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Rounds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rounds</SelectItem>
            <SelectItem value="4">4 Rounds</SelectItem>
            <SelectItem value="5">5 Rounds</SelectItem>
            <SelectItem value="6">6 Rounds</SelectItem>
            <SelectItem value="7">7 Rounds</SelectItem>
          </SelectContent>
        </Select>

        {/* Year Filter */}
        <Select
          value={filters.year?.toString() || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, year: value === 'all' ? undefined : parseInt(value) })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear All */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-[#CC0033] hover:text-[#CC0033]/90"
          >
            <X className="w-4 h-4 mr-2" />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};
