import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';

interface QRCodeDisplayProps {
  qrCode: string;
  eventTitle?: string;
  userName?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCode,
  eventTitle,
  userName,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const getCanvas = (): HTMLCanvasElement | null =>
    canvasRef.current?.querySelector('canvas') as HTMLCanvasElement | null;

  const handleDownload = () => {
    const canvas = getCanvas();
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `qr-code-${qrCode}.png`;
      link.click();
    }
  };

  const handlePrint = () => {
    const canvas = getCanvas();
    if (canvas) {
      const printWindow = window.open();
      if (printWindow) {
        printWindow.document.write(
          `<img src="${canvas.toDataURL()}" style="max-width: 100%;">`
        );
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={canvasRef}
        className="bg-white p-6 rounded-lg border-2 border-gray-200 dark:border-gray-600"
      >
        <QRCodeCanvas
          value={qrCode}
          size={220}
          level="H"
          includeMargin={true}
          fgColor="#000000"
          bgColor="#ffffff"
        />
      </div>

      {eventTitle && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 font-medium">
          Event: {eventTitle}
        </p>
      )}

      {userName && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
          Attendee: {userName}
        </p>
      )}

      <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-2 font-mono">
        {qrCode}
      </p>

      <div className="flex gap-3 mt-5">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-200"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>
    </div>
  );
};
