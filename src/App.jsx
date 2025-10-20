import { useState } from 'react';
import { Nfc, AlertCircle, CheckCircle } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [supported, setSupported] = useState(true);

  const checkNFCSupport = () => {
    if (!('NDEFReader' in window)) {
      setSupported(false);
      setStatus('error');
      setMessage('NFC is not supported on this device or browser');
      return false;
    }
    return true;
  };

  const readNFC = async () => {
    if (!checkNFCSupport()) return;

    try {
      setStatus('scanning');
      setMessage('Hold your phone near the NFC tag...');

      const ndef = new NDEFReader();
      await ndef.scan();

      setMessage('Scanning... Tap your NFC tag now');

      ndef.onreading = (event) => {
        setStatus('success');
        const { serialNumber } = event;
        
        let data = [];
        for (const record of event.message.records) {
          const textDecoder = new TextDecoder(record.encoding || 'utf-8');
          const recordData = {
            type: record.recordType,
            data: textDecoder.decode(record.data)
          };
          data.push(recordData);
        }

        setMessage(`Tag detected!\n\nSerial: ${serialNumber}\n\nData: ${JSON.stringify(data, null, 2)}`);
      };

      ndef.onerror = () => {
        setStatus('error');
        setMessage('Error reading NFC tag');
      };

    } catch (err) {
      setStatus('error');
      if (err.name === 'NotAllowedError') {
        setMessage('NFC permission denied. Please allow NFC access.');
      } else if (err.name === 'NotSupportedError') {
        setMessage('NFC is not supported on this device');
      } else {
        setMessage(`Error: ${err.message}`);
      }
    }
  };

  const writeNFC = async () => {
    if (!checkNFCSupport()) return;

    try {
      setStatus('writing');
      setMessage('Preparing to write... Tap your NFC tag');

      const ndef = new NDEFReader();
      await ndef.write({
        records: [
          { recordType: "text", data: "Hello from React!" },
          { recordType: "url", data: "https://example.com" }
        ]
      });

      setStatus('success');
      setMessage('Successfully written to NFC tag!');
    } catch (err) {
      setStatus('error');
      if (err.name === 'NotAllowedError') {
        setMessage('NFC permission denied');
      } else if (err.name === 'NotSupportedError') {
        setMessage('Writing not supported on this device');
      } else {
        setMessage(`Write error: ${err.message}`);
      }
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'scanning':
      case 'writing':
        return 'bg-blue-100 border-blue-300';
      case 'success':
        return 'bg-green-100 border-green-300';
      case 'error':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-indigo-100 p-4 rounded-full">
              <Nfc className="w-12 h-12 text-indigo-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            NFC Reader
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Tap to read or write NFC tags
          </p>

          {!supported && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                NFC is only supported on Android devices with Chrome browser. 
                Make sure NFC is enabled in your phone settings.
              </p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <button
              onClick={readNFC}
              disabled={!supported}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-md"
            >
              Read NFC Tag
            </button>

            <button
              onClick={writeNFC}
              disabled={!supported}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-md"
            >
              Write to NFC Tag
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-lg border-2 ${getStatusColor()}`}>
              <div className="flex items-start">
                {status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                )}
                {status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <pre className="text-sm whitespace-pre-wrap break-words flex-1">
                  {message}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Requirements:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Android device with NFC</li>
              <li>• Chrome browser (v89+)</li>
              <li>• NFC enabled in settings</li>
              <li>• HTTPS connection (or localhost)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}