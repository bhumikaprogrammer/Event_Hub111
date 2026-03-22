import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Registration } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { User, ShieldAlert } from 'lucide-react';

const ManageRegistrationsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchRegistrations();
    }
  }, [eventId]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Registration[]>(`/events/${eventId}/attendees`);
      setRegistrations(response);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch registrations.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId: string) => {
    try {
      await apiClient.post(`/registrations/${registrationId}/approve`);
      fetchRegistrations(); // Refresh the list
    } catch (err) {
      console.error('Failed to approve registration:', err);
    }
  };

  const handleReject = async (registrationId: string) => {
    try {
      await apiClient.post(`/registrations/${registrationId}/reject`);
      fetchRegistrations(); // Refresh the list
    } catch (err) {
      console.error('Failed to reject registration:', err);
    }
  };

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

  const pendingRegistrations = registrations.filter(r => r.status === 'pending');
  const approvedRegistrations = registrations.filter(r => r.status === 'approved');

  return (
    <div className="container mx-auto p-4">
      <PageHeader title="Manage Registrations" />

      <section>
        <h2 className="text-2xl font-semibold mb-4">Pending Approval ({pendingRegistrations.length})</h2>
        {pendingRegistrations.length > 0 ? (
          <div className="space-y-4">
            {pendingRegistrations.map(reg => (
              <Card key={reg.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <User className="w-8 h-8 text-gray-500" />
                  <div>
                    <p className="font-semibold">{reg.user ? reg.user.name : 'User not found'}</p>
                    <p className="text-sm text-gray-600">{reg.user ? reg.user.email : '-'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleApprove(reg.id)}>Approve</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleReject(reg.id)}>Reject</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p>No pending registrations.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Approved Attendees ({approvedRegistrations.length})</h2>
        {approvedRegistrations.length > 0 ? (
          <div className="space-y-4">
            {approvedRegistrations.map(reg => (
              <Card key={reg.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <User className="w-8 h-8 text-gray-500" />
                  <div>
                    <p className="font-semibold">{reg.user ? reg.user.name : 'User not found'}</p>
                    <p className="text-sm text-gray-600">{reg.user ? reg.user.email : '-'}</p>
                  </div>
                </div>
                <p className="text-green-600 font-semibold">Approved</p>
              </Card>
            ))}
          </div>
        ) : (
          <p>No approved attendees yet.</p>
        )}
      </section>
    </div>
  );
};

export default ManageRegistrationsPage;