import axios, { AxiosInstance } from 'axios';
import { User, Event, Registration, CheckIn } from '../types';
import { convertKeys } from '../lib/caseConverter';

class APIClient {
  private client: AxiosInstance;
  private baseURL = 'http://localhost:8000/api';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
    });

    // Add token to requests
    this.client.interceptors.request.use((config: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Auto-convert snake_case keys from Laravel to camelCase
    this.client.interceptors.response.use((response) => {
      response.data = convertKeys(response.data);
      return response;
    });
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.client.post('/login', { email, password });
    return response.data;
  }

  async register(name: string, email: string, password: string, role: string): Promise<{ user: User; token: string }> {
    const response = await this.client.post('/register', { name, email, password, role });
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get('/user');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/logout');
  }

  // Event endpoints
  async getApprovedEvents(filters?: { date?: string; type?: string; venue?: string }): Promise<Event[]> {
    const response = await this.client.get('/events', { params: { ...filters, status: 'approved' } });
    return response.data;
  }

  async getEventById(id: string): Promise<Event> {
    const response = await this.client.get(`/events/${id}`);
    return response.data;
  }

  async getOrganizerEvents(organizerId: string): Promise<Event[]> {
    const response = await this.client.get('/events', { params: { organizerId } });
    return response.data;
  }

  async getPendingEvents(): Promise<Event[]> {
    const response = await this.client.get('/events', { params: { status: 'pending' } });
    return response.data;
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await this.client.post('/events', eventData);
    return response.data;
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const response = await this.client.put(`/events/${id}`, eventData);
    return response.data;
  }

  async deleteEvent(id: string): Promise<void> {
    await this.client.delete(`/events/${id}`);
  }

  async approveEvent(id: string): Promise<Event> {
    const response = await this.client.post(`/events/${id}/approve`);
    return response.data;
  }

  async rejectEvent(id: string): Promise<Event> {
    const response = await this.client.post(`/events/${id}/reject`);
    return response.data;
  }

  // Registration endpoints
  async registerForEvent(eventId: string): Promise<Registration> {
    const response = await this.client.post(`/events/${eventId}/register`);
    return response.data;
  }

  async getAttendeeRegistrations(_userId: string): Promise<Registration[]> {
    const response = await this.client.get('/my-registrations');
    return response.data;
  }

  async getEventRegistrations(eventId: string): Promise<Registration[]> {
    const response = await this.client.get(`/events/${eventId}/attendees`);
    return response.data;
  }

  async getRegistrationByQR(qrCode: string, eventId: string): Promise<Registration> {
    const response = await this.client.post('/check-in', { qr_code: qrCode, event_id: eventId });
    return response.data;
  }

  // Check-in endpoints
  async checkIn(qrCode: string, eventId: string): Promise<Registration> {
    const response = await this.client.post('/check-in', { qr_code: qrCode, event_id: eventId });
    return response.data;
  }

  async getCheckInsByEvent(eventId: string): Promise<Registration[]> {
    const response = await this.client.get(`/events/${eventId}/attendees`);
    return response.data;
  }

  // Stats endpoints
  async getEventStats(eventId: string): Promise<{
    total: number;
    checkedIn: number;
    noShow: number;
  }> {
    const registrations = await this.getEventRegistrations(eventId);
    return {
      total: registrations.length,
      checkedIn: registrations.filter(r => r.attendanceStatus === 'checked_in').length,
      noShow: registrations.filter(r => r.attendanceStatus === 'no_show').length,
    };
  }

  async getOverallStats(): Promise<{
    totalEvents: number;
    totalUsers: number;
    totalRegistrations: number;
  }> {
    return this.getAdminStats();
  }

  async getAdminStats(): Promise<{
    totalEvents: number;
    totalUsers: number;
    totalRegistrations: number;
  }> {
    const response = await this.client.get('/admin/stats');
    return response.data;
  }
}

export const apiClient = new APIClient();
