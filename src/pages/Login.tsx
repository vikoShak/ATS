import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = login(username, password);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please check your Login ID and password.');
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Create email content
    const subject = 'Password Reset Request - RecruitIQ';
    const body = `Dear Admin,

A password reset request has been submitted for the following account:

Login ID: ${forgotPasswordEmail}
Request Time: ${new Date().toLocaleString()}
IP Address: [System will capture]

Please assist the user with password reset.

Best regards,
RecruitIQ System`;

    // Open email client
    const mailtoLink = `mailto:vivekk@therecruitiq.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);

    // Show success message
    alert(
      'Password reset request has been sent to the administrator. You will be contacted shortly.'
    );

    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050A30] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Animated Text Header */}
        <div className="text-center">
          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#9E7FFF] to-[#f472b6] bg-clip-text text-transparent font-great-vibes animate-hero-text-reveal">
            The RecruitIQ
          </h1>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Login ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your Login ID"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-orange-600 hover:text-orange-700 transition-colors duration-200"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Forgot Password
                </h3>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label
                    htmlFor="forgotEmail"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter your Login ID
                  </label>
                  <input
                    id="forgotEmail"
                    type="text"
                    required
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your Login ID"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </form>
              <p className="text-xs text-gray-500 mt-3 text-center">
                A password reset request will be sent to the administrator
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
