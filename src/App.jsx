import { HashRouter, Route, Routes } from 'react-router-dom';

import QRCodeReader from './pages/QRCodeReader';
import NFCReader from './pages/NFCReader';
import Home from './pages/Home';

export default function App() {

  return (
    <HashRouter>
      <appkit-button />
      <Routes>
        <Route
          path="/scannfc"
          element={<NFCReader />} />
        <Route
          path="/scanqr"
          element={<QRCodeReader />} />
        <Route
          path="/"
          element={<Home />} />
      </Routes>
    </HashRouter>
  );
}