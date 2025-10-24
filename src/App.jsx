import { HashRouter, Route, Routes } from 'react-router-dom';

import QRCodeReader from './pages/QRCodeReader';
import NFCReader from './pages/NFCReader';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';

export default function App() {

  return (
    <HashRouter>
      <appkit-button />
      <Routes>
        <Route
          path="/register"
          element={<Register />} />
        <Route
          path="/profile"
          element={<Profile />} />
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