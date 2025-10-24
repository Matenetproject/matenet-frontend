import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <Link to="/register">
        Register
      </Link>
      <Link to="/profile">
        Profile
      </Link>
      <Link to="/scannfc">
        Scan NFC
      </Link>
      <Link to="/scanqr">
        Scan QR
      </Link>
    </div>
  )
}

export default Home