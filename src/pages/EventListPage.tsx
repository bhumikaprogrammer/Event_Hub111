import React, { useState, useEffect } from 'react';
import { Event, Registration } from '../types';
import { apiClient } from '../services/apiClient';
import { useAuthStore } from '../contexts/authStore';
import { PageLayout } from '../components/layout/PageLayout';
import { FilterBar } from '../components/ui/FilterBar';
import { EventCard } from '../components/ui/EventCard';

export const EventListPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedType: '',
    selectedVenue: '',
    selectedDate: '',
    selectedCategory: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, regs] = await Promise.all([
        apiClient.getApprovedEvents(),
        user ? apiClient.getAttendeeRegistrations(user.id) : Promise.resolve([]),
      ]);
      setEvents(data);
      setFilteredEvents(data);
      setMyRegistrations(regs);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = events;

    if (filters.searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.selectedType) {
      filtered = filtered.filter((event) => event.type === filters.selectedType);
    }

    if (filters.selectedVenue) {
      filtered = filtered.filter((event) =>
        event.venue.toLowerCase().includes(filters.selectedVenue.toLowerCase())
      );
    }

    if (filters.selectedDate) {
      filtered = filtered.filter((event) => event.date === filters.selectedDate);
    }

    if (filters.selectedCategory) {
      filtered = filtered.filter((event) => event.category === filters.selectedCategory);
    }

    setFilteredEvents(filtered);
  }, [filters, events]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Discover Events</h1>
        <p className="text-gray-600 dark:text-gray-400">Browse and register for approved events on campus</p>
      </div>

      <FilterBar
        searchTerm={filters.searchTerm}
        selectedType={filters.selectedType}
        selectedVenue={filters.selectedVenue}
        selectedDate={filters.selectedDate}
        selectedCategory={filters.selectedCategory}
        onFilterChange={handleFilterChange}
      />

      {error && (
        <div className="card-base p-6 text-center text-red-600 dark:text-red-400 mb-6">
          {error}
          <button onClick={fetchEvents} className="block mx-auto mt-2 underline text-sm">Retry</button>
        </div>
      )}

      {!error && filteredEvents.length === 0 ? (
        <div className="card-base p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {events.length === 0 ? 'No events available yet.' : 'No events found matching your criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              existingRegistration={myRegistrations.find((r) => String(r.eventId) === String(event.id))}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
};