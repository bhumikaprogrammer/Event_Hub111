import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, BarChart3, Users } from 'lucide-react';
import { Event } from '../types';
import { apiClient } from '../services/apiClient';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';

export const AdminDashboard: React.FC = () => {
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalUsers: 0, totalRegistrations: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ type: 'approve' | 'reject'; event: Event } | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [eventsData, statsData] = await Promise.all([
        apiClient.getPendingEvents(),
        apiClient.getAdminStats(),
      ]);
      setPendingEvents(eventsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    setActionLoading(true);
    try {
      if (confirmModal.type === 'approve') {
        await apiClient.approveEvent(String(confirmModal.event.id));
      } else {
        await apiClient.rejectEvent(String(confirmModal.event.id));
      }
      setPendingEvents((prev) => prev.filter((e) => e.id !== confirmModal.event.id));
      // Refresh stats
      const statsData = await apiClient.getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error processing event:', error);
    } finally {
      setActionLoading(false);
      setConfirmModal(null);
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

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage events, approve submissions, and view statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Events" value={stats.totalEvents} icon={BarChart3} variant="primary" />
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} variant="success" />
        <StatCard title="Total Registrations" value={stats.totalRegistrations} icon={CheckCircle} variant="primary" />
      </div>

      <Modal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title={confirmModal?.type === 'approve' ? 'Approve Event' : 'Reject Event'}
        size="sm"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setConfirmModal(null)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              loading={actionLoading}
              className={`flex-1 ${confirmModal?.type === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              Confirm
            </Button>
          </div>
        }
      >
        {confirmModal && (
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to {confirmModal.type} <strong>{confirmModal.event.title}</strong>?
          </p>
        )}
      </Modal>

      <Card padding="none">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-600" />
            Pending Event Approvals
            <Badge variant="warning">{pendingEvents.length}</Badge>
          </h2>
        </div>

        {pendingEvents.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">All events have been reviewed!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingEvents.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
                      <Badge variant="neutral">{event.type}</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>📅 {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(`1970-01-01T${event.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                      <span>📍 {event.venue}</span>
                      <span>👥 {event.capacity} capacity</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setConfirmModal({ type: 'approve', event })}
                      leftIcon={<CheckCircle className="w-5 h-5" />}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => setConfirmModal({ type: 'reject', event })}
                      leftIcon={<XCircle className="w-5 h-5" />}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};
