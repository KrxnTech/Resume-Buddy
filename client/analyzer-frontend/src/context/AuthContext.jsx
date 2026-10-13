import { createContext, useState, useEffect, useCallback, useContext } from "react";

export const AuthContext = createContext();

const API_BASE = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // 'login' | 'register'

  // Initialize authentication from localStorage on boot
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("resume_buddy_token");
      const storedUser = localStorage.getItem("resume_buddy_user");

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // invalid JSON
          }
        }

        // Validate token with backend /api/auth/me
        try {
          const res = await fetch(`${API_BASE}/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setUser(data.user);
            localStorage.setItem("resume_buddy_user", JSON.stringify(data.user));
          } else {
            // Token is invalid/expired
            console.warn("Session expired or invalid, logging out.");
            localStorage.removeItem("resume_buddy_token");
            localStorage.removeItem("resume_buddy_user");
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          console.warn("Could not reach auth server on boot, using cached session:", err);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Register function
  const register = useCallback(async (name, email, password, title = "Software Engineer") => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, title }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create account");
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("resume_buddy_token", data.token);
      localStorage.setItem("resume_buddy_user", JSON.stringify(data.user));
      setAuthModalOpen(false);
      return data.user;
    } catch (err) {
      throw err;
    }
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to log in");
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("resume_buddy_token", data.token);
      localStorage.setItem("resume_buddy_user", JSON.stringify(data.user));
      setAuthModalOpen(false);
      return data.user;
    } catch (err) {
      throw err;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("resume_buddy_token");
    localStorage.removeItem("resume_buddy_user");
  }, []);

  // Update profile
  const updateProfile = useCallback(async ({ name, title, avatar }) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, title, avatar }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile");
      }
      setUser(data.user);
      localStorage.setItem("resume_buddy_user", JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      throw err;
    }
  }, [token]);

  // Save resume scan to user account
  const saveScanToAccount = useCallback(async (scanData) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/save-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scanData),
      });
      const data = await res.json();
      if (res.ok && data.success && data.savedResumes) {
        setUser((prev) => (prev ? { ...prev, savedResumes: data.savedResumes } : prev));
      }
    } catch (e) {
      console.warn("Could not save scan to account:", e);
    }
  }, [token]);

  const openAuthModal = useCallback((mode = "login") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        saveScanToAccount,
        authModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
