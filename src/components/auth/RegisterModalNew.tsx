import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import BankSelector from '../consent/BankSelector';

interface RegisterModalNewProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegister: (data: { name?: string; institutionName?: string; email: string; accountType: string; password: string; phone: string; address: string }) => void;
  loading?: boolean;
  prefilledEmail?: string;
}

const RegisterModalNew: React.FC<RegisterModalNewProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegister,
  loading = false,
  prefilledEmail,
}) => {
  const [formData, setFormData] = useState({
    accountType: 'Individual User',
    name: '',
    institutionName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        accountType: 'Individual User',
        name: '',
        institutionName: '',
        email: prefilledEmail || '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
      });
      setErrors({});
    }
  }, [isOpen, prefilledEmail]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.accountType === 'Individual User' && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (formData.accountType === 'Bank/Institution' && !formData.institutionName.trim()) {
      newErrors.institutionName = 'Institution name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onRegister({
        accountType: formData.accountType,
        name: formData.accountType === 'Individual User' ? formData.name : undefined,
        institutionName: formData.accountType === 'Bank/Institution' ? formData.institutionName : undefined,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Enhanced Modal Content */}
            <div className="relative rounded-2xl shadow-2xl bg-gray-900/95">

              {/* Glowing Border Effect - Fixed to cover entire scrollable area */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.2), rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.3))',
                  padding: '2px',
                }}
              >
                <div className="w-full h-full bg-gray-900/90 rounded-2xl" />
              </motion.div>

              {/* Scrollable Content Area */}
              <div
                className="relative rounded-2xl p-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >

              {/* Floating Icons */}
              <motion.div
                className="absolute top-4 right-4"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <User className="w-6 h-6 text-blue-400 opacity-60" />
              </motion.div>

              {/* Header */}
              <div className="relative text-center mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <User className="w-6 h-6 text-white" />
                </motion.div>
                <motion.h2
                  className="text-xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Join KYCChain
                </motion.h2>
                <motion.p
                  className="text-gray-400 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Create your secure account
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="relative space-y-4">
                {/* Account Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('accountType', 'Individual User')}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        formData.accountType === 'Individual User'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <User className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs font-medium">Individual</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('accountType', 'Bank/Institution')}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        formData.accountType === 'Bank/Institution'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <Building className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs font-medium">Institution</div>
                    </button>
                  </div>
                </div>

                {/* Name/Institution Name Field */}
                {formData.accountType === 'Individual User' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          errors.name ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Institution Name
                    </label>
                    <BankSelector
                      value={formData.institutionName}
                      onChange={(value) => handleInputChange('institutionName', value)}
                      className={`w-full ${errors.institutionName ? 'border-red-500' : ''}`}
                    />
                    {errors.institutionName && (
                      <p className="text-red-400 text-sm mt-1">{errors.institutionName}</p>
                    )}
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!!prefilledEmail}
                      autoComplete="off"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.email ? 'border-red-500' : 'border-gray-600'
                      } ${prefilledEmail ? 'opacity-75 cursor-not-allowed' : ''}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">📱</span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.phone ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.address ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Enter your address"
                  />
                  {errors.address && (
                    <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full pl-10 pr-10 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.password ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-10 pr-10 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              {/* Switch to Login */}
              <div className="text-center mt-4">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={onSwitchToLogin}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign in here
                  </button>
                </p>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-3 rounded-full bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 hover:border-gray-500 transition-all duration-300 z-10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <X className="w-6 h-6 text-gray-300 hover:text-white" />
              </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModalNew;
