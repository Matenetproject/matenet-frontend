import { useState, useEffect } from 'react';
import { User, Wallet, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVERURL}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setProfile(data.user);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRefresh = () => {
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-center relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={handleRefresh}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
                title="Refresh profile"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {profile?.username || 'User Profile'}
            </h1>
            <p className="text-indigo-100">Member Profile</p>
          </div>

          {/* Profile Information */}
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">Username</p>
                      <p className="text-lg text-gray-900 break-words">
                        {profile?.username || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Wallet className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">Wallet Address</p>
                      <p className="text-lg text-gray-900 font-mono break-all">
                        {profile?.walletAddress || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {profile?._id && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-gray-600 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">#</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 mb-1">User ID</p>
                        <p className="text-sm text-gray-700 font-mono break-all">
                          {profile._id}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {profile?.createdAt && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-gray-600 mt-1 flex-shrink-0">
                        <span className="text-sm">📅</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 mb-1">Member Since</p>
                        <p className="text-lg text-gray-900">
                          {new Date(profile.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition">
                Edit Profile
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
