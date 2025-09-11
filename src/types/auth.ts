export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'bank' | 'admin';
  walletAddress?: string;
  bankId?: string;
  profilePic?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'bank';
  bankName?: string;
}