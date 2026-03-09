import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Users, BarChart3, Calendar, CheckCircle, ScanLine } from 'lucide-react';
import { Event, Registration } from '../types';
import { useAuthStore } from '../contexts/authStore';
import { apiClient } from '../services/apiClient';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import { QRScanner } from '../components/QRScanner';

export const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannerEventId, setScannerEventId] = useState<string>('');
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendanceEventId, setAttendanceEventId] = useState<string>('');
  const [attendees, setAttendees] = useState<Registration[]>([]);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchEvents();
  }, [user?.id]);

  const fetchAttendees = async (eventId: string) => {
    try {
      const data = await apiClient.getEventRegistrations(eventId);
      setAttendees(data);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getOrganizerEvents(user!.id);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await apiClient.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const totalEvents = events.length;
  const approvedEvents = events.filter(e => e.status === 'approved').length;
  const pendingEvents = events.filter(e => e.status === 'pending').length;
  const totalRegistrations = events.reduce((sum, e) => sum + e.registeredCount, 0);

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Event Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your events and registrations</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowQRScanner(true)}
            variant="secondary"
            leftIcon={<ScanLine className="w-5 h-5" />}
          >
            QR Scanner
          </Button>
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setShowEventForm(true);
            }}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Create Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Events" value={totalEvents} icon={Calendar} variant="primary" />
        <StatCard title="Approved" value={approvedEvents} icon={CheckCircle} variant="success" />
        <StatCard title="Pending" value={pendingEvents} icon={BarChart3} variant="warning" />
        <StatCard title="Total Registrations" value={totalRegistrations} icon={Users} variant="primary" />
      </div>

      <Modal
        isOpen={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setSelectedEvent(null);
        }}
        title={selectedEvent ? 'Edit Event' : 'Create Event'}
        size="lg"
      >
        <EventForm
          event={selectedEvent}
          onSubmit={async (eventData) => {
            if (selectedEvent) {
              const updated = await apiClient.updateEvent(String(selectedEvent.id), eventData);
              setEvents((prev) => prev.map((e) => String(e.id) === String(updated.id) ? updated : e));
            } else {
              const created = await apiClient.createEvent(eventData);
              setEvents((prev) => [...prev, created]);
            }
            setShowEventForm(false);
            setSelectedEvent(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showQRScanner}
        onClose={() => {
          setShowQRScanner(false);
          setScannerEventId('');
        }}
        title="QR Code Scanner"
        size="lg"
      >
        <div className="space-y-4">
          {!scannerEventId ? (
            <div className="space-y-3">
              <p className="text-gray-600">Select an event to scan attendee QR codes:</p>
              {events.filter(e => e.status === 'approved').map((event) => (
                <Card
                  key={event.id}
                  interactive
                  onClick={() => setScannerEventId(event.id)}
                  padding="md"
                  className="cursor-pointer hover:border-primary-500"
                >
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                  <p className="text-sm text-gray-500 mt-1">{event.venue}</p>
                </Card>
              ))}
              {events.filter(e => e.status === 'approved').length === 0 && (
                <p className="text-gray-500 text-center py-4">No approved events available for scanning</p>
              )}
            </div>
          ) : (
            <div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setScannerEventId('')}
                className="mb-4"
              >
                ← Back to Events
              </Button>
              <QRScanner
                eventId={scannerEventId}
                onScan={async (qrCode: string) => {
                  const registration = await apiClient.checkIn(qrCode, scannerEventId);
                  return registration;
                }}
              />
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showAttendance}
        onClose={() => {
          setShowAttendance(false);
          setAttendanceEventId('');
          setAttendees([]);
        }}
        title="Attendance Tracking"
        size="lg"
      >
        <div className="space-y-4">
          {attendanceEventId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                {events.find(e => e.id === attendanceEventId)?.title}
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Registered</p>
                  <p className="text-2xl font-bold text-gray-900">{attendees.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Checked In</p>
                  <p className="text-2xl font-bold text-green-600">
                    {attendees.filter(a => a.attendanceStatus === 'checked_in').length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Not Checked In</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {attendees.filter(a => a.attendanceStatus === 'registered').length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {attendees.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No attendees registered yet</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {attendees.map((attendee) => (
                <Card key={attendee.id} padding="sm" className="hover:border-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">
                            {attendee.user?.name || 'Unknown'}
                          </h5>
                          <p className="text-sm text-gray-600">{attendee.user?.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span>QR: {attendee.qrCode}</span>
                        <span>Registered: {new Date(attendee.registeredAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge
                        variant={
                          attendee.attendanceStatus === 'checked_in'
                            ? 'success'
                            : attendee.attendanceStatus === 'no_show'
                            ? 'error'
                            : 'warning'
                        }
                      >
                        {attendee.attendanceStatus === 'checked_in'
                          ? 'Checked In'
                          : attendee.attendanceStatus === 'no_show'
                          ? 'No Show'
                          : 'Not Checked In'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {events.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-gray-500 text-lg mb-4">
            You haven't created any events yet
          </p>
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setShowEventForm(true);
            }}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Create Your First Event
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} interactive padding="md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <Badge
                    variant={
                      event.status === 'approved'
                        ? 'success'
                        : event.status === 'pending'
                        ? 'warning'
                        : 'error'
                    }
                  >
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {event.status === 'approved' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setScannerEventId(event.id);
                        setShowQRScanner(true);
                      }}
                      leftIcon={<ScanLine className="w-4 h-4" />}
                    >
                      Scan Attendees
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setAttendanceEventId(event.id);
                      fetchAttendees(event.id);
                      setShowAttendance(true);
                    }}
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                  >
                    View Attendance
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/organizer/events/${event.id}/registrations`)}
                    leftIcon={<Users className="w-4 h-4" />}
                  >
                    Registrations
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/organizer/events/${event.id}/analytics`)}
                    leftIcon={<BarChart3 className="w-4 h-4" />}
                  >
                    Analytics
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventForm(true);
                    }}
                    leftIcon={<Edit2 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteEvent(event.id)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-600">
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-base font-semibold text-gray-900">
                    {event.date} at {event.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Venue</p>
                  <p className="text-base font-semibold text-gray-900">{event.venue}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Registrations</p>
                  <p className="text-base font-semibold text-gray-900">
                    {event.registeredCount}/{event.capacity}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

// Event Form Component
interface EventFormProps {
  event: Event | null;
  onSubmit: (formData: Partial<Event>) => Promise<void>;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    time: event?.time || '',
    venue: event?.venue || '',
    type: event?.type || 'Conference',
    capacity: event?.capacity || 100,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save event. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Networking">Networking</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

      <div className="flex gap-3 pt-4">
        {error && <p className="text-red-600 text-sm w-full mb-1">{error}</p>}
        <Button type="submit" className="w-full" loading={submitting}>
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};
