const API_URL = "https://localhost:8080/api/V3/auth";

// Simple in-memory cache for CSRF (scoped to module)
let cachedCsrfToken = null;

export class AuthServer {
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
      return { success: false, error: error.message };
    }
  }

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
      localStorage.setItem("accessToken", data.accessToken);
      // Get fresh CSRF token after login
      cachedCsrfToken = null;
      await AuthServer.getCsrfToken();
      return { success: true, accessToken: data.accessToken, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

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
    } catch {
      return null;
    }
  }

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
    } catch {
      localStorage.removeItem("accessToken");
      return null;
    }
  }

  // CSRF token fetcher
  static async getCsrfToken(force = false) {
    if (cachedCsrfToken && !force) return cachedCsrfToken;
    try {
      const response = await fetch(`${API_URL}/csrf-token`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "CSRF fetch failed");
      cachedCsrfToken = data.csrfToken;
      return cachedCsrfToken;
    } catch (e) {
      cachedCsrfToken = null;
      return null;
    }
  }

  static clearCsrfToken() {
    cachedCsrfToken = null;
  }

  // OTP etc. stay unchanged
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
      return { success: false, error: error.message };
    }
  }
}

export { cachedCsrfToken };
