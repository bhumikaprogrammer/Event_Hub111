import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';
import { Event } from '../../types';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { apiClient } from '../../services/apiClient';
import { useAuthStore } from '../../contexts/authStore';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'registering' | 'success' | 'error'>('idle');
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const availableSeats = event.capacity - event.registeredCount;
  const fillPercentage = (event.registeredCount / event.capacity) * 100;

  const handleRegister = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click-through
    if (!user) {
      navigate('/login');
      return;
    }

    setRegistrationStatus('registering');
    setRegistrationError(null);
    try {
      await apiClient.registerForEvent(event.id.toString());
      setRegistrationStatus('success');
    } catch (err: any) {
      setRegistrationStatus('error');
      setRegistrationError(err.response?.data?.message || 'Registration failed.');
    } 
  };

  return (
    <Card interactive padding="none" className="overflow-hidden flex flex-col h-full">
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 h-32 flex items-center justify-center">
        <Badge variant="primary" className="text-white text-lg px-6 py-2 bg-white/20">
          {event.type}
        </Badge>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>
              {event.date} at {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary-500" />
            <span>{event.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-500" />
            <span>
              {event.registeredCount}/{event.capacity} registered
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${fillPercentage}%` }}
          ></div>
        </div>

        {registrationError && (
          <p className="text-xs text-red-600 text-center mb-2">{registrationError}</p>
        )}

        <div className="flex gap-2">
          <Button variant="secondary" size="md" onClick={() => navigate(`/events/${event.id}`)} className="flex-1">
            View Details
          </Button>
          {availableSeats > 0 ? (
            <Button
              variant={registrationStatus === 'success' ? 'success' : 'primary'}
              size="md"
              className="flex-1"
              onClick={handleRegister}
              loading={registrationStatus === 'registering'}
              disabled={registrationStatus === 'success'}
            >
              {registrationStatus === 'success' ? 'Registered' : 'Register'}
            </Button>
          ) : (
            <Button variant="outline" size="md" disabled className="flex-1">
              Full
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};