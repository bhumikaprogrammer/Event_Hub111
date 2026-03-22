import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export const OrganizerEventAnalytics: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/organizer/dashboard')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Events
        </Button>
        <h1 className="text-3xl font-bold">Event Analytics for Event ID: {eventId}</h1>
      </div>
      <Card>
        <p className="text-center text-gray-500">Analytics data will be displayed here.</p>
      </Card>
    </DashboardLayout>
  );
};