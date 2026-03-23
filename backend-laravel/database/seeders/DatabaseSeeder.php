<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // // User::create([
        //     'name' => 'Organizer User',
        //     'email' => 'organizer@test.com',
        //     'password' => Hash::make('password'),
        //     'role' => 'organizer',
        // ]);

        // User::create([
        //     'name' => 'Attendee User',
        //     'email' => 'attendee@test.com',
        //     'password' => Hash::make('password'),
        //     'role' => 'attendee',
        // ]);
    }
}