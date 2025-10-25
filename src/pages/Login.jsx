import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, AlertCircle, CheckCircle2, Loader2, Shield } from 'lucide-react';
import { SiweMessage } from 'siwe';
import {
  Box,
  Container,
} from '@mui/material';

import HomeLogo from '../assets/homelogo.png';

export default function Login() {
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('siwe_jwt') || localStorage.getItem('authToken')) navigate("/register");
  }, [])
  

  useEffect(() => {
    // Check if MetaMask is installed
    setHasMetaMask(typeof window.ethereum !== 'undefined');

    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        })
        .catch(console.error);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setSuccess('Wallet connected successfully!');
      }
    } catch (err) {
      setError('User rejected the connection request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEthereum = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { BrowserProvider } = await import('https://cdn.jsdelivr.net/npm/ethers@6.7.0/+esm');

      const scheme = window.location.protocol.slice(0, -1);
      const domain = window.location.host;
      const origin = window.location.origin;
      const provider = new BrowserProvider(window.ethereum);
      const BACKEND_ADDR = import.meta.env.VITE_SERVERURL + "/api/auth/siwe";

      // Get nonce from backend
      const nonceRes = await fetch(`${BACKEND_ADDR}/nonce`, {
        credentials: 'include',
      });
      const { nonce } = await nonceRes.json();

      // Create SIWE message
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      const message = new SiweMessage({
        scheme,
        domain,
        address,
        statement: 'Sign in with Ethereum to Matenet App, in case of new account, it will be registered automatically.',
        uri: origin,
        version: '1',
        chainId: '1',
        nonce: nonce,
      });

      const preparedMessage = message.prepareMessage();

      // Sign the message
      const signature = await signer.signMessage(preparedMessage);

      // Verify with backend
      const verifyRes = await fetch(`${BACKEND_ADDR}/verify`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: preparedMessage, signature }),
        credentials: 'include'
      });

      const result = await verifyRes.json();

      if (result.success) {
        localStorage.setItem('siwe_jwt', result.token);
        setSuccess('Authentication successful! Redirecting...');
        navigate("/register");
      } else {
        throw new Error(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign-in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFFFFF' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: '#FFFFFF',
        }}
      >
        <Container maxWidth="sm" sx={{ pb: 4 }}>
          {/* Header */}
          <div className="text-center mb-8">
            <img className="mx-auto mt-[100px] mb-[100px]" src={HomeLogo} alt="home logo" />
          </div>

          {/* MetaMask Check */}
          {!hasMetaMask && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium mb-1">MetaMask Required</p>
                  <p className="text-sm text-yellow-700">
                    Please install{' '}
                    <a 
                      href="https://metamask.io/download/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-yellow-900"
                    >
                      MetaMask
                    </a>
                    {' '}to continue.
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!account ? (
              <button
                onClick={connectWallet}
                disabled={loading || !hasMetaMask}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={signInWithEthereum}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Connect Wallet
                    </>
                  )}
                </button>
              </>
            )}
          </div>

        </Container>
      </Box>
    </Box>
  );
}
