@extends('layouts.app')
@section('title', 'Discover Events – EventHub')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Discover Events</h1>
        <p class="text-gray-600">Browse and register for approved events on campus</p>
    </div>

    {{-- Filter Bar --}}
    <form method="GET" action="{{ route('events.index') }}" class="card-base mb-8 flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Search</label>
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Search events..."
                class="input-modern">
        </div>
        <div class="min-w-[150px]">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Type</label>
            <select name="type" class="input-modern">
                <option value="">All Types</option>
                <option value="Conference" {{ request('type') === 'Conference' ? 'selected' : '' }}>Conference</option>
                <option value="Workshop" {{ request('type') === 'Workshop' ? 'selected' : '' }}>Workshop</option>
                <option value="Seminar" {{ request('type') === 'Seminar' ? 'selected' : '' }}>Seminar</option>
                <option value="Networking" {{ request('type') === 'Networking' ? 'selected' : '' }}>Networking</option>
            </select>
        </div>
        <div class="min-w-[160px]">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Date</label>
            <input type="date" name="date" value="{{ request('date') }}" class="input-modern">
        </div>
        <div class="flex gap-2">
            <button type="submit" class="btn-primary py-3">Filter</button>
            @if(request()->hasAny(['search','type','date']))
                <a href="{{ route('events.index') }}" class="btn-secondary py-3">Clear</a>
            @endif
        </div>
    </form>

    @if($events->isEmpty())
        <div class="card-base p-12 text-center">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <p class="text-gray-500 text-lg">No events found matching your criteria.</p>
            @if(request()->hasAny(['search','type','date']))
                <a href="{{ route('events.index') }}" class="mt-4 inline-block text-blue-600 hover:underline">View all events</a>
            @endif
        </div>
    @else
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($events as $event)
            <div class="card-3d group flex flex-col overflow-hidden">
                {{-- Card Header --}}
                <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 flex items-center justify-center">
                    <span class="text-white text-xl font-bold px-4 text-center">{{ $event->type }}</span>
                </div>
                <div class="p-6 flex flex-col flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{{ $event->title }}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ $event->description }}</p>
                    <div class="space-y-2 text-sm text-gray-600 mb-4">
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            {{ \Carbon\Carbon::parse($event->date)->format('M d, Y') }} at {{ $event->time }}
                        </div>
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {{ $event->venue }}
                        </div>
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {{ $event->registered_count }}/{{ $event->capacity }} spots
                        </div>
                    </div>

                    {{-- Capacity Bar --}}
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                        @php $pct = $event->capacity > 0 ? min(100, ($event->registered_count / $event->capacity) * 100) : 0; @endphp
                        <div class="bg-blue-500 h-2 rounded-full" style="width: {{ $pct }}%"></div>
                    </div>
                    @if($event->capacity - $event->registered_count <= 10 && $event->capacity - $event->registered_count > 0)
                        <p class="text-xs text-orange-600 font-semibold mb-3">Only {{ $event->capacity - $event->registered_count }} seats left!</p>
                    @elseif($event->registered_count >= $event->capacity)
                        <p class="text-xs text-red-600 font-semibold mb-3">Event Full</p>
                    @endif

                    <div class="mt-auto">
                        <a href="{{ route('events.show', $event) }}" class="btn-primary w-full block text-center py-2.5">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    @endif
</div>
@endsection
