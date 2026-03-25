import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Event, Registration } from '../types';
import { useAuthStore } from '../contexts/authStore';
import { apiClient } from '../services/apiClient';

export const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userRegistration, setUserRegistration] = useState<Registration | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const [eventData, myRegs] = await Promise.all([
        apiClient.getEventById(eventId!),
        user ? apiClient.getAttendeeRegistrations(user.id) : Promise.resolve([]),
      ]);
      setEvent(eventData);
      const existing = myRegs.find((r) => String(r.eventId) === String(eventId));
      if (existing) setUserRegistration(existing);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load event details' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!userRegistration || !confirm('Are you sure you want to cancel your registration?')) return;
    try {
      await apiClient.cancelRegistration(userRegistration.id);
      setUserRegistration(null);
      setMessage({ type: 'success', text: 'Your registration has been cancelled.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to cancel registration.' });
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      setMessage(null);
      const registration = await apiClient.registerForEvent(eventId!);
      setUserRegistration(registration);
      setMessage({ type: 'success', text: 'Registration submitted! Your request is pending approval by the organizer. You\'ll find your QR code in your dashboard once approved.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to register for event' });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Event not found</p>
      </div>
    );
  }

  const availableSeats = event.capacity - event.registeredCount;
  const isFull = availableSeats <= 0;
  const isRegistered = !!userRegistration;
  const isOrganizer = user?.id === event.organizerId || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        {/* Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }
            >
              {message.text}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-48 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">{event.type}</span>
          </div>

          {/* Content */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Date & Time</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(`1970-01-01T${event.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Capacity</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.registeredCount}/{event.capacity}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Event</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

            {/* Capacity Bar */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Registration Status
              </h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{
                    width: `${(event.registeredCount / event.capacity) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {event.registeredCount} out of {event.capacity} spots filled
              </p>
              {availableSeats <= 20 && availableSeats > 0 && (
                <p className="text-sm text-orange-600 font-semibold mt-2">
                  Only {availableSeats} seats remaining!
                </p>
              )}
            </div>

            {/* Registration Button */}
            <div className="flex gap-4">
              {isOrganizer ? null : isRegistered ? (
                <>
                  <button
                    disabled
                    className={`flex-1 text-white font-semibold py-3 px-6 rounded-lg cursor-default flex items-center justify-center gap-2 ${
                      userRegistration?.status === 'approved'
                        ? 'bg-green-600'
                        : 'bg-yellow-500'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    {userRegistration?.status === 'approved' ? 'Registered' : 'Pending Approval'}
                  </button>
                  {userRegistration?.status === 'pending' && (
                    <button
                      onClick={handleCancelRegistration}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
                    >
                      Cancel Registration
                    </button>
                  )}
                </>
              ) : isFull ? (
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-gray-200 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                >
                  Event Full
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  {registering ? 'Registering...' : 'Register Now'}
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
