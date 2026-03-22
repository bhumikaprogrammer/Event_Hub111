import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, Clock, Ticket } from 'lucide-react';
import { Registration } from '../types';
import { useAuthStore } from '../contexts/authStore';
import { apiClient } from '../services/apiClient';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

// A new component to handle authenticated QR code image loading
const QrCodeImage: React.FC<{ registrationId: string }> = ({ registrationId }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string;

    const fetchQrCode = async () => {
      if (!registrationId) {
        setError('Invalid registration ID.');
        return;
      }
      try {
        const blob = await apiClient.getQrCodeForRegistration(registrationId);
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (err) {
        console.error('Failed to fetch QR code:', err);
        setError('Could not load QR code.');
      }
    };

    fetchQrCode();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [registrationId]);

  if (error) {
    return <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-gray-100 text-red-500 text-xs text-center p-2">{error}</div>;
  }

  if (!imageUrl) {
    return (
      <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return <img src={imageUrl} alt="QR Code for your ticket" className="w-32 h-32 md:w-40 md:h-40" />;
};

export const AttendeeDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchRegistrations();
  }, [user?.id]);

  const fetchRegistrations = async () => {
    if (!user) return;
    try {
      setRegistrations([]); // Clear existing registrations to prevent duplication
      setLoading(true);
      // Revert to the correct API client method and pass the user ID
      const data = await apiClient.getAttendeeRegistrations(user.id);
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'checked_in') return <CheckCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Tickets</h1>
        <p className="text-gray-600 dark:text-gray-400">Your personal QR code tickets for upcoming events</p>
      </div>

      {registrations.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">You haven't registered for any events yet</p>
          <Button onClick={() => navigate('/events')}>Browse Events</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {registrations.map((registration) => (
            <Card key={registration.id} interactive padding="md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{registration.event?.title}</h3>

                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary-500" />
                      <span>
                        {new Date(registration.event!.date).toLocaleDateString()} at {registration.event?.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary-500" />
                      <span>{registration.event?.venue}</span>
                    </div>
                  </div>

                  <Badge
                    color={registration.attendanceStatus === 'checked_in' ? 'green' : 'gray'} // Fix: use camelCase
                    className="inline-flex items-center gap-2 capitalize"
                  >
                    {getStatusIcon(registration.attendanceStatus)} {registration.attendanceStatus.replace('_', ' ')} 
                  </Badge>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <QrCodeImage registrationId={registration.id} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};