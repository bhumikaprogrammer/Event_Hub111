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

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->user()->role === 'organizer') {
            $query->where('organizer_id', $request->user()->id);
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
        $this->authorize('update', $event);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'date' => 'date',
            'time' => 'string',
            'venue' => 'string',
            'type' => 'string',
            'capacity' => 'integer|min:1',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);
        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
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
