export type UserRole = 'attendee' | 'organizer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  capacity: number;
  registeredCount: number;
  status: 'pending' | 'approved' | 'rejected';
  organizerId: string;
  organizer?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registeredAt: string;
  attendanceStatus: 'registered' | 'checked_in' | 'no_show';
  qrCode: string;
  user?: User;
  event?: Event;
}

export interface CheckIn {
  id: string;
  registrationId: string;
  checkedInAt: string;
  checkedInBy: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
