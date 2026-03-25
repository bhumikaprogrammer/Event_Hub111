<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organizer_id'     => User::factory()->state(['role' => 'organizer']),
            'title'            => fake()->sentence(4),
            'description'      => fake()->paragraphs(3, true),
            'date'             => fake()->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
            'time'             => fake()->time('H:i:s'),
            'venue'            => fake()->streetAddress() . ', ' . fake()->city(),
            'category'         => fake()->randomElement(['Technology', 'Business', 'Arts', 'Health', 'Sports', 'Education']),
            'type'             => fake()->randomElement(['conference', 'workshop', 'seminar', 'meetup', 'webinar']),
            'capacity'         => fake()->randomElement([50, 80, 100, 150, 200, 300]),
            'registered_count' => 0,
            'status'           => 'pending',
        ];
    }
}
