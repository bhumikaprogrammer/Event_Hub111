import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Calendar, MapPin, Users, Eye } from 'lucide-react';
import { Event } from '../types';
import { apiClient } from '../services/apiClient';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../contexts/authStore';

export const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role !== 'organizer' && user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchOrganizerEvents();
  }, [user, navigate]);

  const fetchOrganizerEvents = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getOrganizerEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching organizer events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await apiClient.deleteEvent(eventId);
        fetchOrganizerEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Events</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your created events</p>
        </div>
        <Button onClick={() => navigate('/events/create')}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">You haven't created any events yet.</p>
          <Button onClick={() => navigate('/events/create')}>Create Your First Event</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} padding="none" className="overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      event.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : event.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {event.status}
                  </span>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{event.registeredCount || 0}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`/organizer/events/${event.id}/attendees`)}>
                  <Eye className="w-4 h-4 mr-1.5" />
                  Attendees
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate(`/events/${event.id}/edit`)}>
                  <Edit className="w-4 h-4 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 border-red-500 hover:bg-red-50 dark:text-red-500 dark:border-red-600 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};