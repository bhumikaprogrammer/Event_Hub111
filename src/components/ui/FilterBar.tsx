import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';

interface FilterBarProps {
  searchTerm: string;
  selectedType: string;
  selectedVenue: string;
  selectedDate: string;
  selectedCategory: string;
  onFilterChange: (key: string, value: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  selectedType,
  selectedVenue,
  selectedDate,
  selectedCategory,
  onFilterChange,
}) => {
  return (
    <div className="card-base p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Events</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Search"
          type="text"
          placeholder="Event name or description..."
          value={searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
          leftIcon={<Search className="w-5 h-5" />}
        />

        <Select
          label="Event Type"
          value={selectedType}
          onChange={(e) => onFilterChange('selectedType', e.target.value)}
          options={[
            { label: 'All Types', value: '' },
            { label: 'Conference', value: 'Conference' },
            { label: 'Workshop', value: 'Workshop' },
            { label: 'Seminar', value: 'Seminar' },
            { label: 'Networking', value: 'Networking' },
          ]}
        />

        <Input
          label="Venue"
          type="text"
          placeholder="Location..."
          value={selectedVenue}
          onChange={(e) => onFilterChange('selectedVenue', e.target.value)}
        />

        <Input
          label="Date"
          type="date"
          value={selectedDate}
          onChange={(e) => onFilterChange('selectedDate', e.target.value)}
        />

        <Select
          label="Category"
          value={selectedCategory}
          onChange={(e) => onFilterChange('selectedCategory', e.target.value)}
          options={[
            { label: 'All Categories', value: '' },
            { label: 'College', value: 'College' },
            { label: 'Groups', value: 'Groups' },
          ]}
        />
      </div>
    </div>
  );
};