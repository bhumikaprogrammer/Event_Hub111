<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventWebController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with('organizer')->where('status', 'approved');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        $events = $query->latest()->get();

        return view('events.index', compact('events'));
    }

    public function show(Event $event)
    {
        $event->load('organizer');

        $userRegistration = null;
        if (Auth::check()) {
            $userRegistration = Registration::where('user_id', Auth::id())
                ->where('event_id', $event->id)
                ->first();
        }

        return view('events.show', compact('event', 'userRegistration'));
    }

    public function registerForEvent(Request $request, Event $event)
    {
        if ($event->status !== 'approved') {
            return back()->with('error', 'This event is not available for registration.');
        }

        if ($event->registered_count >= $event->capacity) {
            return back()->with('error', 'This event is full.');
        }

        $existing = Registration::where('user_id', Auth::id())
            ->where('event_id', $event->id)
            ->first();

        if ($existing) {
            return back()->with('error', 'You are already registered for this event.');
        }

        Registration::create([
            'user_id'  => Auth::id(),
            'event_id' => $event->id,
        ]);

        $event->increment('registered_count');

        return back()->with('success', 'Successfully registered! Your QR code is in your dashboard.');
    }
}
