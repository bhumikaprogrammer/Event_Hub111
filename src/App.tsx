import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './contexts/authStore';
import { ThemeProvider } from './contexts/themeContext';
import { apiClient } from './services/apiClient';
import { Registration } from './types';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { EventListPage } from './pages/EventListPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { AttendeeDashboard } from './pages/AttendeeDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Card } from './components/ui/Card';
import { Badge } from './components/ui/Badge';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Event Routes */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute>
              <EventDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Dashboard - Role-based routing */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleDashboard />
            </ProtectedRoute>
          }
        />

        {/* Organizer Routes */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute requiredRole="organizer">
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:eventId/registrations"
          element={
            <ProtectedRoute requiredRole="organizer">
              <OrganizerEventRegistrations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:eventId/analytics"
          element={
            <ProtectedRoute requiredRole="organizer">
              <OrganizerEventAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

// Role-based Dashboard Router
const RoleDashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'organizer':
      return <OrganizerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'attendee':
    default:
      return <AttendeeDashboard />;
  }
};

// Organizer Event Registrations Page — real API data
const OrganizerEventRegistrations: React.FC = () => {
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

// Organizer Event Analytics Page — real API data
const OrganizerEventAnalytics: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, noShow: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    apiClient.getEventStats(eventId)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [eventId]);

  const attendance = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event Analytics</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card padding="md">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Registrations</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </Card>
            <Card padding="md">
              <p className="text-sm text-gray-500 dark:text-gray-400">Checked In</p>
              <p className="text-4xl font-bold text-green-600 mt-1">{stats.checkedIn}</p>
            </Card>
            <Card padding="md">
              <p className="text-sm text-gray-500 dark:text-gray-400">No Show</p>
              <p className="text-4xl font-bold text-red-500 mt-1">{stats.noShow}</p>
            </Card>
          </div>
          <Card padding="md">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Attendance Rate</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all"
                style={{ width: `${attendance}%` }}
              ></div>
            </div>
            <p className="text-right text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">{attendance}%</p>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
};

export default App;