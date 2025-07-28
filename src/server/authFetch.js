import { AuthServer, cachedCsrfToken } from "./authserver";

// This helper is used for all authenticated API requests
export async function authFetch(url, options = {}) {
  let token = localStorage.getItem("accessToken");
  const method = (options.method || "GET").toUpperCase();

  // Always include credentials for cookies
  const baseOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  };

  // Attach CSRF for state-changing requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    // Get or refresh CSRF token
    if (!cachedCsrfToken) {
      await AuthServer.getCsrfToken();
    }
    baseOptions.headers["x-csrf-token"] = cachedCsrfToken;
  }

  let res = await fetch(url, baseOptions);

  if (res.status === 401) {
    // Try refresh token if unauthorized
    token = await AuthServer.refreshAccessToken();
    if (!token) {
      localStorage.removeItem("accessToken");
      throw new Error("Session expired, please log in again.");
    }
    baseOptions.headers.Authorization = `Bearer ${token}`;
    res = await fetch(url, baseOptions);
  }

  // If CSRF error (forbidden), refetch token and retry once
  if (res.status === 403 && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    await AuthServer.getCsrfToken(true); // Force refetch
    baseOptions.headers["x-csrf-token"] = cachedCsrfToken;
    res = await fetch(url, baseOptions);
  }

  return res;
}
