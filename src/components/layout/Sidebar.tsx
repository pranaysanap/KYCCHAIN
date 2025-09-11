import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  UserCheck, 
  AlertTriangle, 
  User, 
  LogOut,
  Shield,
  Users,
  ClipboardCheck,
  History,
  Building
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth();

  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'documents', label: 'My Documents', icon: <FileText className="w-5 h-5" /> },
    { id: 'consent', label: 'Consent', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'fraud-alerts', label: 'Fraud Alerts', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> }
  ];

  const bankMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'consent', label: 'Consent', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'verification', label: 'User Verification', icon: <Users className="w-5 h-5" /> },
    { id: 'verification-logs', label: 'Verification Logs', icon: <History className="w-5 h-5" /> },
    { id: 'fraud-alerts', label: 'Fraud Alerts', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <Building className="w-5 h-5" /> }
  ];

  const menuItems = user?.role === 'bank' ? bankMenuItems : userMenuItems;

  return (
    <aside className="w-64 h-screen bg-gray-900/95 border-r border-gray-800 fixed left-0 top-0 z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold text-white">KYCChain</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-sm text-gray-400 capitalize">{user?.role} Account</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white neon-glow-blue'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;