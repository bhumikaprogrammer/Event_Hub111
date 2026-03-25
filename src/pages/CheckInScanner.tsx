import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Camera, CameraOff, StopCircle, Upload } from 'lucide-react';

export const CheckInScanner: React.FC = () => {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScanner = () => {
    setError(null);
    setScanning(true); // show the div first, useEffect will start camera
  };

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    Html5Qrcode.getCameras()
      .then((cameras) => {
        if (!cameras || cameras.length === 0) {
          setError('No camera found on this device.');
          setScanning(false);
          return;
        }
        const camera = cameras.find(c => /back|rear|environment/i.test(c.label)) ?? cameras[0];
        return scanner.start(
          camera.id,
          { fps: 15, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => {
            const token = decodedText.includes('/checkin/')
              ? decodedText.split('/checkin/')[1]
              : decodedText;
            scanner.stop().then(() => navigate(`/checkin/${token}`));
          },
          () => {}
        );
      })
      .catch((err: any) => {
        setError(err?.message || 'Could not access camera. Please allow camera permissions and try again.');
        setScanning(false);
      });

    return () => {
      safeStop(scanner).catch(() => {});
    };
  }, [scanning, navigate]);

  const safeStop = (scanner: Html5Qrcode) => {
    if (scanner.isScanning) return scanner.stop();
    return Promise.resolve();
  };

  const stopScanner = () => {
    if (scannerRef.current) safeStop(scannerRef.current).catch(() => {});
    setScanning(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const scanner = new Html5Qrcode('qr-reader-file');
    try {
      const decodedText = await scanner.scanFile(file, false);
      const token = decodedText.includes('/checkin/')
        ? decodedText.split('/checkin/')[1]
        : decodedText;
      navigate(`/checkin/${token}`);
    } catch {
      setError('Could not read a QR code from this image.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QR Code Scanner</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Scan an attendee's QR code to check them in</p>
      </div>
      <div className="max-w-lg mx-auto">
      <Card>
        <div id="qr-reader" className={scanning ? 'w-full' : 'hidden'} />
        <div id="qr-reader-file" className="hidden" />

        {!scanning && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Camera className="w-16 h-16 text-gray-300 dark:text-gray-600" />
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <CameraOff className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={startScanner}>
                <span className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Scan from Camera
                </span>
              </Button>
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload QR Image
                </span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}

        {scanning && (
          <div className="mt-4 flex justify-center">
            <Button variant="destructive" onClick={stopScanner}>
              <span className="flex items-center gap-2">
                <StopCircle className="w-4 h-4" />
                Stop Camera
              </span>
            </Button>
          </div>
        )}
      </Card>
      </div>
    </DashboardLayout>
  );
};