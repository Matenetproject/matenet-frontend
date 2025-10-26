import { HashRouter, Route, Routes } from 'react-router-dom';

import QRCodeReader from './pages/QRCodeReader';
import NFCReader from './pages/NFCReader';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AddPin from './pages/AddPin';
import SocialLinks from './pages/SocialLinks';
import AddFriend from './pages/AddFriend';

export default function App() {

  return (
    <HashRouter>
      {/* <appkit-button /> */}
      <Routes>
        <Route
          path="/addfriend"
          element={<AddFriend />} />
        <Route
          path="/sociallinks"
          element={<SocialLinks />} />
        <Route
          path="/addpin"
          element={<AddPin />} />
        <Route
          path="/register"
          element={<Register />} />
        <Route
          path="/home"
          element={<Home />} />
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
          element={<Login />} />
      </Routes>
    </HashRouter>
  );
}