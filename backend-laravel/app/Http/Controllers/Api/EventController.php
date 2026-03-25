<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with('organizer');

        $user = auth('sanctum')->user();

        if (!$user || $user->role === 'attendee') {
            // Unauthenticated visitors and attendees only see upcoming approved events
            $query->where('status', 'approved')->where('date', '>=', now()->toDateString());
        } elseif ($user->role === 'organizer') {
            // Organizers see only their own events (all statuses)
            $query->where('organizer_id', $user->id);
        } elseif ($user->role === 'admin') {
            // Admins can filter by status or see all
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
        }

        $events = $query->latest()->get();

        return response()->json($events);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
            'venue' => 'required|string',
            'category' => 'required|string',
            'type' => 'required|string',
            'capacity' => 'required|integer|min:1',
        ]);

        $event = Event::create([
            ...$validated,
            'organizer_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        $event->load('organizer', 'registrations');
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        if ($event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($event->status === 'approved') {
            return response()->json(['message' => 'Approved events cannot be edited'], 403);
        }

        if ($event->date->isPast()) {
            return response()->json(['message' => 'Expired events cannot be edited'], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'date' => 'date',
            'time' => 'string',
            'venue' => 'string',
            'category' => 'string',
            'type' => 'string',
            'capacity' => 'integer|min:1',
        ]);

        if ($event->status === 'rejected') {
            $validated['status'] = 'pending';
        }

        $event->update($validated);

        return response()->json($event);
    }

    public function destroy(Request $request, Event $event)
    {
        if ($event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($event->status === 'approved') {
            return response()->json(['message' => 'Approved events cannot be deleted'], 403);
        }

        if ($event->date->isPast()) {
            return response()->json(['message' => 'Expired events cannot be deleted'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    public function myEvents(Request $request)
    {
        $events = Event::where('organizer_id', $request->user()->id)->latest()->get();
        return response()->json($events);
    }

    public function getAttendees(Request $request, Event $event)
    {
        if ($request->user()->id !== $event->organizer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Eager load specific user details for each registration
        $attendees = $event->registrations()->with('user:id,name,email')->get();

        return response()->json($attendees);
    }

    public function approve(Event $event)
    {
        $event->update(['status' => 'approved']);
        return response()->json($event);
    }

    public function reject(Event $event)
    {
        $event->update(['status' => 'rejected']);
        return response()->json($event);
    }
}