@extends('layouts.app')
@section('title', 'Access Denied – EventHub')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p class="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        @auth
            <a href="{{ route('dashboard') }}" class="inline-block btn-primary">Go to Dashboard</a>
        @else
            <a href="{{ route('login') }}" class="inline-block btn-primary">Sign In</a>
        @endauth
    </div>
</div>
@endsection
