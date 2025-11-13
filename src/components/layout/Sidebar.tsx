import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  AlertTriangle,
  User,
  LogOut,
  Shield,
  Users,
  History,
  Building,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Try to resolve profile image from auth user or stored profile
  let avatarUrl: string | null = null;
  try {
    if ((user as any)?.profileImage) avatarUrl = (user as any).profileImage;
    else {
      const storedProfile = localStorage.getItem('kycchain_profile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        avatarUrl = parsed?.user?.profileImage || null;
      }
    }
  } catch (e) {
    avatarUrl = null;
  }

  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'documents', label: 'My Documents', icon: <FileText className="w-5 h-5" /> },
    { id: 'consent', label: 'Consent', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'fraud-alerts', label: 'Fraud Alerts', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> }
  ];

  const bankMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    // Removed 'consent' from bank menu: banks should use Verification / Verification Logs
    { id: 'verification', label: 'User Verification', icon: <Users className="w-5 h-5" /> },
    { id: 'verification-logs', label: 'Verification Logs', icon: <History className="w-5 h-5" /> },
    { id: 'fraud-alerts', label: 'Fraud Alerts', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <Building className="w-5 h-5" /> }
  ];

  const menuItems = user?.role === 'bank' ? bankMenuItems : userMenuItems;

  const asideVariants = {
    open: { width: 256, transition: { type: 'spring', stiffness: 260, damping: 30 } },
    collapsed: { width: 80, transition: { type: 'spring', stiffness: 260, damping: 30 } },
  };

  const itemHover = { scale: 1.03 };
  const iconHover = { scale: 1.12 };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}

      <motion.aside
        initial={false}
        animate={collapsed ? 'collapsed' : 'open'}
        variants={asideVariants}
        className={`h-screen fixed left-0 top-0 z-40 flex flex-col transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ background: 'linear-gradient(180deg, rgba(12,14,30,0.92) 0%, rgba(10,12,20,0.88) 60%)', borderRight: '1px solid rgba(255,255,255,0.04)', boxShadow: '0 8px 30px rgba(2,6,23,0.6)' }}
      >
        {/* Logo / Top */}
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span key="brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xl font-bold text-white">
                  KYCChain
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800/40 transition-colors"
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
          {/* mobile menu icon */}
          <div className="md:hidden">
            <button onClick={onToggle} className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800/40 transition-colors"><Menu className="w-5 h-5" /></button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center space-x-3">
            <button onClick={() => onPageChange('profile')} className="w-10 h-10 rounded-full overflow-hidden shrink-0 block" aria-label="Open profile">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </button>
            <div className="overflow-hidden">
              <AnimatePresence>
                {!collapsed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="font-medium text-white truncate">{(user && (user.name || (user as any).fullName)) || (localStorage.getItem('kycchain_user') ? JSON.parse(localStorage.getItem('kycchain_user') as string).name : 'User')}</p>
                    <p className="text-sm text-gray-400 capitalize">{user?.role || 'user'} Account</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <motion.button
                  layout
                  whileHover={itemHover}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors focus:outline-none ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-800/30 hover:text-white'
                  }`}
                  onClick={() => onPageChange(item.id)}
                >
                  <motion.span whileHover={iconHover} className="flex items-center justify-center w-6 h-6">
                    {item.icon}
                  </motion.span>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span key={item.id + '-label'} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} className="flex-1 text-sm text-left">
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* active indicator */}
                  <motion.span
                    layout
                    className={`ml-auto w-2 h-2 rounded-full ${currentPage === item.id ? 'bg-white/90' : 'bg-transparent'}`}
                    animate={{ scale: currentPage === item.id ? 1 : 0.8, opacity: currentPage === item.id ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout + collapse control at bottom */}
        <div className="p-3 border-t border-white/6 flex items-center justify-between gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">Logout</motion.span>}
            </AnimatePresence>
          </motion.button>

          <div className="hidden md:flex">
            <button onClick={() => setCollapsed((c) => !c)} aria-label="Toggle collapse" className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800/40 transition-colors">
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;