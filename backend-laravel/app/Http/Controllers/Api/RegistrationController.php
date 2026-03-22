<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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

        // Generate unique data for the QR code
        $qrCodeData = 'evt:' . $event->id . ';usr:' . $request->user()->id . ';ts:' . time() . ';' . Str::random(16);

        $registration = Registration::create([
            'user_id' => $request->user()->id,
            'event_id' => $event->id,
            'qr_code_data' => $qrCodeData, // Save the QR code data
            'status' => 'pending', // Set default status to pending
        ]);

        // We no longer increment registered_count here. This will be done when an organizer approves the registration.
        // $event->increment('registered_count');

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

    public function generateQrCode(Registration $registration)
    {
        // Ensure the logged-in user owns this registration
        if (auth()->id() !== $registration->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $qrCode = QrCode::format('png')->size(250)->generate($registration->qr_code_data);

        return response($qrCode)->header('Content-Type', 'image/png');
    }

    public function myRegistrations(Request $request)
    {
        $registrations = Registration::where('user_id', $request->user()->id)
            ->with('event') // Eager load the event details
            ->latest('created_at') // Order by most recent registration
            ->get();

        return response()->json($registrations);
    }

    public function approve(Request $request, Registration $registration)
    {
        // Ensure the authenticated user is the organizer of the event
        $this->authorize('manage', $registration->event);

        if ($registration->status !== 'pending') {
            return response()->json(['message' => 'Registration is not pending approval'], 400);
        }

        $registration->update(['status' => 'approved']);

        // Now increment the registered count for the event
        $registration->event()->increment('registered_count');

        return response()->json($registration);
    }

    public function reject(Request $request, Registration $registration)
    {
        // Ensure the authenticated user is the organizer of the event
        $this->authorize('manage', $registration->event);

        if ($registration->status !== 'pending') {
            return response()->json(['message' => 'Registration is not pending approval'], 400);
        }

        $registration->update(['status' => 'rejected']);

        return response()->json($registration);
    }
}