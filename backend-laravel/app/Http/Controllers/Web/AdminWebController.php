<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Event;

class AdminWebController extends Controller
{
    public function approveEvent(Event $event)
    {
        $event->update(['status' => 'approved']);

        return redirect()->route('admin.dashboard')
            ->with('success', "Event \"{$event->title}\" has been approved.");
    }

    public function rejectEvent(Event $event)
    {
        $event->update(['status' => 'rejected']);

        return redirect()->route('admin.dashboard')
            ->with('success', "Event \"{$event->title}\" has been rejected.");
    }
}
