# Event Ticketing & QR-Based Check-In System

A comprehensive React-based web application for managing events, registrations, and QR-based check-ins in a college setting.

## Features

### For Attendees
- Browse and search approved events
- Register for events
- View registered events with details
- Display unique QR codes for check-in
- Check-in at events using QR codes

### For Organizers
- Create and manage events
- View registrations for their events
- Scan attendee QR codes to check them in
- Track attendance statistics
- Edit and delete event details

### For Admins
- Approve or reject pending events
- View overall system statistics
- Manage users
- Monitor event and registration data

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation bar
│   ├── ProtectedRoute.tsx
│   ├── QRCodeDisplay.tsx
│   ├── QRScanner.tsx
│   └── ...
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── AuthPage.tsx
│   ├── EventListPage.tsx
│   ├── EventDetailsPage.tsx
│   ├── AttendeeDashboard.tsx
│   ├── OrganizerDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── UnauthorizedPage.tsx
├── services/           # API and data services
│   └── apiClient.ts
├── contexts/           # State management
│   └── authStore.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── hooks/              # Custom React hooks
├── App.tsx             # Main app with routing
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **QR Code**: qrcode.react (display), react-qr-scanner (scanning)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Date Handling**: date-fns

## Installation

1. Install Node.js (v16 or higher)

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional for API configuration):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

## API Endpoints

The application expects the following REST API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile

### Events
- `GET /api/events/approved` - Get approved events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (organizer only)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/pending` - Get pending events (admin only)
- `POST /api/events/:id/approve` - Approve event (admin only)
- `POST /api/events/:id/reject` - Reject event (admin only)

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/attendee/:userId` - Get attendee registrations
- `GET /api/registrations/event/:eventId` - Get event registrations
- `GET /api/registrations/qr/:qrCode` - Get registration by QR code

### Check-in
- `POST /api/check-in/:registrationId` - Check in attendee
- `GET /api/check-in/event/:eventId` - Get check-in records for event

### Statistics
- `GET /api/stats/event/:eventId` - Get event statistics
- `GET /api/stats/overall` - Get overall system statistics

## Mock Data

The application includes mock data for development. Attendees can log in using:

- **Email**: test@attendee.com
- **Password**: password123
- **Role**: Attendee

Organizer demo:
- **Email**: test@organizer.com
- **Password**: password123
- **Role**: Organizer

Admin demo:
- **Email**: test@admin.com
- **Password**: password123
- **Role**: Admin

## Authentication Flow

1. User visits the app and is redirected to `/login`
2. User enters credentials and selects role (if registering)
3. On success, user data and JWT token are stored in localStorage
4. Routes are protected by `ProtectedRoute` component that checks authentication and role
5. Logout clears localStorage and redirects to login page

## Component Architecture

### Protected Route Component
Wraps sensitive routes and redirects unauthenticated users to login. Supports role-based access control.

### QR Code Components
- **QRCodeDisplay**: Shows QR code with download/print options
- **QRScanner**: Camera-based QR scanner with manual input fallback

### State Management
Uses Zustand for lightweight state management with localStorage persistence for auth state.

## Responsive Design

The application is fully responsive:
- **Mobile**: Single column layout, touch-friendly buttons
- **Tablet**: Two-column layouts where applicable
- **Desktop**: Multi-column grids and expanded layouts

## Error Handling

- API errors are caught and displayed as toast/alert messages
- Invalid routes redirect to 404 or unauthorized pages
- Form validation on client side
- Loading states for async operations

## Future Enhancements

1. Real QR scanner integration with jsQR library
2. Email notifications for registration confirmations
3. Event categories and advanced search filters
4. User profile customization
5. Payment integration for paid events
6. Export registration lists to CSV/PDF
7. Real-time notification system
8. Event cancellation handling
9. Refund management
10. Analytics dashboard with charts and graphs

## License

MIT License - feel free to use this project as a template for your own applications.
