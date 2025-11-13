import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthState, User, LoginCredentials, RegisterData } from "../types/auth";
import { apiService } from "../services/api";

interface AuthContextType extends AuthState {
  login: (
    credentials: LoginCredentials,
    onSuccess?: (user: User) => void,
  ) => Promise<void>;
  register: (
    data: RegisterData,
    onSuccess?: (user: User) => void,
  ) => Promise<void>;
  logout: () => void;
  connectWallet: () => Promise<void>;
  setEmailVerified: (email: string) => void;
  clearEmailVerification: () => void;
  updateUser?: (payload: Partial<User>) => void;
  avatarModalOpen?: boolean;
  openAvatarModal?: () => void;
  closeAvatarModal?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "SET_EMAIL_VERIFIED"; payload: string }
  | { type: "CLEAR_EMAIL_VERIFICATION" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        email: undefined,
        otpVerified: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        email: undefined,
        otpVerified: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "SET_EMAIL_VERIFIED":
      return {
        ...state,
        email: action.payload,
        otpVerified: true,
      };
    case "CLEAR_EMAIL_VERIFICATION":
      return {
        ...state,
        email: undefined,
        otpVerified: false,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    email: undefined,
    otpVerified: false,
  });

  // Avatar modal state (global) so sidebar can open it
  const [avatarModalOpen, setAvatarModalOpen] = React.useState(false);
  const openAvatarModal = () => setAvatarModalOpen(true);
  const closeAvatarModal = () => setAvatarModalOpen(false);

  // Real login function with API call
  const login = async (
    credentials: LoginCredentials,
    onSuccess?: (user: User) => void,
  ): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Trim inputs before sending to API
      const trimmedCredentials = {
        email: credentials.email.trim(),
        password: credentials.password.trim(),
      };

      const response = await apiService.login(trimmedCredentials);

      // Store token and user data
      localStorage.setItem("kycchain_token", response.token);

      const user: User = {
        id: Date.now().toString(), // Temporary ID
        email: credentials.email,
        name: response.user.fullName,
        role: response.user.accountType === "Individual User" ? "user" : "bank",
        institutionName: response.user.institutionName,
        walletAddress: undefined, // Will be set when wallet is connected
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Attempt to fetch server-side profile (to get persisted avatar and other fields)
      try {
        const serverProfile = await apiService.getProfile();
        const serverUser = (serverProfile && (serverProfile as any).user) || {};
        if (serverUser.profileImage) {
          (user as any).profileImage = serverUser.profileImage;
          // also write to seeded profile object below
        }
        // If server has a fullName, prefer it
        if (serverUser.fullName) user.name = serverUser.fullName;
          // Persist full profile to localStorage
          localStorage.setItem("kycchain_profile", JSON.stringify(serverProfile));
      } catch (profileErr) {
        // If fetching profile fails, still continue with seeded profile
        console.warn("Could not fetch server profile after login:", profileErr);
      }

        localStorage.setItem("kycchain_user", JSON.stringify(user));

        // Seed profile data for Profile page only if we didn't fetch one from server
        const profileInStorage = localStorage.getItem("kycchain_profile");
        if (!profileInStorage) {
          const seededProfile = {
            user: {
              fullName: response.user.fullName,
              email: credentials.email,
              phone: "",
              address: "",
              role: user.role,
              avatarUrl: "",
            },
            security: {
              twoFactorEnabled: false,
              sessions: [
                {
                  id: "sess-" + Date.now(),
                  device: "Chrome on Windows",
                  location: "Unknown",
                  ip: "127.0.0.1",
                  lastActive: new Date().toISOString(),
                },
              ],
            },
            preferences: {
              theme: "dark",
              emailAlerts: true,
              fraudAlerts: true,
              language: "en",
            },
            activity: [
              {
                id: "act-" + Date.now(),
                timestamp: new Date().toISOString(),
                action: "Login Successful",
                status: "success",
                ip: "127.0.0.1",
              },
            ],
          };
          localStorage.setItem("kycchain_profile", JSON.stringify(seededProfile));
        }

        dispatch({ type: "LOGIN_SUCCESS", payload: user });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(user);
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });

      // Enhance error with more specific messaging for credential issues
      if (error instanceof Error) {
        if (
          error.message.toLowerCase().includes("invalid credentials") ||
          error.message.toLowerCase().includes("invalid email or password") ||
          error.message.toLowerCase().includes("unauthorized")
        ) {
          const enhancedError = new Error(
            "Invalid email or password. Please check your credentials and try again. Make sure your caps lock is off.",
          );
          enhancedError.name = "INVALID_CREDENTIALS";
          throw enhancedError;
        }

        if (
          error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("connection")
        ) {
          const enhancedError = new Error(
            "Network error occurred. Please check your internet connection and try again.",
          );
          enhancedError.name = "NETWORK_ERROR";
          throw enhancedError;
        }

        if (
          error.message.toLowerCase().includes("server error") ||
          error.message.toLowerCase().includes("500")
        ) {
          const enhancedError = new Error(
            "Server error occurred. Please try again in a few moments.",
          );
          enhancedError.name = "SERVER_ERROR";
          throw enhancedError;
        }
      }

      throw error;
    }
  };

  // Allow updating user object in context (e.g., to add profileImage after upload)
  const updateUser = (payload: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload });
    try {
      const stored = localStorage.getItem('kycchain_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = { ...parsed, ...payload };
        localStorage.setItem('kycchain_user', JSON.stringify(merged));
      }
      // Also update profile stored object if present
      const storedProfile = localStorage.getItem('kycchain_profile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        parsedProfile.user = { ...(parsedProfile.user || {}), ...(payload as any) };
        localStorage.setItem('kycchain_profile', JSON.stringify(parsedProfile));
      }
    } catch (e) {
      // ignore storage errors
    }
  };

  // Real register function with API call
  const register = async (
    data: RegisterData,
    onSuccess?: (user: User) => void,
  ): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Use the verified email from state or fall back to provided email
      const emailToUse = state.email || data.email;

      const registerRequest = {
        fullName:
          data.accountType === "Individual User" ? data.fullName : undefined,
        institutionName:
          data.accountType === "Bank/Institution"
            ? data.institutionName
            : undefined,
        email: emailToUse,
        accountType: data.accountType,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone,
        address: data.address,
      };

      await apiService.register(registerRequest);

      // Auto-login after successful registration
      await login(
        { email: emailToUse, password: data.password.trim() },
        onSuccess,
      );

      // Clear email verification state
      dispatch({ type: "CLEAR_EMAIL_VERIFICATION" });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });

      // Use the verified email from state or fall back to provided email
      const emailForError = state.email || data.email;

      // Enhance error with more specific messaging for registration issues
      if (error instanceof Error) {
        if (
          error.message.toLowerCase().includes("email already registered") ||
          error.message.toLowerCase().includes("already exists")
        ) {
          const enhancedError = new Error(
            `An account with ${emailForError} already exists. Please try logging in instead or use a different email address.`,
          );
          enhancedError.name = "EMAIL_EXISTS";
          throw enhancedError;
        }

        if (
          error.message.toLowerCase().includes("validation") ||
          error.message.toLowerCase().includes("required")
        ) {
          const enhancedError = new Error(
            "Please check all required fields are filled correctly and try again.",
          );
          enhancedError.name = "VALIDATION_ERROR";
          throw enhancedError;
        }

        if (error.message.toLowerCase().includes("password")) {
          const enhancedError = new Error(
            "Password requirements not met. Please ensure your password is at least 6 characters long.",
          );
          enhancedError.name = "PASSWORD_ERROR";
          throw enhancedError;
        }

        if (
          error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("connection")
        ) {
          const enhancedError = new Error(
            "Network error occurred. Please check your internet connection and try again.",
          );
          enhancedError.name = "NETWORK_ERROR";
          throw enhancedError;
        }
      }

      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("kycchain_user");
    localStorage.removeItem("kycchain_token");
    localStorage.removeItem("kycchain_profile");
    dispatch({ type: "LOGOUT" });
  };

  const connectWallet = async (): Promise<void> => {
    // Mock wallet connection - in real implementation, integrate with Web3
    if (state.user) {
      dispatch({
        type: "UPDATE_USER",
        payload: {
          walletAddress: "0x742d35Cc6634C0532925a3b8D9C9f3b67f002c7B",
        },
      });
    }
  };

  // Set email as verified after OTP verification
  const setEmailVerified = (email: string) => {
    dispatch({ type: "SET_EMAIL_VERIFIED", payload: email });
  };

  // Clear email verification state
  const clearEmailVerification = () => {
    dispatch({ type: "CLEAR_EMAIL_VERIFICATION" });
  };

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("kycchain_user");
    const storedToken = localStorage.getItem("kycchain_token");

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        // If there's a stored profile with avatar, merge it into user state
        const storedProfile = localStorage.getItem('kycchain_profile');
        if (storedProfile) {
          try {
            const parsedProfile = JSON.parse(storedProfile);
            const profileImage = parsedProfile?.user?.profileImage;
            if (profileImage) {
              dispatch({ type: 'UPDATE_USER', payload: { profileImage } as any });
            }
          } catch (e) { /* ignore */ }
        }
      } catch {
        // Clear invalid stored data
        localStorage.removeItem("kycchain_user");
        localStorage.removeItem("kycchain_token");
        localStorage.removeItem("kycchain_profile");
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        connectWallet,
        setEmailVerified,
        clearEmailVerification,
        updateUser,
        avatarModalOpen,
        openAvatarModal,
        closeAvatarModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
