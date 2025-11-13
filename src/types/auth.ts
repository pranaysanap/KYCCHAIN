export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "bank" | "admin";
  walletAddress?: string;
  bankId?: string;
  institutionName?: string;
  profilePic?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  email?: string;
  otpVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName?: string;
  institutionName?: string;
  email: string;
  accountType: "Individual User" | "Bank/Institution";
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

export interface EmailVerificationData {
  email: string;
  otpVerified: boolean;
}

// Legacy interface for backward compatibility
export interface LegacyRegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "bank";
  bankName?: string;
}
