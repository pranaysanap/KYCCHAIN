import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface PasswordUpdateCardProps {
  onPasswordUpdate: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PasswordUpdateCard: React.FC<PasswordUpdateCardProps> = ({
  onPasswordUpdate,
  onSuccess,
  onError
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength === 0) return { label: '', color: '' };
    if (strength <= 2) return { label: 'Weak', color: 'text-red-400' };
    if (strength <= 3) return { label: 'Medium', color: 'text-yellow-400' };
    if (strength <= 4) return { label: 'Good', color: 'text-blue-400' };
    return { label: 'Strong', color: 'text-green-400' };
  };

  const getPasswordStrengthWidth = (strength: number) => {
    return `${(strength / 5) * 100}%`;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-gradient-to-r from-red-500 to-rose-600';
    if (strength <= 3) return 'bg-gradient-to-r from-yellow-500 to-amber-600';
    if (strength <= 4) return 'bg-gradient-to-r from-blue-500 to-indigo-600';
    return 'bg-gradient-to-r from-emerald-500 to-green-600';
  };

  const passwordStrength = calculatePasswordStrength(newPassword);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await onPasswordUpdate(currentPassword, newPassword, confirmPassword);

      // Clear form on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to update password';
      setErrors({ form: errorMessage });

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { met: newPassword.length >= 8, text: 'At least 8 characters' },
    { met: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword), text: 'Upper & lowercase letters' },
    { met: /\d/.test(newPassword), text: 'At least one number' },
    { met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword), text: 'At least one special character' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700/50 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Change Password</h2>
          <p className="text-gray-400 text-sm mt-1">Keep your account secure with a strong password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            Current Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Shield className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full bg-gray-800/50 border ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-700'
              } rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.currentPassword && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-slide-in-right">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.currentPassword}</span>
            </div>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            New Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full bg-gray-800/50 border ${
                errors.newPassword ? 'border-red-500' : 'border-gray-700'
              } rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="mt-3 space-y-2 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Password Strength</span>
                <span className={`text-xs font-semibold ${strengthInfo.color}`}>
                  {strengthInfo.label}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getPasswordStrengthColor(passwordStrength)} transition-all duration-500 ease-out`}
                  style={{ width: getPasswordStrengthWidth(passwordStrength) }}
                />
              </div>
            </div>
          )}

          {errors.newPassword && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-slide-in-right">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.newPassword}</span>
            </div>
          )}

          {/* Password Requirements */}
          {newPassword && (
            <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 animate-fade-in-up">
              <p className="text-xs font-semibold text-gray-400 mb-3">Password Requirements:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      req.met ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'
                    } transition-all duration-300`}>
                      {req.met ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    <span className={`text-xs ${req.met ? 'text-gray-300' : 'text-gray-500'} transition-colors`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            Confirm New Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-gray-800/50 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
              } rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-slide-in-right">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.confirmPassword}</span>
            </div>
          )}

          {/* Match Indicator */}
          {confirmPassword && newPassword && (
            <div className={`flex items-center gap-2 text-sm mt-2 animate-fade-in-up ${
              newPassword === confirmPassword ? 'text-green-400' : 'text-gray-400'
            }`}>
              {newPassword === confirmPassword ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Passwords match</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Passwords don't match</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Form Error */}
        {errors.form && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl animate-bounce-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400">Failed to update password</p>
                <p className="text-sm text-red-300 mt-1">{errors.form}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-300">Security Tip</p>
              <p className="text-xs text-gray-400 mt-1">
                Choose a strong, unique password that you don't use on other websites. Consider using a password manager to generate and store secure passwords.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordUpdateCard;
