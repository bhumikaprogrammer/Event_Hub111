import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';
import { Event, Registration } from '../../types';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { apiClient } from '../../services/apiClient';
import { useAuthStore } from '../../contexts/authStore';

interface EventCardProps {
  event: Event;
  existingRegistration?: Registration;
}

export const EventCard: React.FC<EventCardProps> = ({ event, existingRegistration }) => {
  const navigate = useNavigate();
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'registering' | 'success' | 'error'>(
    existingRegistration ? 'success' : 'idle'
  );
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentRegistration, setCurrentRegistration] = useState<Registration | undefined>(existingRegistration);
  const user = useAuthStore((state) => state.user);

  const availableSeats = event.capacity - event.registeredCount;
  const fillPercentage = (event.registeredCount / event.capacity) * 100;
  const isOrganizer = String(user?.id) === String(event.organizerId);
  const isExpired = new Date(event.date) < new Date(new Date().toDateString());

  const handleRegister = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click-through
    if (!user) {
      navigate('/login');
      return;
    }

    setRegistrationStatus('registering');
    setRegistrationError(null);
    try {
      const reg = await apiClient.registerForEvent(event.id.toString());
      setCurrentRegistration(reg);
      setRegistrationStatus('success');
      setSuccessMessage('Registration submitted! Pending approval by the organizer.');
      setTimeout(() => setSuccessMessage(null), 4000);
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
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>
              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}{' '}
              at {new Date(`1970-01-01T${event.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
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
          {(isOrganizer || user?.role === 'admin') && (
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant={event.status === 'approved' ? 'success' : event.status === 'rejected' ? 'error' : 'warning'}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
              {new Date(event.date) < new Date(new Date().toDateString()) && (
                <Badge variant="neutral">Expired</Badge>
              )}
            </div>
          )}
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${fillPercentage}%` }}
          ></div>
        </div>

        {successMessage && (
          <p className="text-xs text-green-600 text-center mb-2">{successMessage}</p>
        )}
        {registrationError && (
          <p className="text-xs text-red-600 text-center mb-2">{registrationError}</p>
        )}

        <div className="flex gap-2">
          <Button variant="secondary" size="md" onClick={() => navigate(`/events/${event.id}`)} className="flex-1">
            View Details
          </Button>
          {String(user?.id) !== String(event.organizerId) && user?.role !== 'admin' && (isExpired ? (
            <Button variant="outline" size="md" disabled className="flex-1">
              Expired
            </Button>
          ) : availableSeats > 0 ? (
            <Button
              variant={registrationStatus === 'success'
                ? currentRegistration?.status === 'approved' ? 'success' : 'warning'
                : 'primary'}
              size="md"
              className="flex-1"
              onClick={handleRegister}
              loading={registrationStatus === 'registering'}
              disabled={registrationStatus === 'success'}
            >
              {registrationStatus === 'success'
                ? currentRegistration?.status === 'approved' ? 'Registered' : 'Pending Approval'
                : 'Register'}
            </Button>
          ) : (
            <Button variant="outline" size="md" disabled className="flex-1">
              Full
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};