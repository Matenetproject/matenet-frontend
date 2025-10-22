import QRCodeReader from './pages/QRCodeReader';
import NFCReader from './pages/NFCReader';

export default function App() {

  return (
    <div>
      <QRCodeReader />
      <NFCReader />
    </div>
  );
}