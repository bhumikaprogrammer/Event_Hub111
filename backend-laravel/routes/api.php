<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\RegistrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password Reset
Route::post('/password/email', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/password/reset', [PasswordResetController::class, 'reset']);

// Password Reset
Route::post('/password/email', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/password/reset', [PasswordResetController::class, 'reset']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);
    
    // Organizer & Admin only
    Route::middleware('role:organizer,admin')->group(function () {
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{event}', [EventController::class, 'update']);
        Route::delete('/events/{event}', [EventController::class, 'destroy']);
        Route::get('/events/{event}/attendees', [EventController::class, 'getAttendees']);
        Route::post('/check-in', [RegistrationController::class, 'checkIn']);
        Route::get('/my-events', [EventController::class, 'myEvents']); // New route for organizers
        Route::post('/registrations/{registration}/approve', [RegistrationController::class, 'approve']);
        Route::post('/registrations/{registration}/reject', [RegistrationController::class, 'reject']);
        Route::delete('/registrations/{registration}/force', [RegistrationController::class, 'destroy']);
        Route::get('/registrations/by-token/{token}', [RegistrationController::class, 'getByToken']);
    });

    // Admin only
    Route::middleware('role:admin')->group(function () {
        Route::post('/events/{event}/approve', [EventController::class, 'approve']);
        Route::post('/events/{event}/reject', [EventController::class, 'reject']);
        Route::get('/admin/stats', [AdminController::class, 'stats']);
    });

    // Attendee routes
    Route::post('/events/{event}/register', [RegistrationController::class, 'register']);
    Route::delete('/registrations/{registration}', [RegistrationController::class, 'cancel']);
    Route::get('/my-registrations', [RegistrationController::class, 'myRegistrations']);
    Route::get('/registrations/{registration}/qrcode', [RegistrationController::class, 'generateQrCode']);
});