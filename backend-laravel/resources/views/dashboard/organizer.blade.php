@extends('layouts.app')
@section('title', 'Event Management – EventHub')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    {{-- Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Event Management</h1>
            <p class="text-gray-600">Manage your events and registrations</p>
        </div>
        <div class="flex gap-3">
            <button onclick="document.getElementById('scanner-modal').showModal()"
                class="btn-secondary flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5V16M4 8h12v4H4V8zm8-4h4v4h-4V4zm-8 0h4v4H4V4zm0 8h4v4H4v-4z"/></svg>
                QR Scanner
            </button>
            <button onclick="openEventForm(null)"
                class="btn-primary flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Create Event
            </button>
        </div>
    </div>

    {{-- Stats --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="card-3d p-5 flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div><p class="text-xs font-semibold text-gray-500">Total Events</p><p class="text-2xl font-extrabold text-gray-900">{{ $stats['total'] }}</p></div>
        </div>
        <div class="card-3d p-5 flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div><p class="text-xs font-semibold text-gray-500">Approved</p><p class="text-2xl font-extrabold text-gray-900">{{ $stats['approved'] }}</p></div>
        </div>
        <div class="card-3d p-5 flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div><p class="text-xs font-semibold text-gray-500">Pending</p><p class="text-2xl font-extrabold text-gray-900">{{ $stats['pending'] }}</p></div>
        </div>
        <div class="card-3d p-5 flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div><p class="text-xs font-semibold text-gray-500">Registrations</p><p class="text-2xl font-extrabold text-gray-900">{{ $stats['registrations'] }}</p></div>
        </div>
    </div>

    {{-- Events List --}}
    @if($events->isEmpty())
        <div class="card-base p-12 text-center">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <p class="text-gray-500 text-lg mb-4">You haven't created any events yet</p>
            <button onclick="openEventForm(null)" class="btn-primary inline-flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Create Your First Event
            </button>
        </div>
    @else
        <div class="space-y-4">
            @foreach($events as $event)
            <div class="card-3d p-6">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div class="flex-1">
                        <div class="flex items-start gap-3 flex-wrap mb-2">
                            <h3 class="text-2xl font-bold text-gray-900">{{ $event->title }}</h3>
                            @php
                                $statusClass = match($event->status) {
                                    'approved' => 'bg-green-100 text-green-800',
                                    'pending'  => 'bg-yellow-100 text-yellow-800',
                                    default    => 'bg-red-100 text-red-800',
                                };
                            @endphp
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold {{ $statusClass }} capitalize">{{ $event->status }}</span>
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{{ $event->type }}</span>
                        </div>
                        <p class="text-gray-600 mb-3">{{ Str::limit($event->description, 120) }}</p>
                        <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>📅 {{ \Carbon\Carbon::parse($event->date)->format('M d, Y') }} at {{ $event->time }}</span>
                            <span>📍 {{ $event->venue }}</span>
                            <span>👥 {{ $event->registered_count }}/{{ $event->capacity }}</span>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="openEventForm({{ $event->toJson() }})"
                            class="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            Edit
                        </button>
                        @if($event->status === 'approved')
                        <button onclick="openScannerForEvent('{{ $event->id }}', '{{ addslashes($event->title) }}')"
                            class="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5V16M4 8h12v4H4V8z"/></svg>
                            Scan QR
                        </button>
                        @endif
                        <button onclick="openAttendance('{{ $event->id }}', '{{ addslashes($event->title) }}')"
                            class="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            Attendees
                        </button>
                        <form method="POST" action="{{ route('organizer.events.destroy', $event) }}"
                            onsubmit="return confirm('Delete this event? This cannot be undone.')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    @endif
</div>

{{-- Event Form Modal --}}
<dialog id="event-modal" class="rounded-2xl shadow-2xl p-0 w-full max-w-lg backdrop:bg-black/50">
    <div class="p-8">
        <h3 id="event-modal-title" class="text-2xl font-bold text-gray-900 mb-6">Create Event</h3>
        <form id="event-form" method="POST" class="space-y-4">
            @csrf
            <input type="hidden" name="_method" id="form-method" value="POST">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input type="text" name="title" id="field-title" required class="input-modern" placeholder="Event title">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                <select name="type" id="field-type" class="input-modern">
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Networking">Networking</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea name="description" id="field-description" required rows="3" class="input-modern" placeholder="Event description"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                    <input type="date" name="date" id="field-date" required class="input-modern">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                    <input type="time" name="time" id="field-time" required class="input-modern">
                </div>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Venue</label>
                <input type="text" name="venue" id="field-venue" required class="input-modern" placeholder="Event venue">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Capacity</label>
                <input type="number" name="capacity" id="field-capacity" required min="1" class="input-modern" placeholder="100">
            </div>
            <div class="flex gap-3 pt-2">
                <button type="submit" class="btn-primary flex-1">Save Event</button>
                <button type="button" onclick="document.getElementById('event-modal').close()" class="btn-secondary flex-1">Cancel</button>
            </div>
        </form>
    </div>
</dialog>

{{-- QR Scanner Modal --}}
<dialog id="scanner-modal" class="rounded-2xl shadow-2xl p-0 w-full max-w-md backdrop:bg-black/50">
    <div class="p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-2">QR Code Scanner</h3>
        <div id="scanner-event-select">
            <p class="text-gray-600 mb-4">Select an event to scan attendee QR codes:</p>
            <div class="space-y-3 max-h-60 overflow-y-auto mb-4">
                @foreach($events->where('status','approved') as $event)
                <button onclick="openScannerForEvent('{{ $event->id }}', '{{ addslashes($event->title) }}')"
                    class="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition">
                    <h4 class="font-semibold text-gray-900">{{ $event->title }}</h4>
                    <p class="text-sm text-gray-600">{{ \Carbon\Carbon::parse($event->date)->format('M d, Y') }} at {{ $event->time }}</p>
                    <p class="text-sm text-gray-500">{{ $event->venue }}</p>
                </button>
                @endforeach
                @if($events->where('status','approved')->isEmpty())
                    <p class="text-gray-500 text-center py-4">No approved events available for scanning</p>
                @endif
            </div>
        </div>
        <div id="scanner-checkin-form" class="hidden">
            <p class="text-sm font-semibold text-blue-700 mb-4" id="scanner-event-name"></p>
            <button onclick="showEventSelect()" class="text-sm text-blue-600 hover:underline mb-4 block">← Back to Events</button>
            <form method="POST" action="{{ route('organizer.checkin') }}" class="space-y-4">
                @csrf
                <input type="hidden" name="event_id" id="checkin-event-id">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">QR Code</label>
                    <input type="text" name="qr_code" id="qr-input" required
                        class="input-modern" placeholder="Scan or enter QR code (e.g. QR-ABCDEF)" autofocus>
                </div>
                <div id="camera-view" class="hidden">
                    <div id="html5-qrcode-scanner" class="w-full rounded-xl overflow-hidden"></div>
                </div>
                <div class="flex gap-3">
                    <button type="submit" class="btn-primary flex-1">Check In</button>
                    <button type="button" onclick="toggleCamera()" id="camera-btn" class="btn-secondary flex-1">📷 Camera</button>
                </div>
            </form>
        </div>
        <button type="button" onclick="document.getElementById('scanner-modal').close()" class="mt-4 w-full text-center text-gray-500 hover:text-gray-700 font-semibold">Close</button>
    </div>
</dialog>

{{-- Attendance Modal --}}
<dialog id="attendance-modal" class="rounded-2xl shadow-2xl p-0 w-full max-w-lg backdrop:bg-black/50">
    <div class="p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-1">Attendance Tracking</h3>
        <p id="attendance-event-name" class="text-blue-600 font-semibold mb-6"></p>
        <div id="attendance-stats" class="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4 mb-6"></div>
        <div id="attendance-list" class="space-y-3 max-h-96 overflow-y-auto"></div>
        <button type="button" onclick="document.getElementById('attendance-modal').close()" class="mt-6 w-full btn-secondary">Close</button>
    </div>
</dialog>

@push('scripts')
<script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
<script>
const createRoute = "{{ route('organizer.events.store') }}";
const updateBase = "{{ url('organizer/events') }}";

let html5QrCode = null;
let cameraActive = false;

function openEventForm(event) {
    const modal = document.getElementById('event-modal');
    const form = document.getElementById('event-form');
    const title = document.getElementById('event-modal-title');
    const method = document.getElementById('form-method');

    if (event) {
        title.textContent = 'Edit Event';
        form.action = updateBase + '/' + event.id;
        method.value = 'PUT';
        document.getElementById('field-title').value = event.title || '';
        document.getElementById('field-type').value = event.type || 'Conference';
        document.getElementById('field-description').value = event.description || '';
        document.getElementById('field-date').value = (event.date || '').substring(0, 10);
        document.getElementById('field-time').value = event.time || '';
        document.getElementById('field-venue').value = event.venue || '';
        document.getElementById('field-capacity').value = event.capacity || '';
    } else {
        title.textContent = 'Create Event';
        form.action = createRoute;
        method.value = 'POST';
        form.reset();
    }
    modal.showModal();
}

function openScannerForEvent(eventId, eventTitle) {
    document.getElementById('scanner-event-select').classList.add('hidden');
    document.getElementById('scanner-checkin-form').classList.remove('hidden');
    document.getElementById('checkin-event-id').value = eventId;
    document.getElementById('scanner-event-name').textContent = 'Event: ' + eventTitle;
    document.getElementById('scanner-modal').showModal();
    document.getElementById('qr-input').focus();
}

function showEventSelect() {
    document.getElementById('scanner-event-select').classList.remove('hidden');
    document.getElementById('scanner-checkin-form').classList.add('hidden');
    stopCamera();
}

function toggleCamera() {
    const cameraView = document.getElementById('camera-view');
    if (cameraActive) {
        stopCamera();
    } else {
        cameraView.classList.remove('hidden');
        document.getElementById('camera-btn').textContent = '⏹ Stop Camera';
        cameraActive = true;
        html5QrCode = new Html5Qrcode("html5-qrcode-scanner");
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
                document.getElementById('qr-input').value = decodedText;
                stopCamera();
            },
            () => {}
        ).catch(() => {
            alert('Camera access denied or unavailable.');
            stopCamera();
        });
    }
}

function stopCamera() {
    if (html5QrCode && cameraActive) {
        html5QrCode.stop().catch(() => {});
        document.getElementById('camera-view').classList.add('hidden');
        document.getElementById('camera-btn').textContent = '📷 Camera';
        cameraActive = false;
    }
}

function openAttendance(eventId, eventTitle) {
    document.getElementById('attendance-event-name').textContent = eventTitle;
    document.getElementById('attendance-list').innerHTML = '<p class="text-center text-gray-500 py-4">Loading...</p>';
    document.getElementById('attendance-stats').innerHTML = '';
    document.getElementById('attendance-modal').showModal();

    fetch('/organizer/events/' + eventId + '/registrations', {
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
    })
    .then(r => r.json())
    .then(data => {
        const registered = data.filter(a => a.attendance_status === 'registered').length;
        const checkedIn = data.filter(a => a.attendance_status === 'checked_in').length;
        document.getElementById('attendance-stats').innerHTML = `
            <div class="text-center"><p class="text-xs text-gray-500">Total</p><p class="text-2xl font-bold text-gray-900">${data.length}</p></div>
            <div class="text-center"><p class="text-xs text-gray-500">Checked In</p><p class="text-2xl font-bold text-green-600">${checkedIn}</p></div>
            <div class="text-center"><p class="text-xs text-gray-500">Not Checked In</p><p class="text-2xl font-bold text-orange-500">${registered}</p></div>
        `;
        if (data.length === 0) {
            document.getElementById('attendance-list').innerHTML = '<p class="text-gray-500 text-center py-8">No attendees registered yet</p>';
            return;
        }
        document.getElementById('attendance-list').innerHTML = data.map(a => `
            <div class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition">
                <div>
                    <p class="font-semibold text-gray-900">${a.user?.name || 'Unknown'}</p>
                    <p class="text-sm text-gray-500">${a.user?.email || ''}</p>
                    <p class="text-xs text-gray-400 mt-1 font-mono">${a.qr_code}</p>
                </div>
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${a.attendance_status === 'checked_in' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${a.attendance_status === 'checked_in' ? 'Checked In' : 'Registered'}
                </span>
            </div>
        `).join('');
    })
    .catch(() => {
        document.getElementById('attendance-list').innerHTML = '<p class="text-red-500 text-center">Failed to load attendees.</p>';
    });
}

// Close dialogs on backdrop click
['event-modal','scanner-modal','attendance-modal'].forEach(id => {
    document.getElementById(id).addEventListener('click', function(e) {
        if (e.target === this) { this.close(); if (id === 'scanner-modal') stopCamera(); }
    });
});
</script>
@endpush
@endsection
