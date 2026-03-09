<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function redirect()
    {
        return match (Auth::user()->role) {
            'admin'     => redirect()->route('admin.dashboard'),
            'organizer' => redirect()->route('organizer.dashboard'),
            default     => redirect()->route('attendee.dashboard'),
        };
    }

    public function attendee()
    {
        $registrations = Registration::where('user_id', Auth::id())
            ->with('event')
            ->latest()
            ->get();

        return view('dashboard.attendee', compact('registrations'));
    }

    public function organizer()
    {
        $events = Event::where('organizer_id', Auth::id())->latest()->get();

        $stats = [
            'total'         => $events->count(),
            'approved'      => $events->where('status', 'approved')->count(),
            'pending'       => $events->where('status', 'pending')->count(),
            'registrations' => $events->sum('registered_count'),
        ];

        return view('dashboard.organizer', compact('events', 'stats'));
    }

    public function admin()
    {
        $pendingEvents = Event::with('organizer')
            ->where('status', 'pending')
            ->latest()
            ->get();

        $stats = [
            'totalEvents'        => Event::count(),
            'totalUsers'         => User::count(),
            'totalRegistrations' => Registration::count(),
        ];

        return view('dashboard.admin', compact('pendingEvents', 'stats'));
    }
}
