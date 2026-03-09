@extends('layouts.app')
@section('title', 'Create Account – EventHub')

@section('content')
<div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    {{-- Animated Background --}}
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style="animation-delay:1s"></div>
    </div>

    <div class="relative card-3d p-10 w-full max-w-md animate-slide-in my-8">
        {{-- Header --}}
        <div class="text-center mb-8">
            <div class="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl mb-4 transform hover:rotate-6 transition-transform duration-300">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                </svg>
            </div>
            <h1 class="text-4xl font-extrabold mb-2"><span class="gradient-text">EventHub</span></h1>
            <p class="text-gray-600">Join us and start managing events</p>
        </div>

        {{-- Validation Errors --}}
        @if ($errors->any())
            <div class="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-slide-in shadow-md">
                <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                    @foreach ($errors->all() as $error)
                        <p class="text-red-800 font-medium">{{ $error }}</p>
                    @endforeach
                </div>
            </div>
        @endif

        {{-- Register Form --}}
        <form method="POST" action="{{ route('register') }}" class="space-y-5">
            @csrf
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input type="text" name="name" value="{{ old('name') }}" required
                    class="input-modern @error('name') border-red-400 @enderror"
                    placeholder="John Doe">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input type="email" name="email" value="{{ old('email') }}" required
                    class="input-modern @error('email') border-red-400 @enderror"
                    placeholder="you@example.com">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input type="password" name="password" required
                    class="input-modern @error('password') border-red-400 @enderror"
                    placeholder="••••••••">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input type="password" name="password_confirmation" required
                    class="input-modern"
                    placeholder="••••••••">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
                <select name="role" class="input-modern">
                    <option value="attendee" {{ old('role') === 'attendee' ? 'selected' : '' }}>Attendee</option>
                    <option value="organizer" {{ old('role') === 'organizer' ? 'selected' : '' }}>Organizer</option>
                </select>
            </div>
            <button type="submit" class="btn-primary w-full mt-6 text-center">
                Create Account
            </button>
        </form>

        <div class="mt-8 text-center">
            <p class="text-gray-600">
                Already have an account?
                <a href="{{ route('login') }}" class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold hover:from-blue-700 hover:to-purple-700 transition-all">Sign In</a>
            </p>
        </div>
    </div>
</div>
@endsection
