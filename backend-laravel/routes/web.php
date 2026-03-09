<?php

use App\Http\Controllers\Web\AdminWebController;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\EventWebController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\OrganizerController;
use Illuminate\Support\Facades\Route;

// ── Public ──────────────────────────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');

// Auth
Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login',   [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Unauthorized
Route::get('/unauthorized', fn () => view('errors.unauthorized'))->name('unauthorized');

// Events (public)
Route::get('/events',        [EventWebController::class, 'index'])->name('events.index');
Route::get('/events/{event}', [EventWebController::class, 'show'])->name('events.show');

// ── Authenticated ────────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    // Dashboard redirect based on role
    Route::get('/dashboard', [DashboardController::class, 'redirect'])->name('dashboard');

    // Register for an event
    Route::post('/events/{event}/register', [EventWebController::class, 'registerForEvent'])
        ->name('events.register');

    // Attendee
    Route::middleware('role:attendee')->group(function () {
        Route::get('/attendee/dashboard', [DashboardController::class, 'attendee'])->name('attendee.dashboard');
    });

    // Organizer
    Route::middleware('role:organizer')->prefix('organizer')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'organizer'])->name('organizer.dashboard');
        Route::post('/events', [OrganizerController::class, 'storeEvent'])->name('organizer.events.store');
        Route::put('/events/{event}', [OrganizerController::class, 'updateEvent'])->name('organizer.events.update');
        Route::delete('/events/{event}', [OrganizerController::class, 'deleteEvent'])->name('organizer.events.destroy');
        Route::get('/events/{event}/registrations', [OrganizerController::class, 'eventRegistrations'])->name('organizer.events.registrations');
        Route::post('/check-in', [OrganizerController::class, 'checkIn'])->name('organizer.checkin');
    });

    // Admin
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'admin'])->name('admin.dashboard');
        Route::post('/events/{event}/approve', [AdminWebController::class, 'approveEvent'])->name('admin.events.approve');
        Route::post('/events/{event}/reject',  [AdminWebController::class, 'rejectEvent'])->name('admin.events.reject');
    });
});
