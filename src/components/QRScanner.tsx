import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Camera, CheckCircle } from 'lucide-react';
import { Registration } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Alert } from './ui/Alert';
import { Badge } from './ui/Badge';

interface QRScannerProps {
  onScan: (qrCode: string) => Promise<Registration | null>;
  eventId: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [registrationData, setRegistrationData] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [manualQR, setManualQR] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (scanning) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [scanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        captureFrame();
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to access camera. Please check permissions.',
      });
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const captureFrame = () => {
    if (!scanning) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // In a real app, use jsQR or similar library to decode
        // For now, just simulate QR detection
        setTimeout(() => {
          captureFrame();
        }, 500);
      }
    }
  };

  const handleManualQRSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQR.trim()) return;

    setLoading(true);
    setMessage(null);
    try {
      const result = await onScan(manualQR);
      if (result) {
        setRegistrationData(result);
        setMessage({ type: 'success', text: 'QR code scanned successfully!' });
      } else {
        setMessage({ type: 'error', text: 'QR code not found or already checked in' });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to process QR code',
      });
    } finally {
      setLoading(false);
      setManualQR('');
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert
          variant={message.type === 'success' ? 'success' : 'error'}
          dismissible
          onDismiss={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {registrationData && (
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Attendee Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {registrationData.user?.name || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-base text-gray-900">{registrationData.user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Status</p>
              <Badge
                variant={registrationData.attendanceStatus === 'checked_in' ? 'success' : 'primary'}
              >
                {registrationData.attendanceStatus === 'checked_in' ? 'Checked In' : 'Registered'}
              </Badge>
            </div>
          </div>

          {registrationData.attendanceStatus !== 'checked_in' && (
            <Button
              className="w-full mt-4"
              variant="primary"
              leftIcon={<CheckCircle className="w-5 h-5" />}
            >
              Check In Attendee
            </Button>
          )}
        </Card>
      )}

      {scanning && (
        <Card padding="sm" className="bg-gray-900">
          <video ref={videoRef} className="w-full h-64 rounded-lg bg-black" playsInline />
          <canvas ref={canvasRef} width={320} height={240} className="hidden" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-primary-500 rounded-lg"></div>
          </div>
          <Button
            onClick={() => setScanning(false)}
            className="mt-4 w-full bg-red-600 hover:bg-red-700"
          >
            Stop Camera
          </Button>
        </Card>
      )}

      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code or Enter Manually</h3>

        <form onSubmit={handleManualQRSubmit} className="space-y-4">
          <Input
            label="QR Code"
            type="text"
            value={manualQR}
            onChange={(e) => setManualQR(e.target.value)}
            placeholder="Paste QR code or use camera..."
            autoFocus
          />

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || !manualQR.trim()}
              loading={loading}
              leftIcon={<QrCode className="w-5 h-5" />}
              className="flex-1"
            >
              Scan
            </Button>

            <Button
              type="button"
              onClick={() => setScanning(!scanning)}
              variant="secondary"
              leftIcon={<Camera className="w-5 h-5" />}
              className="flex-1"
            >
              {scanning ? 'Stop' : 'Camera'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
