import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Calendar, MapPin, CheckCircle, Clock, Ticket } from 'lucide-react';
import { Registration } from '../types';
import { useAuthStore } from '../contexts/authStore';
import { apiClient } from '../services/apiClient';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const AttendeeDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchRegistrations();
  }, [user?.id]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAttendeeRegistrations(user!.id);
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">View your registered events and QR codes</p>
      </div>

      <Modal
        isOpen={!!selectedQR}
        onClose={() => setSelectedQR(null)}
        title="Your QR Code"
        size="sm"
        footer={
          <Button onClick={() => setSelectedQR(null)} className="w-full">
            Close
          </Button>
        }
      >
        {selectedQR && <QRCodeDisplay qrCode={selectedQR} />}
      </Modal>

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
                        {registration.event?.date} at {registration.event?.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary-500" />
                      <span>{registration.event?.venue}</span>
                    </div>
                  </div>

                  <Badge
                    variant={registration.attendanceStatus === 'checked_in' ? 'success' : 'primary'}
                    className="inline-flex items-center gap-2"
                  >
                    {getStatusIcon(registration.attendanceStatus)}
                    <span className="capitalize">
                      {registration.attendanceStatus === 'checked_in' ? 'Checked In' : 'Registered'}
                    </span>
                  </Badge>
                </div>

                <Button
                  onClick={() => setSelectedQR(registration.qrCode)}
                  leftIcon={<QrCode className="w-5 h-5" />}
                  className="md:whitespace-nowrap"
                >
                  Show QR Code
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};
