const API_URL = "https://localhost:8080/api/V3/auth";

export class AuthServer {
  // Registration - stays unchanged
  static async register(userData) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      return { success: true, data: data.user };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  }

  // Login - sets accessToken, never saves refreshToken in JS
  static async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("accessToken", data.accessToken); // Use new key name!
      return { success: true, accessToken: data.accessToken, user: data.user };
    } catch (error) {
      console.error("Login error:", error.message);
      return { success: false, error: error.message };
    }
  }

  // Fetches user using current accessToken
  static async getCurrentUser() {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/currentuser`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      return null;
    }
  }

  // Refreshes the access token using the refreshToken (httpOnly cookie)
  static async refreshAccessToken() {
    try {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Refresh failed");
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } catch (e) {
      localStorage.removeItem("accessToken");
      return null;
    }
  }

  // OTP-related methods stay unchanged (unless you want cookies)
  static async requestOtp(email) {
    try {
      const response = await fetch(`${API_URL}/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request OTP failed");
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Request OTP error:", error.message);
      return { success: false, error: error.message };
    }
  }

  static async verifyOtp(email, otp) {
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "OTP verification failed");
      return { success: true, userId: data.userId, message: data.message };
    } catch (error) {
      console.error("Verify OTP error:", error.message);
      return { success: false, error: error.message };
    }
  }

  static async resetPassword(userId, newPassword, email) {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword, email }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Reset password failed");
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Reset password error:", error.message);
      return { success: false, error: error.message };
    }
  }
}

// -----------------------------
// Authenticated fetch helper
// -----------------------------
export async function authFetch(url, options = {}) {
  let token = localStorage.getItem("accessToken");
  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    // Try refresh token if unauthorized
    token = await AuthServer.refreshAccessToken();
    if (!token) {
      // Optionally: redirect to login page here
      throw new Error("Session expired, please log in again.");
    }
    // Retry the original request
    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  }
  return res;
}
