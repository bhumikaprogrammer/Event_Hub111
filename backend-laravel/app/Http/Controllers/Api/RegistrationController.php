<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    public function register(Request $request, Event $event)
    {
        if ($event->registered_count >= $event->capacity) {
            return response()->json(['message' => 'Event is full'], 400);
        }

        $existingRegistration = Registration::where('user_id', $request->user()->id)
            ->where('event_id', $event->id)
            ->first();

        if ($existingRegistration) {
            return response()->json(['message' => 'Already registered'], 400);
        }

        $registration = Registration::create([
            'user_id' => $request->user()->id,
            'event_id' => $event->id,
        ]);

        $event->increment('registered_count');

        return response()->json($registration, 201);
    }

    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'qr_code' => 'required|string',
            'event_id' => 'required|exists:events,id',
        ]);

        $registration = Registration::where('qr_code', $validated['qr_code'])
            ->where('event_id', $validated['event_id'])
            ->first();

        if (!$registration) {
            return response()->json(['message' => 'Invalid QR code'], 404);
        }

        if ($registration->attendance_status === 'checked_in') {
            return response()->json(['message' => 'Already checked in'], 400);
        }

        $registration->update([
            'attendance_status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        return response()->json($registration);
    }

    public function attendees(Event $event)
    {
        $registrations = $event->registrations()->with('user')->get();
        return response()->json($registrations);
    }

    public function myRegistrations(Request $request)
    {
        $registrations = Registration::where('user_id', $request->user()->id)
            ->with('event')
            ->get();

        return response()->json($registrations);
    }
}
