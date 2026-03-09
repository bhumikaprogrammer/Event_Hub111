@extends('layouts.app')
@section('title', 'Admin Dashboard – EventHub')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Manage events, approve submissions, and view statistics</p>
    </div>

    {{-- Stats --}}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card-3d p-6 flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <div>
                <p class="text-sm font-semibold text-gray-600">Total Events</p>
                <p class="text-3xl font-extrabold text-gray-900">{{ $stats['totalEvents'] }}</p>
            </div>
        </div>
        <div class="card-3d p-6 flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
                <p class="text-sm font-semibold text-gray-600">Total Users</p>
                <p class="text-3xl font-extrabold text-gray-900">{{ $stats['totalUsers'] }}</p>
            </div>
        </div>
        <div class="card-3d p-6 flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
                <p class="text-sm font-semibold text-gray-600">Total Registrations</p>
                <p class="text-3xl font-extrabold text-gray-900">{{ $stats['totalRegistrations'] }}</p>
            </div>
        </div>
    </div>

    {{-- Pending Events --}}
    <div class="card-base p-0 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center gap-3">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <h2 class="text-2xl font-bold text-gray-900">Pending Event Approvals</h2>
            <span class="ml-auto px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full">{{ $pendingEvents->count() }}</span>
        </div>

        @if($pendingEvents->isEmpty())
            <div class="p-12 text-center">
                <svg class="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p class="text-gray-500 text-lg">All events have been reviewed!</p>
            </div>
        @else
            <div class="divide-y divide-gray-100">
                @foreach($pendingEvents as $event)
                <div class="p-6 hover:bg-gray-50 transition">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div class="flex-1">
                            <div class="flex items-start gap-3 mb-3 flex-wrap">
                                <h3 class="text-xl font-bold text-gray-900">{{ $event->title }}</h3>
                                <span class="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">{{ $event->type }}</span>
                            </div>
                            <p class="text-gray-600 mb-3">{{ $event->description }}</p>
                            <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span class="flex items-center gap-1">📅 {{ \Carbon\Carbon::parse($event->date)->format('M d, Y') }} at {{ $event->time }}</span>
                                <span class="flex items-center gap-1">📍 {{ $event->venue }}</span>
                                <span class="flex items-center gap-1">👥 {{ $event->capacity }} capacity</span>
                                @if($event->organizer)
                                    <span class="flex items-center gap-1">👤 {{ $event->organizer->name }}</span>
                                @endif
                            </div>
                        </div>
                        <div class="flex gap-2 flex-shrink-0">
                            <form method="POST" action="{{ route('admin.events.approve', $event) }}">
                                @csrf
                                <button type="submit" class="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    Approve
                                </button>
                            </form>
                            <form method="POST" action="{{ route('admin.events.reject', $event) }}"
                                onsubmit="return confirm('Are you sure you want to reject this event?')">
                                @csrf
                                <button type="submit" class="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    Reject
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        @endif
    </div>
</div>
@endsection
