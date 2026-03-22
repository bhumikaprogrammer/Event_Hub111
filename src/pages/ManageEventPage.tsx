import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Event } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { ShieldAlert, Calendar, MapPin, Users, Tag } from 'lucide-react';

const ManageEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      apiClient.get<Event>(`/events/${eventId}`)
        .then(response => {
          setEvent(response);
          setLoading(false);
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Failed to fetch event details.');
          setLoading(false);
        });
    }
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <PageHeader title={event ? event.title : 'Loading...'}>
        <Button onClick={() => navigate(`/manage/event/${eventId}/registrations`)}>
          Manage Registrations
        </Button>
      </PageHeader>

      {event && (
        <Card>
          <div className="p-6">
            <p className="text-gray-600 text-sm mb-4">{event.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-500" />
                <span>{event.date} at {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-500" />
                <span>Category: {event.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-500" />
                <span>{event.registeredCount} / {event.capacity} registered</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ManageEventPage;