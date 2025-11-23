import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Shield, Sparkles, Zap, Star, Globe, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import BankSelector from '../consent/BankSelector';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegister: (data: { name?: string; institutionName?: string; email: string; accountType: string; password: string; phone: string; address: string }) => void;
  loading?: boolean;
  prefilledEmail?: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
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
          {/* Enhanced Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ pointerEvents: 'auto' }}
          />

          {/* Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  scale: [0.5, 1.2, 0.5],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-lg"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Enhanced Modal Content */}
            <div className="relative rounded-3xl shadow-2xl bg-gray-900/95">

              {/* Glowing Border Effect - Fixed to cover entire scrollable area */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.2), rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.3))',
                  padding: '2px',
                }}
              >
                <div className="w-full h-full bg-gray-900/90 rounded-3xl" />
              </motion.div>

              {/* Scrollable Content Area */}
              <div
                className="relative rounded-3xl p-8 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
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
                <Shield className="w-6 h-6 text-blue-400 opacity-60" />
              </motion.div>
              <motion.div
                className="absolute bottom-4 left-4"
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Sparkles className="w-5 h-5 text-purple-400 opacity-50" />
              </motion.div>
              <motion.div
                className="absolute top-1/2 left-4"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Star className="w-4 h-4 text-green-400 opacity-40" />
              </motion.div>

              {/* Header */}
              <div className="relative text-center mb-8">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 cosmic-glow"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <User className="w-8 h-8 text-white" />
                </motion.div>
                <motion.h2
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Join KYCChain
                </motion.h2>
                <motion.p
                  className="text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Create your secure account
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="relative space-y-6">
                {/* Account Type Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('accountType', 'Individual User')}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        formData.accountType === 'Individual User'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                          : 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <User className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-sm font-medium">Individual User</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('accountType', 'Bank/Institution')}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        formData.accountType === 'Bank/Institution'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                          : 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <Building className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-sm font-medium">Bank/Institution</div>
                    </button>
                  </div>
                </motion.div>

                {/* Name/Institution Name Field */}
                {formData.accountType === 'Individual User' ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <motion.input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                          errors.name ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                        }`}
                        placeholder="Enter your full name"
                        whileFocus={{
                          scale: 1.02,
                          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0"
                        whileFocus={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    {errors.name && (
                      <motion.p
                        className="text-red-400 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Institution Name
                    </label>
                    <BankSelector
                      value={formData.institutionName}
                      onChange={(value) => handleInputChange('institutionName', value)}
                      className={`w-full ${errors.institutionName ? 'border-red-500' : ''}`}
                    />
                    {errors.institutionName && (
                      <motion.p
                        className="text-red-400 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.institutionName}
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <motion.input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!!prefilledEmail}
                      autoComplete="off"
                      className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                        errors.email ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                      } ${prefilledEmail ? 'opacity-75 cursor-not-allowed' : ''}`}
                      placeholder="Enter your email"
                      whileFocus={{
                        scale: 1.02,
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0"
                      whileFocus={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      className="text-red-400 text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                {/* Phone Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                      📱
                    </div>
                    <motion.input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                        errors.phone ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                      }`}
                      placeholder="Enter your phone number"
                      whileFocus={{
                        scale: 1.02,
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0"
                      whileFocus={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {errors.phone && (
                    <motion.p
                      className="text-red-400 text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </motion.div>

                {/* Address Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className={`w-full pl-4 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                        errors.address ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                      }`}
                      placeholder="Enter your address"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 pointer-events-none"
                      whileFocus={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {errors.address && (
                    <motion.p
                      className="text-red-400 text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.address}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <motion.input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      disabled={true}
                      className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                        errors.password ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                      } opacity-75 cursor-not-allowed`}
                      placeholder="Create a strong password"
                      whileFocus={{
                        scale: 1.02,
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                      }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0"
                      whileFocus={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {errors.password && (
                    <motion.p
                      className="text-red-400 text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <motion.input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      disabled={true}
                      className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                      } opacity-75 cursor-not-allowed`}
                      placeholder="Confirm your password"
                      whileFocus={{
                        scale: 1.02,
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                      }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0"
                      whileFocus={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      className="text-red-400 text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="w-full cosmic-glow"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </motion.div>
              </form>

              {/* Switch to Login */}
              <motion.div
                className="relative text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <motion.button
                    onClick={onSwitchToLogin}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign in here
                  </motion.button>
                </p>
              </motion.div>

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

export default RegisterModal;
