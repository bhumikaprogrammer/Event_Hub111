import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/themeContext';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { EventListPage } from './pages/EventListPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { OrganizerEventAnalytics } from './pages/OrganizerEventAnalytics';
import { OrganizerEventRegistrations } from './pages/OrganizerEventRegistrations';
import { RoleDashboard } from './components/RoleDashboard';
import { CheckInScanner } from './pages/CheckInScanner';
import { CreateEventPage } from './pages/CreateEventPage';

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
            path="/events/create"
            element={
              <ProtectedRoute requiredRole="organizer">
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/edit"
            element={
              <ProtectedRoute requiredRole="organizer">
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedRoute requiredRole="organizer">
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-events"
            element={
              <ProtectedRoute requiredRole="organizer">
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/:eventId/attendees"
            element={<Navigate to="../registrations" replace />}
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
          <Route
            path="/organizer/events/:eventId/scanner"
            element={
              <ProtectedRoute requiredRole="organizer">
                <CheckInScanner />
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

export default App;