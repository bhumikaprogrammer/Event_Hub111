import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const isEditing = !!eventId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('College');
  const [capacity, setCapacity] = useState(100);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    apiClient.getEventById(eventId!).then((event) => {
      setTitle(event.title);
      setDescription(event.description);
      setDate(event.date.toString().slice(0, 10));
      setTime(event.time);
      setVenue(event.venue);
      setCategory(event.category);
      setCapacity(event.capacity);
    }).catch(() => setError('Failed to load event.')).finally(() => setLoading(false));
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await apiClient.updateEvent(eventId!, { title, description, date, time, venue, category, capacity });
      } else {
        await apiClient.createEvent({ title, description, date, time, venue, category, capacity, type: 'Conference' });
      }
      navigate('/organizer/dashboard');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} event. Please check the details and try again.`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/organizer/dashboard')} className="mb-4">
          <span className="flex items-center gap-1.5"><ArrowLeft className="h-4 w-4" />Back to My Events</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Event' : 'Create New Event'}</h1>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          
          <Input label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Input label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>

          <Input label="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { label: 'College', value: 'College' },
              { label: 'Groups', value: 'Groups' },
            ]}
          />

          <Input label="Capacity" type="number" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value, 10))} required />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Event')}
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
};