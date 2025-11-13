import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = '', ...rest }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(2,6,23,0.6)' }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className={`rounded-xl p-6 backdrop-blur-md border border-white/6 bg-gradient-to-br from-indigo-900/20 via-slate-900/10 to-cyan-900/8 ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
