import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, RegisterData } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  connectWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  // Mock authentication functions for demo
  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user based on email
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      name: credentials.email.includes('bank') ? 'Bank Admin' : 'John Doe',
      role: credentials.email.includes('bank') ? 'bank' : 'user',
      walletAddress: '0x742d35Cc6634C0532925a3b8D9C9f3b67f002c7B',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    localStorage.setItem('kycchain_user', JSON.stringify(mockUser));
    dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
  };

  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role,
      walletAddress: '0x742d35Cc6634C0532925a3b8D9C9f3b67f002c7B',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('kycchain_user', JSON.stringify(mockUser));
    // Seed a richer profile for subsequent Profile page usage
    const seededProfile = {
      user: {
        fullName: data.name,
        email: data.email,
        phone: '',
        address: '',
        role: data.role,
        avatarUrl: ''
      },
      security: {
        twoFactorEnabled: false,
        sessions: [
          { id: 'sess-' + Date.now(), device: 'Chrome on Windows', location: 'Unknown', ip: '127.0.0.1', lastActive: new Date().toISOString() }
        ]
      },
      preferences: {
        theme: 'dark',
        emailAlerts: true,
        fraudAlerts: true,
        language: 'en'
      },
      activity: [
        { id: 'act-' + Date.now(), timestamp: new Date().toISOString(), action: 'Account Created', status: 'success', ip: '127.0.0.1' }
      ]
    };
    localStorage.setItem('kycchain_profile', JSON.stringify(seededProfile));
    dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
  };

  const logout = () => {
    localStorage.removeItem('kycchain_user');
    dispatch({ type: 'LOGOUT' });
  };

  const connectWallet = async (): Promise<void> => {
    // Mock wallet connection
    if (state.user) {
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { walletAddress: '0x742d35Cc6634C0532925a3b8D9C9f3b67f002c7B' }
      });
    }
  };

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('kycchain_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('kycchain_user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      connectWallet
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};