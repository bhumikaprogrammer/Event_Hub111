import React from 'react';
import { Navbar } from '../Navbar';

interface TwoColumnLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  stackingBreakpoint?: 'sm' | 'md' | 'lg';
}

const breakpointMap = {
  sm: 'sm:flex-row',
  md: 'md:flex-row',
  lg: 'lg:flex-row',
};

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({ left, right, stackingBreakpoint = 'md' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-purple-50">
      <Navbar />
      <div className="w-full max-w-screen-lg mx-auto px-6 py-10 flex flex-col gap-8">
        <div className={`flex flex-col ${breakpointMap[stackingBreakpoint]} gap-8`}> 
          <div className="flex-1 space-y-6">{left}</div>
          <div className="flex-1 space-y-6">{right}</div>
        </div>
      </div>
    </div>
  );
};
