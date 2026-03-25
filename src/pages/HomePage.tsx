import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';
import { apiClient } from '../services/apiClient';
import { Event } from '../types';

function useReveal() {
  const ref = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = [el, ...Array.from(el.querySelectorAll<HTMLElement>('.reveal'))];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          (entry.target as HTMLElement).classList.toggle('visible', entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [events, setEvents] = React.useState<Event[]>([]);
  const howItWorksRef = useReveal() as React.RefObject<HTMLElement>;
  const rolesRef = useReveal() as React.RefObject<HTMLElement>;
  const ctaRef = useReveal() as React.RefObject<HTMLElement>;

  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'attendee') navigate('/dashboard');
      else if (user?.role === 'organizer') navigate('/organizer/dashboard');
      else if (user?.role === 'admin') navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user?.role, navigate]);

  React.useEffect(() => {
    apiClient.getApprovedEvents().then((all) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = all
        .filter((e) => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEvents(upcoming);
    }).catch(() => {});
  }, []);

  const handleEventClick = (eventId: string) => {
    if (isAuthenticated) {
      navigate(`/events/${eventId}`);
    } else {
      navigate('/login');
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

  const capacityPct = (e: Event) =>
    Math.min(100, Math.round((e.registeredCount / e.capacity) * 100));

  const statusBadge = (e: Event) => {
    const pct = capacityPct(e);
    if (pct >= 90) return { label: 'Almost full', cls: 'bg-yellow-100 text-yellow-700' };
    if (pct >= 70) return { label: 'Filling up', cls: 'bg-orange-100 text-orange-700' };
    return { label: 'Open', cls: 'bg-green-100 text-green-700' };
  };

  const barColor = (e: Event) => {
    const pct = capacityPct(e);
    if (pct >= 90) return 'bg-yellow-400';
    if (pct >= 70) return 'bg-orange-400';
    return 'bg-indigo-500';
  };

  // Duplicate for seamless infinite scroll
  const scrollItems = events.length > 0 ? [...events, ...events] : [];
  // ~3s per card, minimum 8s
  const scrollDuration = Math.max(8, events.length * 3);

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <p className="animate-fade-up animate-fade-up-1 text-xs font-semibold text-indigo-600 tracking-widest uppercase mb-5">
                Campus Event Platform
              </p>
              <h1 className="animate-fade-up animate-fade-up-2 text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
                Run better<br />campus events.
              </h1>
              <p className="animate-fade-up animate-fade-up-3 text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
                Create events, register attendees, and check them in with QR codes — all in one place.
                Built for college clubs and student organizations.
              </p>

              {!isAuthenticated && (
                <div className="animate-fade-up animate-fade-up-4 flex items-center gap-6">
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Get started
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-600 font-medium hover:text-gray-900 transition-colors"
                  >
                    Sign in →
                  </button>
                </div>
              )}
            </div>

            {/* Right: Live scrolling events */}
            <div className="animate-fade-up animate-fade-up-5 hidden lg:block">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 h-80 overflow-hidden relative">
                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-5 px-6 select-none">
                    {/* Ticket stub */}
                    <div className="relative w-56 border-2 border-dashed border-gray-200 rounded-xl px-5 py-4">
                      {/* Notch left */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-50 border-2 border-dashed border-gray-200" />
                      {/* Notch right */}
                      <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-50 border-2 border-dashed border-gray-200" />

                      <p className="text-[10px] font-bold tracking-widest text-gray-300 uppercase mb-2">Upcoming</p>
                      <p className="text-sm font-bold text-gray-300 mb-0.5">TBA</p>
                      <p className="text-[10px] text-gray-300 tracking-wide">Venue · To be announced</p>
                      <div className="mt-3 border-t border-dashed border-gray-200 pt-2 flex justify-between items-center">
                        <p className="text-[9px] tracking-widest text-gray-300 uppercase">EventHub</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="w-0.5 h-3 bg-gray-200 rounded-full" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xs font-semibold text-gray-500">Nothing scheduled yet.</p>
                      <p className="text-xs text-gray-400 mt-0.5">Check back — events drop here first.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Fade edges */}
                    <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />

                    <div
                      className="space-y-3"
                      style={{ animation: `scroll-up ${scrollDuration}s linear infinite` }}
                    >
                      {scrollItems.map((event, i) => {
                        const badge = statusBadge(event);
                        return (
                          <button
                            key={`${event.id}-${i}`}
                            onClick={() => handleEventClick(event.id)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-indigo-300 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="min-w-0 flex-1 pr-3">
                                <p className="text-xs font-semibold text-indigo-600 tracking-wide mb-0.5">
                                  {formatDate(event.date)} · {event.venue.toUpperCase()}
                                </p>
                                <h3 className="font-semibold text-gray-900 text-sm truncate">{event.title}</h3>
                              </div>
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${badge.cls}`}>
                                {badge.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                              <span>{event.registeredCount} registered</span>
                              <span>·</span>
                              <span>{event.capacity} capacity</span>
                            </div>
                            <div className="bg-gray-100 rounded-full h-1">
                              <div
                                className={`h-1 rounded-full ${barColor(event)}`}
                                style={{ width: `${capacityPct(event)}%` }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it works */}
      <section ref={howItWorksRef as React.RefObject<HTMLElement>} className="reveal max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-12">How it works</p>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="reveal reveal-delay-1">
            <p className="text-5xl font-bold text-gray-100 mb-5 select-none">01</p>
            <h3 className="font-semibold text-gray-900 mb-2">Create an event</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Organizers submit events for admin review. Once approved, your event goes live and starts accepting registrations.
            </p>
          </div>
          <div className="reveal reveal-delay-2">
            <p className="text-5xl font-bold text-gray-100 mb-5 select-none">02</p>
            <h3 className="font-semibold text-gray-900 mb-2">Attendees register</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Each attendee gets a unique QR code ticket saved to their account. No printouts, no lost emails.
            </p>
          </div>
          <div className="reveal reveal-delay-3">
            <p className="text-5xl font-bold text-gray-100 mb-5 select-none">03</p>
            <h3 className="font-semibold text-gray-900 mb-2">Scan and check in</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              At the door, organizers scan QR codes to verify and check in attendees in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Role breakdown */}
      <section className="border-t border-gray-100">
        <div ref={rolesRef as React.RefObject<HTMLDivElement>} className="reveal max-w-6xl mx-auto px-6 py-20">
          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-12">Who it's for</p>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-white p-8">
              <p className="text-sm font-semibold text-gray-900 mb-5">Attendees</p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>Browse and discover events</li>
                <li>Register with one click</li>
                <li>Get a QR code ticket</li>
                <li>Show up and check in</li>
              </ul>
            </div>
            <div className="bg-white p-8">
              <p className="text-sm font-semibold text-gray-900 mb-5">Organizers</p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>Create and edit events</li>
                <li>View the registrant list</li>
                <li>Scan QR codes at the door</li>
                <li>Track attendance in real time</li>
              </ul>
            </div>
            <div className="bg-white p-8">
              <p className="text-sm font-semibold text-gray-900 mb-5">Admins</p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>Approve or reject events</li>
                <li>Manage all user accounts</li>
                <li>View platform-wide stats</li>
                <li>Keep everything running</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="border-t border-gray-100">
          <div ref={ctaRef as React.RefObject<HTMLDivElement>} className="reveal max-w-6xl mx-auto px-6 py-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Ready to try it?</h2>
              <p className="text-gray-500 text-sm">Free to use. No credit card needed.</p>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              Create your account
            </button>
          </div>
        </section>
      )}

    </div>
  );
};
