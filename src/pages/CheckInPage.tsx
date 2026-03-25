import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, User, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { Registration } from '../types';
import { apiClient } from '../services/apiClient';
import { useAuthStore } from '../contexts/authStore';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const CheckInPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { user } = useAuthStore();
  const canCheckIn = user?.role === 'organizer' || user?.role === 'admin';
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkInState, setCheckInState] = useState<'idle' | 'success' | 'already_used'>('idle');
  const [checkInLoading, setCheckInLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    apiClient.getRegistrationByToken(token)
      .then((data) => {
        setRegistration(data);
        if (data.attendanceStatus === 'checked_in') {
          setCheckInState('already_used');
        }
      })
      .catch((err: any) => setError(err.response?.data?.message || 'Invalid or unrecognised ticket.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleCheckIn = async () => {
    if (!registration || !token) return;
    setCheckInLoading(true);
    try {
      const updated = await apiClient.checkIn(token, registration.eventId);
      setRegistration(updated);
      setCheckInState('success');
    } catch (err: any) {
      const msg = err.response?.data?.message || '';
      if (err.response?.status === 400) {
        setCheckInState('already_used');
      } else {
        setError(msg || 'Check-in failed.');
      }
    } finally {
      setCheckInLoading(false);
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

  if (error || !registration) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-16">
          <Card padding="lg" className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid Ticket</h2>
            <p className="text-gray-500">{error || 'This ticket could not be found.'}</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-8">
        <Card padding="lg">
          {checkInState === 'success' ? (
            <div className="text-center py-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Admitted!</h2>
              <p className="text-gray-500 dark:text-gray-400">{registration.user?.name} has been checked in.</p>
            </div>
          ) : checkInState === 'already_used' ? (
            <div className="text-center py-4">
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Ticket Already Used</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-2">{registration.user?.name} was already admitted.</p>
              {registration.checkedInAt && (
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                  Checked in at {new Date(registration.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                  {new Date(registration.checkedInAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Ticket Verification</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Attendee</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{registration.user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Event</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{registration.event?.title}</p>
                  </div>
                </div>

                {registration.event?.venue && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary-500 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Venue</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{registration.event.venue}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                    <Badge variant="success">Approved</Badge>
                  </div>
                </div>
              </div>

              {canCheckIn ? (
                <Button
                  className="w-full"
                  onClick={handleCheckIn}
                  loading={checkInLoading}
                >
                  Check In Attendee
                </Button>
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">Only the event organizer can check in attendees.</p>
              )}
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};
