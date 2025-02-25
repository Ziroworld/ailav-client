export class AuthServer {
  static async register(userData) {
    try {
      const response = await fetch("http://localhost:8080/api/V3/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return { success: true, token: data.token, data: data.user };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  }
  // hooks => useMemo, useState, useEffect useRef, so on....
  

    static async login(credentials) {
      try {
        const response = await fetch("http://localhost:8080/api/V3/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
  
        // ✅ Store token & role in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", data.role);
  
        return { success: true, token: data.token, role: data.role };
      } catch (error) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
      }
    }

    static async requestOtp(email) {
      try {
        const response = await fetch("http://localhost:8080/api/V3/auth/request-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Request OTP failed");
        }
        return { success: true, message: data.message };
      } catch (error) {
        console.error("Request OTP error:", error.message);
        return { success: false, error: error.message };
      }
    }
  
    static async verifyOtp(email, otp) {
      try {
        const response = await fetch("http://localhost:8080/api/V3/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "OTP verification failed");
        }
        return { success: true, userId: data.userId, message: data.message };
      } catch (error) {
        console.error("Verify OTP error:", error.message);
        return { success: false, error: error.message };
      }
    }
  
    static async resetPassword(userId, newPassword, email) {
      try {
        const response = await fetch("http://localhost:8080/api/V3/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, newPassword, email }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Reset password failed");
        }
        return { success: true, message: data.message };
      } catch (error) {
        console.error("Reset password error:", error.message);
        return { success: false, error: error.message };
      }
    }
  
}
