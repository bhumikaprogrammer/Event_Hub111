import React from 'react';
import { Navbar } from '../Navbar';

interface DashboardLayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebar, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <div className="flex flex-1 w-full max-w-screen-xl mx-auto px-6 gap-6 py-6">
        {sidebar && (
          <aside className="hidden md:block w-64 shrink-0 space-y-4">
            {sidebar}
          </aside>
        )}
        <main className="flex-1 space-y-6">{children}</main>
      </div>
    </div>
  );
};
