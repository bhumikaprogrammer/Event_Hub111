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
        if ($request->user()->role === 'admin') {
            return response()->json(['message' => 'Admins cannot register for events'], 403);
        }

        if ($event->organizer_id === $request->user()->id) {
            return response()->json(['message' => 'Organizers cannot register for their own events'], 403);
        }

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
            'status' => 'pending',
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
            ->with('event')
            ->first();

        if (!$registration) {
            return response()->json(['message' => 'Invalid QR code'], 404);
        }

        if ($registration->event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'You are not the organizer of this event'], 403);
        }

        if ($registration->event->status !== 'approved') {
            return response()->json(['message' => 'This event is not approved'], 422);
        }

        if ($registration->status !== 'approved') {
            return response()->json(['message' => 'This registration is not approved'], 422);
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
            ->latest('created_at')
            ->get();

        $data = $registrations->map(function ($registration) {
            $item = $registration->toArray();
            $item['qr_code_image'] = null;

            if ($registration->status === 'approved' && $registration->qr_code_data) {
                $png = QrCode::format('png')->size(250)->generate($registration->qr_code_data);
                $item['qr_code_image'] = 'data:image/png;base64,' . base64_encode($png);
            }

            return $item;
        });

        return response()->json($data);
    }

    public function cancel(Request $request, Registration $registration)
    {
        if ($registration->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($registration->status !== 'pending') {
            return response()->json(['message' => 'Only pending registrations can be cancelled'], 400);
        }

        $registration->delete();

        return response()->json(['message' => 'Registration cancelled']);
    }

    public function destroy(Request $request, Registration $registration)
    {
        if ($registration->event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($registration->status === 'approved') {
            $registration->event()->decrement('registered_count');
        }

        $registration->delete();

        return response()->json(['message' => 'Registration deleted']);
    }

    public function approve(Request $request, Registration $registration)
    {
        if ($registration->event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($registration->status === 'approved') {
            return response()->json(['message' => 'Registration is already approved'], 400);
        }

        $token = 'EVT-' . $registration->event_id . '-USR-' . $registration->user_id . '-' . Str::random(32);

        $registration->update([
            'status' => 'approved',
            'qr_code' => $token,
            'qr_code_data' => config('app.frontend_url') . '/checkin/' . $token,
        ]);
        $registration->event()->increment('registered_count');

        return response()->json($registration);
    }

    public function getByToken(Request $request, string $token)
    {
        $registration = Registration::where('qr_code', $token)
            ->with(['user', 'event'])
            ->first();

        if (!$registration) {
            return response()->json(['message' => 'Invalid ticket'], 404);
        }

        if ($registration->event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'You are not the organizer of this event'], 403);
        }

        if ($registration->event->status !== 'approved') {
            return response()->json(['message' => 'This event is not approved'], 422);
        }

        if ($registration->status !== 'approved') {
            return response()->json(['message' => 'This registration is not approved'], 422);
        }

        return response()->json($registration);
    }

    public function reject(Request $request, Registration $registration)
    {
        if ($registration->event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($registration->status === 'rejected') {
            return response()->json(['message' => 'Registration is already rejected'], 400);
        }

        if ($registration->status === 'approved') {
            $registration->event()->decrement('registered_count');
        }

        $registration->update(['status' => 'rejected']);

        return response()->json($registration);
    }
}