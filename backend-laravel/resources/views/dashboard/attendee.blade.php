@extends('layouts.app')
@section('title', 'My Dashboard – EventHub')

@push('styles')
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
@endpush

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
        <p class="text-gray-600">View your registered events and QR codes</p>
    </div>

    @if($registrations->isEmpty())
        <div class="card-base p-12 text-center">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
            </div>
            <p class="text-gray-500 text-lg mb-4">You haven't registered for any events yet</p>
            <a href="{{ route('events.index') }}" class="btn-primary inline-block">Browse Events</a>
        </div>
    @else
        <div class="space-y-4">
            @foreach($registrations as $registration)
            <div class="card-3d p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex-1">
                        <h3 class="text-2xl font-bold text-gray-900 mb-3">{{ $registration->event?->title ?? 'Event' }}</h3>
                        <div class="space-y-2 text-gray-600 mb-4">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                <span>{{ $registration->event ? \Carbon\Carbon::parse($registration->event->date)->format('M d, Y') : '' }} at {{ $registration->event?->time }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                <span>{{ $registration->event?->venue }}</span>
                            </div>
                        </div>
                        @if($registration->attendance_status === 'checked_in')
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                Checked In
                            </span>
                        @else
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                Registered
                            </span>
                        @endif
                    </div>
                    <button onclick="showQR('{{ $registration->id }}', '{{ $registration->qr_code }}')"
                        class="btn-primary flex items-center gap-2 whitespace-nowrap">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5V16M4 8h12v4H4V8zm8-4h4v4h-4V4zm-8 0h4v4H4V4zm0 8h4v4H4v-4z"/></svg>
                        Show QR Code
                    </button>
                </div>
            </div>
            @endforeach
        </div>
    @endif
</div>

{{-- QR Code Modal --}}
<dialog id="qr-modal" class="rounded-2xl shadow-2xl p-0 w-full max-w-sm backdrop:bg-black/50">
    <div class="p-8 flex flex-col items-center">
        <h3 class="text-xl font-bold text-gray-900 mb-2">Your Ticket QR Code</h3>
        <p id="qr-event-name" class="text-sm text-gray-600 mb-6"></p>
        <div id="qr-container" class="bg-white p-4 rounded-xl border-2 border-gray-200 mb-4"></div>
        <p id="qr-code-text" class="text-xs text-gray-500 font-mono mb-6"></p>
        <div class="flex gap-3 w-full">
            <button onclick="downloadQR()" class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Download
            </button>
            <button onclick="document.getElementById('qr-modal').close()" class="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
                Close
            </button>
        </div>
    </div>
</dialog>

@push('scripts')
<script>
let currentQRCode = null;

function showQR(id, qrData) {
    const container = document.getElementById('qr-container');
    const codeText = document.getElementById('qr-code-text');
    container.innerHTML = '';
    codeText.textContent = qrData;

    currentQRCode = new QRCode(container, {
        text: qrData,
        width: 220,
        height: 220,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    document.getElementById('qr-modal').showModal();
}

function downloadQR() {
    const canvas = document.querySelector('#qr-container canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'eventhub-ticket.png';
        link.click();
    }
}

// Close dialog on backdrop click
document.getElementById('qr-modal').addEventListener('click', function(e) {
    if (e.target === this) this.close();
});
</script>
@endpush
@endsection
