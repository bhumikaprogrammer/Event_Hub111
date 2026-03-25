import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Registration } from '../types';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const OrganizerEventRegistrations: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    apiClient.getEventRegistrations(eventId)
      .then(setRegistrations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleApprove = async (registrationId: string) => {
    setActionLoading(registrationId);
    try {
      const updated = await apiClient.approveRegistration(registrationId);
      setRegistrations(prev => prev.map(r => r.id === registrationId ? { ...r, status: updated.status } : r));
    } catch (err) {
      console.error('Failed to approve:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (registrationId: string) => {
    if (!confirm('Are you sure you want to reject this registration?')) return;
    setActionLoading(registrationId);
    try {
      const updated = await apiClient.rejectRegistration(registrationId);
      setRegistrations(prev => prev.map(r => r.id === registrationId ? { ...r, status: updated.status } : r));
    } catch (err) {
      console.error('Failed to reject:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (registrationId: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    setActionLoading(registrationId);
    try {
      await apiClient.deleteRegistration(registrationId);
      setRegistrations(prev => prev.filter(r => r.id !== registrationId));
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const total      = registrations.length;
  const approved   = registrations.filter(r => r.status === 'approved').length;
  const pending    = registrations.filter(r => r.status === 'pending').length;
  const checkedIn  = registrations.filter(r => r.attendanceStatus === 'checked_in').length;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event Registrations</h1>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card padding="md"><p className="text-sm text-gray-500 dark:text-gray-400">Total</p><p className="text-3xl font-bold text-gray-900 dark:text-white">{total}</p></Card>
        <Card padding="md"><p className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</p><p className="text-3xl font-bold text-yellow-500">{pending}</p></Card>
        <Card padding="md"><p className="text-sm text-gray-500 dark:text-gray-400">Approved</p><p className="text-3xl font-bold text-green-600">{approved}</p></Card>
        <Card padding="md"><p className="text-sm text-gray-500 dark:text-gray-400">Checked In</p><p className="text-3xl font-bold text-primary-600">{checkedIn}</p></Card>
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
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Attendee</th>
                <th className="px-6 py-3 text-left">Approval Status</th>
                <th className="px-6 py-3 text-left">Check-in Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {registrations.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{r.user?.name ?? '—'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{r.user?.email ?? '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={r.status === 'approved' ? 'success' : r.status === 'rejected' ? 'error' : 'warning'}>
                      {r.status === 'approved' ? 'Approved' : r.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={r.attendanceStatus === 'checked_in' ? 'success' : r.attendanceStatus === 'no_show' ? 'error' : 'neutral'}>
                      {r.attendanceStatus === 'checked_in' ? 'Checked In' : r.attendanceStatus === 'no_show' ? 'No Show' : 'Not Yet'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {r.status !== 'approved' && (
                        <Button
                          variant="success"
                          size="sm"
                          loading={actionLoading === r.id}
                          onClick={() => handleApprove(r.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {r.status !== 'rejected' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          loading={actionLoading === r.id}
                          onClick={() => handleReject(r.id)}
                        >
                          Reject
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        loading={actionLoading === r.id}
                        onClick={() => handleDelete(r.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </DashboardLayout>
  );
};