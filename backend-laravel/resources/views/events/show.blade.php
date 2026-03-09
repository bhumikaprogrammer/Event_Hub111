@extends('layouts.app')
@section('title', $event->title . ' – EventHub')

@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <a href="{{ route('events.index') }}" class="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back to Events
    </a>

    <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        {{-- Banner --}}
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-48 flex items-center justify-center">
            <span class="text-white text-4xl font-bold">{{ $event->type }}</span>
        </div>

        <div class="p-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $event->title }}</h1>

            {{-- Info Grid --}}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
                <div class="flex items-start gap-3">
                    <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Date & Time</p>
                        <p class="text-lg font-semibold text-gray-900">{{ \Carbon\Carbon::parse($event->date)->format('M d, Y') }} at {{ $event->time }}</p>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Location</p>
                        <p class="text-lg font-semibold text-gray-900">{{ $event->venue }}</p>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Capacity</p>
                        <p class="text-lg font-semibold text-gray-900">{{ $event->registered_count }}/{{ $event->capacity }}</p>
                    </div>
                </div>
            </div>

            {{-- Description --}}
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p class="text-gray-700 leading-relaxed text-lg">{{ $event->description }}</p>
            </div>

            {{-- Registration Progress --}}
            @php $availableSeats = $event->capacity - $event->registered_count; @endphp
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Registration Status</h3>
                <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
                    @php $pct = $event->capacity > 0 ? min(100, ($event->registered_count / $event->capacity) * 100) : 0; @endphp
                    <div class="bg-blue-600 h-4 rounded-full transition-all" style="width: {{ $pct }}%"></div>
                </div>
                <p class="text-sm text-gray-600">{{ $event->registered_count }} out of {{ $event->capacity }} spots filled</p>
                @if($availableSeats <= 20 && $availableSeats > 0)
                    <p class="text-sm text-orange-600 font-semibold mt-2">Only {{ $availableSeats }} seats remaining!</p>
                @endif
            </div>

            {{-- Action Buttons --}}
            <div class="flex gap-4">
                @if($userRegistration)
                    <div class="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Registered
                    </div>
                @elseif($availableSeats <= 0)
                    <div class="flex-1 bg-gray-400 text-gray-200 font-semibold py-3 px-6 rounded-xl text-center cursor-not-allowed">Event Full</div>
                @else
                    @auth
                        <form method="POST" action="{{ route('events.register', $event) }}" class="flex-1">
                            @csrf
                            <button type="submit" class="btn-primary w-full">Register Now</button>
                        </form>
                    @else
                        <a href="{{ route('login') }}" class="flex-1 btn-primary text-center block">Login to Register</a>
                    @endauth
                @endif
                <a href="{{ route('events.index') }}" class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition duration-200">Cancel</a>
            </div>
        </div>
    </div>
</div>
@endsection
