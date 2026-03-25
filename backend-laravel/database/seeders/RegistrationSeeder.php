<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RegistrationSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $attendee = User::where('email', 'user@test.com')->first();

        // Register attendee on 2 upcoming approved events
        $upcomingApproved = Event::where('status', 'approved')
            ->where('date', '>', now())
            ->take(2)
            ->get();

        foreach ($upcomingApproved as $event) {
            $this->registerUser($attendee->id, $event, 'registered');
        }

        $pastEvent = Event::where('status', 'approved')
            ->where('date', '<', now())
            ->first();

        if ($pastEvent) {
            $this->registerUser($attendee->id, $pastEvent, 'checked_in', $pastEvent->date);
        }
    }

    private function registerUser(int $userId, Event $event, string $attendanceStatus, mixed $checkedInAt = null): void
    {
        $token = Str::random(32);
        Registration::create([
            'user_id' => $userId,
            'event_id' => $event->id,
            'status' => 'approved',
            'qr_code' => $token,
            'qr_code_data' => json_encode([
                'token' => $token,
                'event_id' => $event->id,
                'user_id' => $userId,
            ]),
            'attendance_status' => $attendanceStatus,
            'checked_in_at' => $checkedInAt,
        ]);
        $event->increment('registered_count');
    }
}
