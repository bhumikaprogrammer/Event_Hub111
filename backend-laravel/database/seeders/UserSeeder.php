<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::create([
            'name'              => 'Admin User',
            'email'             => 'admin@test.com',
            'password'          => Hash::make('password'),
            'role'              => 'admin',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name'              => 'Organizer User',
            'email'             => 'organizer@test.com',
            'password'          => Hash::make('password'),
            'role'              => 'organizer',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name'              => 'Regular User',
            'email'             => 'user@test.com',
            'password'          => Hash::make('password'),
            'role'              => 'attendee',
            'email_verified_at' => now(),
        ]);
    }
}
