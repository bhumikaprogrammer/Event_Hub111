import React from 'react';
import { Navbar } from '../Navbar';

interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'sm' | 'md' | 'lg';
}

const widthMap = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
};
const paddingMap = {
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8',
};

export const PageLayout: React.FC<PageLayoutProps> = ({ children, maxWidth = 'xl', padding = 'md' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <main className={`w-full mx-auto ${widthMap[maxWidth]} ${paddingMap[padding]} py-8 flex-1`}>{children}</main>
      <footer className="text-center text-xs text-gray-500 dark:text-gray-400 py-6">© {new Date().getFullYear()} EventHub</footer>
    </div>
  );
};
