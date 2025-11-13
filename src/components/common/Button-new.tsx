import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  children,
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group will-change-transform';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-500 text-white glow-pulse-multi hover:shadow-2xl hover:shadow-blue-500/30 liquid-button',
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white hover:shadow-xl hover:shadow-gray-500/25 border border-gray-600/50 hover:border-gray-500/70',
    success: 'bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 hover:from-green-500 hover:via-green-600 hover:to-emerald-500 text-white glow-pulse-multi hover:shadow-2xl hover:shadow-green-500/30 liquid-button',
    danger: 'bg-gradient-to-r from-red-600 via-red-700 to-rose-600 hover:from-red-500 hover:via-red-600 hover:to-rose-500 text-white glow-pulse-multi hover:shadow-2xl hover:shadow-red-500/30 liquid-button',
    warning: 'bg-gradient-to-r from-yellow-600 via-yellow-700 to-amber-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-amber-500 text-white glow-pulse-multi hover:shadow-2xl hover:shadow-yellow-500/30 liquid-button',
    ghost: 'bg-transparent hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-gray-700/80 text-gray-300 hover:text-white border-2 border-gray-600/70 hover:border-gray-500/90 hover:shadow-xl hover:shadow-gray-500/20 backdrop-blur-sm'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        'focus-ring magnetic-hover',
        className
      )}
      disabled={disabled || loading}
      whileHover={{
        scale: 1.05,
        y: -2,
        boxShadow: variant !== 'ghost'
          ? `0 20px 40px rgba(59, 130, 246, 0.4), 0 0 20px rgba(59, 130, 246, 0.2)`
          : `0 15px 30px rgba(0, 0, 0, 0.3)`
      }}
      whileTap={{
        scale: 0.95,
        y: 0
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.2
      }}
      {...props}
    >
      {/* Enhanced Animated Background */}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
          initial={false}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}

      {/* Multi-layer Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: variant === 'primary'
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
            : variant === 'success'
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)'
            : variant === 'danger'
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)'
            : variant === 'warning'
            ? 'radial-gradient(circle, rgba(250, 204, 21, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(107, 114, 128, 0.2) 0%, transparent 70%)'
        }}
      />

      {/* Enhanced Ripple Effect */}
      <motion.div
        className="absolute inset-0 bg-white/30 rounded-xl"
        initial={{ scale: 0, opacity: 1 }}
        whileTap={{
          scale: 6,
          opacity: 0,
          transition: { duration: 0.6, ease: "easeOut" }
        }}
      />

      {/* Particle Burst on Hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{
          opacity: 1,
          transition: { duration: 0.3 }
        }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${20 + (i % 2) * 60}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              y: [-10, -30, -10],
              transition: {
                duration: 0.8,
                delay: i * 0.1,
                ease: "easeOut"
              }
            }}
          />
        ))}
      </motion.div>

      {/* Content with Enhanced Animations */}
      <div className="relative flex items-center space-x-3 z-10">
        {loading && (
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="glow-pulse-multi"
          >
            <Loader2 className="w-5 h-5" />
          </motion.div>
        )}
        {!loading && icon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1
            }}
            whileHover={{
              scale: 1.2,
              rotate: 15,
              transition: { duration: 0.2 }
            }}
          >
            {icon}
          </motion.div>
        )}
        <motion.span
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2
          }}
          whileHover={{
            scale: 1.05,
            textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
            transition: { duration: 0.2 }
          }}
          className="font-bold tracking-wide"
        >
          {loading ? "Loading..." : children}
        </motion.span>
      </div>

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: '-150%' }}
        whileHover={{
          x: '150%',
          transition: {
            duration: 0.8,
            ease: "easeInOut"
          }
        }}
      />
    </motion.button>
  );
};

export default Button;
