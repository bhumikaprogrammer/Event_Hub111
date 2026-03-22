import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="relative card-3d p-10 w-full max-w-md text-center animate-slide-in">
        <div className="inline-block p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-xl mb-4">
          <ShieldAlert className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You do not have the necessary permissions to view this page.
        </p>
        <Button asChild size="lg">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};