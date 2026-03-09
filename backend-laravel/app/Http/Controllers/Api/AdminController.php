<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use App\Models\User;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_events'         => Event::count(),
            'total_users'          => User::count(),
            'total_registrations'  => Registration::count(),
        ]);
    }
}
