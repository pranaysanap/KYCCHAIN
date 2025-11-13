import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import PasswordUpdateCard from '../../components/profile/PasswordUpdateCard';
import { ToastContainer, useToast } from '../../components/common/Toast';
import { apiService } from '../../services/api';

const PasswordUpdateExample: React.FC = () => {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error } = useToast();

  const handlePasswordUpdate = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      // Call the real API
      await apiService.updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Show success notification
      success('🎉 Password updated successfully! Your account is now more secure.');
    } catch (err: any) {
      // Show error notification
      const errorMessage = err.message || 'Failed to update password';
      error(`❌ ${errorMessage}`);
      throw err; // Re-throw to let the component handle it
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-8">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </button>

        <div className="flex items-center gap-4 mb-2">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Security Settings</h1>
            <p className="text-gray-400 mt-2">
              Manage your account password and security preferences
            </p>
          </div>
        </div>
      </div>

      {/* Password Update Card */}
      <div className="max-w-4xl mx-auto">
        <PasswordUpdateCard
          onPasswordUpdate={handlePasswordUpdate}
          onSuccess={() => {
            // Additional success actions can be performed here
            console.log('Password updated successfully');
          }}
          onError={(errorMessage) => {
            // Additional error handling can be performed here
            console.error('Password update failed:', errorMessage);
          }}
        />

        {/* Additional Security Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Security Tip 1 */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700/50">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Use Unique Passwords</h3>
            <p className="text-gray-400 text-sm">
              Never reuse passwords across different accounts. Each account should have its own unique password.
            </p>
          </div>

          {/* Security Tip 2 */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700/50">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Enable 2FA</h3>
            <p className="text-gray-400 text-sm">
              Add an extra layer of security by enabling two-factor authentication on your account.
            </p>
          </div>

          {/* Security Tip 3 */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700/50">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Regular Updates</h3>
            <p className="text-gray-400 text-sm">
              Change your password regularly, especially if you suspect any unauthorized access to your account.
            </p>
          </div>
        </div>

        {/* Password Best Practices */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Password Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Do use a mix of characters</p>
                <p className="text-gray-400 text-sm">Include uppercase, lowercase, numbers, and symbols</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Do use at least 12 characters</p>
                <p className="text-gray-400 text-sm">Longer passwords are exponentially harder to crack</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Don't use personal information</p>
                <p className="text-gray-400 text-sm">Avoid names, birthdays, or easily guessable info</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Don't use common words</p>
                <p className="text-gray-400 text-sm">Avoid dictionary words and common patterns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdateExample;
