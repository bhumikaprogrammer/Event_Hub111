import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';
import { OrganizerDashboard } from '../pages/OrganizerDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { AttendeeDashboard } from '../pages/AttendeeDashboard';

export const RoleDashboard: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    // If for some reason the user is not loaded, redirect to login
    return <Navigate to="/login" replace />;
  }

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