const API_BASE_URL = "http://localhost:5000/api";

export interface SendOTPRequest {
  email: string;
}

export interface SendOTPResponse {
  message: string;
  otp?: string; // Only present in development
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  verified: boolean;
}

export interface RegisterRequest {
  fullName?: string;
  institutionName?: string;
  email: string;
  accountType: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    fullName: string;
    accountType: string;
    institutionName?: string;
    logoUrl?: string;
  };
  token: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

export interface ConsentRecord {
  id: string;
  institutionName: string;
  status: "granted" | "revoked";
  lastUpdated: string;
  blockchainTx?: string;
}

export interface VerificationLog {
  id: string;
  ts: string;
  userId: string;
  userName: string;
  docType: string | null;
  action: string;
  admin: string;
  tx: string;
  status: string;
}

export interface VerificationLogsResponse {
  items: VerificationLog[];
  total: number;
  stats?: {
    granted: number;
    revoked: number;
    active: number;
    totalUsers: number;
  };
}

export interface LogDetails {
  id: string;
  ts: string;
  action: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  document: {
    sha256: string;
    tx: string;
    status: string;
  };
  description: string;
  fraud: {
    score: number;
    flags: string[];
  } | null;
  etherscan: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Merge headers properly so that options.headers does not overwrite our
    // default Content-Type. Build headers first and then spread options,
    // ensuring the final config.headers contains the merged object.
    const mergedHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    const config: RequestInit = {
      ...options,
      headers: mergedHeaders,
    };

    try {
      console.log("🌐 API Request:", url);
      const response = await fetch(url, config);
      console.log("📡 Response Status:", response.status, response.statusText);

      // Get the response text first
      const responseText = await response.text();
      console.log(
        "📄 Response Text (first 200 chars):",
        responseText.substring(0, 200),
      );

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        console.error("   Full Response:", responseText);
        throw new Error(
          `Invalid JSON response from server. The server might be down or returning HTML. Response: ${responseText.substring(0, 100)}`,
        );
      }

      if (!response.ok) {
        console.error("❌ API Error Response:", data);
        // Include server 'details' field if present to aid debugging
        const serverMessage = data.error || `HTTP error! status: ${response.status}`;
        const serverDetails = data.details ? ` - ${data.details}` : "";
        throw new Error(`${serverMessage}${serverDetails}`);
      }

      console.log("✅ API Response:", data);
      return data;
    } catch (error) {
      console.error("❌ API Request Failed:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  // Send OTP to email
  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    return this.request<SendOTPResponse>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // Verify OTP
  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    return this.request<VerifyOTPResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // Register user
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // Login user
  async login(request: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // Add Authorization header for authenticated requests
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("kycchain_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Example of an authenticated request (for future use)
  async getProfile(): Promise<{
    user: { id: string; email: string; name: string; role: string };
  }> {
    return this.request("/profile/profile", {
      method: "GET",
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Update profile (fullName, email, phone, address, twoFactorEnabled)
  async updateProfile(payload: Partial<{ fullName: string; email: string; phone: string; address: string; twoFactorEnabled: boolean }>): Promise<any> {
    return this.request<any>("/profile/profile", {
      method: "PUT",
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
  }

  // Update preferences (existing mock endpoint on server)
  async updatePreferences(payload: Partial<{ theme: string; emailAlerts: boolean; fraudAlerts: boolean; language: string }>): Promise<any> {
    return this.request<any>("/profile/preferences", {
      method: "PUT",
      headers: { ...this.getAuthHeaders() },
      body: JSON.stringify(payload),
    });
  }

  // Deactivate account (best-effort - backend may implement deactivation)
  async deactivateAccount(): Promise<any> {
    return this.request<any>("/profile/deactivate", {
      method: "PUT",
      headers: { ...this.getAuthHeaders() },
    });
  }

  // Delete account
  async deleteAccount(): Promise<any> {
    return this.request<any>("/profile/profile", {
      method: "DELETE",
      headers: { ...this.getAuthHeaders() },
    });
  }

  // Update Password
  async updatePassword(
    request: UpdatePasswordRequest,
  ): Promise<UpdatePasswordResponse> {
    return this.request<UpdatePasswordResponse>("/profile/password", {
      method: "PUT",
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(request),
    });
  }

  // Get user documents
  async getDocuments(email: string): Promise<unknown[]> {
    return this.request<unknown[]>(`/documents/documents/${email}`, {
      method: "GET",
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Upload user avatar image
  async uploadAvatar(file: File): Promise<{ message: string; profileImage: string }> {
    const url = `${API_BASE_URL}/profile/avatar`;
    const form = new FormData();
    form.append('avatar', file);

    const token = localStorage.getItem('kycchain_token');
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: form,
    });

    if (!resp.ok) {
      const txt = await resp.text();
      try { const parsed = JSON.parse(txt); throw new Error(parsed.error || parsed.message || txt); } catch (e) { throw new Error(txt); }
    }

    const data = await resp.json();
    return data;
  }

  // Get user consents
  async getConsents(): Promise<ConsentRecord[]> {
    return this.request<ConsentRecord[]>("/consent/consents", {
      method: "GET",
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Grant consent to an institution
  async grantConsent(institutionName: string): Promise<ConsentRecord> {
    return this.request<ConsentRecord>("/consent/consents", {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ institutionName }),
    });
  }

  // Revoke consent from an institution
  async revokeConsent(institutionName: string): Promise<ConsentRecord> {
    return this.request<ConsentRecord>(
      `/consent/consents/${encodeURIComponent(institutionName)}`,
      {
        method: "PUT",
        headers: {
          ...this.getAuthHeaders(),
        },
      },
    );
  }

  // Get verification logs (for banks)
  async getVerificationLogs(params?: {
    q?: string;
    action?: string;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
  }): Promise<VerificationLogsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.q) queryParams.append("q", params.q);
    if (params?.action) queryParams.append("action", params.action);
    if (params?.from) queryParams.append("from", params.from);
    if (params?.to) queryParams.append("to", params.to);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());

    const queryString = queryParams.toString();
    const url = `/consent/verification-logs${queryString ? `?${queryString}` : ""}`;

    return this.request<VerificationLogsResponse>(url, {
      method: "GET",
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Get log details (for banks)
  async getLogDetails(logId: string): Promise<LogDetails> {
    return this.request<LogDetails>(`/consent/verification-logs/${logId}`, {
      method: "GET",
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }
}

export const apiService = new ApiService();
