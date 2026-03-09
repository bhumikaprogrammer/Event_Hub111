@extends('layouts.app')
@section('title', 'Sign In – EventHub')

@section('content')
<div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    {{-- Animated Background --}}
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style="animation-delay:1s"></div>
    </div>

    <div class="relative card-3d p-10 w-full max-w-md animate-slide-in">
        {{-- Header --}}
        <div class="text-center mb-8">
            <div class="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl mb-4 transform hover:rotate-6 transition-transform duration-300">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                </svg>
            </div>
            <h1 class="text-4xl font-extrabold mb-2"><span class="gradient-text">EventHub</span></h1>
            <p class="text-gray-600">Welcome back! Sign in to continue</p>
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

        {{-- Login Form --}}
        <form method="POST" action="{{ route('login') }}" class="space-y-5">
            @csrf
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
            <button type="submit" class="btn-primary w-full mt-6 text-center">
                Sign In
            </button>
        </form>

        <div class="mt-8 text-center">
            <p class="text-gray-600">
                Don't have an account?
                <a href="{{ route('register') }}" class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold hover:from-blue-700 hover:to-purple-700 transition-all">Sign Up</a>
            </p>
        </div>

        {{-- Demo Accounts --}}
        <div class="mt-6 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <p class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Demo Accounts
            </p>
            <div class="space-y-2 text-xs">
                <div class="flex justify-between items-center p-2 bg-white/60 rounded-lg"><span class="font-medium text-gray-700">Attendee:</span><span class="text-gray-600">test@attendee.com</span></div>
                <div class="flex justify-between items-center p-2 bg-white/60 rounded-lg"><span class="font-medium text-gray-700">Organizer:</span><span class="text-gray-600">test@organizer.com</span></div>
                <div class="flex justify-between items-center p-2 bg-white/60 rounded-lg"><span class="font-medium text-gray-700">Admin:</span><span class="text-gray-600">test@admin.com</span></div>
                <p class="text-center text-gray-600 mt-3 pt-3 border-t border-blue-200">Password: <span class="font-bold">password123</span></p>
            </div>
        </div>
    </div>
</div>
@endsection
