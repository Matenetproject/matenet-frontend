import { useState, useEffect } from 'react';
import { Wallet, AlertCircle, CheckCircle2, Loader2, Shield } from 'lucide-react';
import { SiweMessage } from 'siwe';

export default function Login() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasMetaMask, setHasMetaMask] = useState(false);

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
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in with Ethereum to continue</p>
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

          {/* Connected Account Display */}
          {account && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-green-800 font-medium mb-1">Wallet Connected</p>
                  <p className="text-sm text-green-700 font-mono">{truncateAddress(account)}</p>
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
                      Sign In with Ethereum
                    </>
                  )}
                </button>
                
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Change Wallet
                </button>
              </>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>New to Web3?</strong> This app uses Sign-In with Ethereum (SIWE) for secure authentication. Your account will be created automatically on first sign-in.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have a wallet?{' '}
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Get MetaMask
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
