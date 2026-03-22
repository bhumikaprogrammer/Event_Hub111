import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { apiClient } from '../services/apiClient';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export const CheckInScanner: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      false
    );

    const onScanSuccess = async (decodedText: string) => {
      scanner.clear();
      setIsCheckingIn(true);
      setScanError(null);

      try {
        if (!eventId) {
          throw new Error('Event ID is missing.');
        }
        const registration = await apiClient.checkIn(decodedText, eventId);
        if (registration && registration.user) {
          setScanResult(`Success! Attendee ${registration.user.name} checked in.`);
        } else {
          throw new Error('Invalid registration data received.');
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Invalid QR Code or already checked in.';
        setScanError(errorMessage);
      } finally {
        setIsCheckingIn(false);
      }
    };

    const onScanFailure = () => {
      // This is called frequently, so we don't want to set state here.
      // console.warn(`QR scan error: ${error}`);
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5-qrcode scanner.", error);
      });
    };
  }, [eventId]);

  const resetScanner = () => {
    setScanResult(null);
    setScanError(null);
    // The scanner will be re-rendered by the useEffect hook
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(`/organizer/events/${eventId}/attendees`)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Attendees
        </Button>
        <h1 className="text-3xl font-bold">QR Code Check-In</h1>
      </div>

      <Card>
        <div id="qr-reader" className="w-full"></div>
        
        {isCheckingIn && (
          <div className="mt-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Verifying ticket...</p>
          </div>
        )}

        {scanResult && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2" />
            <p className="font-semibold">{scanResult}</p>
            <Button onClick={resetScanner} className="mt-4">Scan Next Ticket</Button>
          </div>
        )}

        {scanError && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg text-center">
            <XCircle className="w-12 h-12 mx-auto mb-2" />
            <p className="font-semibold">{scanError}</p>
            <Button onClick={resetScanner} className="mt-4">Try Again</Button>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};