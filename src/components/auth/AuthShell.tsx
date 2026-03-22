import React from 'react';

interface AuthShellProps {
  children: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="relative card-3d w-full max-w-4xl animate-slide-in flex overflow-hidden">
        {/* Visual Side */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome to EventHub</h2>
            <p className="text-blue-200">Your central place for campus events and activities.</p>
          </div>

          {/* SVG Illustration */}
          <div className="flex justify-center items-center">
            <svg
              width="80%"
              viewBox="0 0 350 250"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-80"
            >
              <g fill="none" stroke="white" strokeWidth="10">
                {/* Abstract representation of event tickets/cards */}
                <rect x="50" y="60" width="200" height="130" rx="15" transform="rotate(-10 150 125)" strokeDasharray="20 10" strokeOpacity="0.7" />
                <rect x="80" y="50" width="200" height="150" rx="15" transform="rotate(5 180 125)" strokeOpacity="0.9" />
                {/* Calendar Icon */}
                <g transform="translate(200 130)">
                  <rect x="0" y="0" width="90" height="80" rx="10" fill="white" fillOpacity="0.1" stroke="none" />
                  <path d="M20 0 V-10 M70 0 V-10 M0 25 H90" />
                  <circle cx="25" cy="45" r="5" fill="white" />
                  <circle cx="45" cy="45" r="5" fill="white" />
                  <circle cx="65" cy="45" r="5" fill="white" />
                </g>
              </g>
            </svg>
          </div>

          <div className="text-sm text-blue-300">
            <p>Manage events, check in attendees, and discover what's happening on campus.</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-10 bg-white">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl mb-4 transform hover:rotate-6 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold mb-2">
              <span className="gradient-text">EventHub</span>
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};