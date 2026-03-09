<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrganizerController extends Controller
{
    public function storeEvent(Request $request)
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'type'        => ['required', 'string'],
            'description' => ['required', 'string'],
            'date'        => ['required', 'date'],
            'time'        => ['required', 'string'],
            'venue'       => ['required', 'string', 'max:255'],
            'capacity'    => ['required', 'integer', 'min:1'],
        ]);

        Event::create([
            ...$validated,
            'organizer_id' => Auth::id(),
            'status'       => 'pending',
        ]);

        return redirect()->route('organizer.dashboard')
            ->with('success', 'Event created successfully! Awaiting admin approval.');
    }

    public function updateEvent(Request $request, Event $event)
    {
        if ($event->organizer_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'type'        => ['required', 'string'],
            'description' => ['required', 'string'],
            'date'        => ['required', 'date'],
            'time'        => ['required', 'string'],
            'venue'       => ['required', 'string', 'max:255'],
            'capacity'    => ['required', 'integer', 'min:1'],
        ]);

        $event->update($validated);

        return redirect()->route('organizer.dashboard')
            ->with('success', 'Event updated successfully!');
    }

    public function deleteEvent(Event $event)
    {
        if ($event->organizer_id !== Auth::id()) {
            abort(403);
        }

        $event->delete();

        return redirect()->route('organizer.dashboard')
            ->with('success', 'Event deleted successfully!');
    }

    public function eventRegistrations(Event $event)
    {
        if ($event->organizer_id !== Auth::id()) {
            abort(403);
        }

        $registrations = $event->registrations()->with('user')->get();

        // Return JSON for the JS fetch call in the view
        return response()->json(
            $registrations->map(fn($r) => [
                'id'                => $r->id,
                'qr_code'           => $r->qr_code,
                'attendance_status' => $r->attendance_status,
                'user'              => $r->user ? ['name' => $r->user->name, 'email' => $r->user->email] : null,
            ])
        );
    }

    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'qr_code'  => ['required', 'string'],
            'event_id' => ['required', 'exists:events,id'],
        ]);

        $registration = Registration::where('qr_code', $validated['qr_code'])
            ->where('event_id', $validated['event_id'])
            ->first();

        if (!$registration) {
            return back()->with('error', 'Invalid QR code. Attendee not found.');
        }

        if ($registration->attendance_status === 'checked_in') {
            return back()->with('error', 'Attendee already checked in.');
        }

        $registration->update([
            'attendance_status' => 'checked_in',
            'checked_in_at'     => now(),
        ]);

        return back()->with('success', 'Attendee checked in successfully!');
    }
}
