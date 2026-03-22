import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Registration } from '../types';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const OrganizerEventRegistrations: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    apiClient.getEventRegistrations(eventId)
      .then(setRegistrations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [eventId]);

  const total = registrations.length;
  const checkedIn = registrations.filter(r => r.attendanceStatus === 'checked_in').length;
  const pending  = registrations.filter(r => r.attendanceStatus === 'registered').length;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event Registrations</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card padding="md"><p className="text-sm text-gray-500 dark:text-gray-400">Total</p><p className="text-3xl font-bold text-gray-900 dark:text-white">{total}</p></Card>
        <Card padding="md"><p className="text-sm text-gray-500 dark:text-gray-400">Checked In</p><p className="text-3xl font-bold text-green-600">{checkedIn}</p></Card>
        <Card padding="md"><p className="text-sm text-gray-500 dark:text-gray-400">Pending</p><p className="text-3xl font-bold text-orange-500">{pending}</p></Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : registrations.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-gray-500 dark:text-gray-400">No registrations yet.</p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {registrations.map(r => (
              <div key={r.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{r.user?.name ?? '—'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{r.user?.email} · QR: <span className="font-mono">{r.qrCode}</span></p>
                  <p className="text-xs text-gray-400 mt-1">Registered: {new Date(r.registeredAt ?? '').toLocaleDateString()}</p>
                </div>
                <Badge
                  variant={r.attendanceStatus === 'checked_in' ? 'success' : r.attendanceStatus === 'no_show' ? 'error' : 'warning'}
                >
                  {r.attendanceStatus === 'checked_in' ? 'Checked In' : r.attendanceStatus === 'no_show' ? 'No Show' : 'Registered'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};