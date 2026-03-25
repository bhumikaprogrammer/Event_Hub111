<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $organizer = User::where('email', 'organizer@test.com')->first();

        Event::factory()->count(4)->sequence(
            ['title' => 'Laravel & Vue.js Full-Stack Workshop'],
            ['title' => 'DevOps & Kubernetes Deep Dive'],
            ['title' => 'Intro to Machine Learning with Python'],
            ['title' => 'Startup Pitch Night 2026'],
        )->create([
            'organizer_id' => $organizer->id,
            'status' => 'approved',
            'date' => fake()->dateTimeBetween('+1 week', '+4 months')->format('Y-m-d'),
        ]);

        Event::factory()->create([
            'organizer_id' => $organizer->id,
            'title'        => 'UX & Product Design Bootcamp',
            'status'       => 'approved',
            'date'         => fake()->dateTimeBetween('+1 week', '+4 months')->format('Y-m-d'),
        ]);

        Event::factory()->create([
            'organizer_id' => $organizer->id,
            'title'        => 'Annual Campus Tech Conference',
            'status'       => 'approved',
            'date'         => fake()->dateTimeBetween('+1 week', '+4 months')->format('Y-m-d'),
        ]);

        Event::factory()->count(4)->sequence(
            ['title' => 'Cybersecurity Fundamentals Workshop'],
            ['title' => 'Digital Marketing for Startups'],
            ['title' => 'Open Source Contribution Sprint'],
            ['title' => 'Entrepreneurship & Fundraising Masterclass'],
        )->create([
            'organizer_id' => $organizer->id,
            'status' => 'pending',
            'date' => fake()->dateTimeBetween('+1 week', '+4 months')->format('Y-m-d'),
        ]);

        Event::factory()->count(2)->sequence(
            ['title' => 'React & TypeScript Crash Course'],
            ['title' => 'Community Health & Wellness Fair'],
        )->create([
            'organizer_id' => $organizer->id,
            'status' => 'approved',
            'date' => fake()->dateTimeBetween('-3 months', '-1 week')->format('Y-m-d'),
        ]);

        // 1 expired pending
        Event::factory()->create([
            'organizer_id' => $organizer->id,
            'title' => 'Cloud Architecture with AWS',
            'status' => 'pending',
            'date' => fake()->dateTimeBetween('-3 months', '-1 week')->format('Y-m-d'),
        ]);
    }
}
