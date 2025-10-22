import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, X, Copy, CheckCircle } from 'lucide-react';

export default function QRCodeReader() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleScan = (result) => {
    if (result && result[0]) {
      setResult(result[0].rawValue);
      setScanning(false);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const handleStartScan = () => {
    setResult('');
    setCopied(false);
    setScanning(true);
  };

  const handleStopScan = () => {
    setScanning(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <Camera size={32} />
              <h1 className="text-2xl font-bold">QR Code Reader</h1>
            </div>
            <p className="mt-2 opacity-90">Scan any QR code using your camera</p>
          </div>

          <div className="p-6">
            {!scanning && !result && (
              <div className="text-center py-12">
                <div className="inline-block p-6 bg-blue-50 rounded-full mb-6">
                  <Camera size={64} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Ready to scan
                </h2>
                <p className="text-gray-600 mb-6">
                  Click the button below to start scanning QR codes
                </p>
                <button
                  onClick={handleStartScan}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
                >
                  Start Scanning
                </button>
              </div>
            )}

            {scanning && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    constraints={{
                      facingMode: 'environment'
                    }}
                    styles={{
                      container: {
                        width: '100%',
                        paddingTop: '75%',
                        position: 'relative'
                      },
                      video: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }
                    }}
                  />
                </div>

                <button
                  onClick={handleStopScan}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Stop Scanning
                </button>

                <p className="text-center text-sm text-gray-600">
                  Position the QR code within the camera view
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <h3 className="font-semibold text-green-800">QR Code Detected!</h3>
                  </div>
                  <div className="bg-white rounded p-4 break-all text-gray-800 font-mono text-sm">
                    {result}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={20} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={20} />
                        Copy Result
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleStartScan}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    Scan Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>This app requires camera access to scan QR codes</p>
        </div>
      </div>
    </div>
  );
}
