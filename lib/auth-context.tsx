"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi, setAuthToken, getAuthToken, type AuthUser } from "./api";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (_phoneOrEmail: string, _password: string, _redirectPath?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          // Try to refresh the session using the refresh token cookie
          const result = await authApi.refresh();
          setAuthToken(result.accessToken);
          
          // Get user info from /me endpoint
          const userData = await authApi.getMe();
          setUser(userData);
        }
      } catch (error) {
        // Session is invalid, clear token
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Automatic token refresh on 401 errors
  useEffect(() => {
    const handle401 = async () => {
      if (isRefreshing) return;
      
      try {
        setIsRefreshing(true);
        const result = await authApi.refresh();
        setAuthToken(result.accessToken);
        // Retry the failed request would happen here in a more sophisticated implementation
      } catch (error) {
        // Refresh failed, logout
        setAuthToken(null);
        setUser(null);
        router.push("/login");
      } finally {
        setIsRefreshing(false);
      }
    };

    // This is a simplified version - in production, you'd intercept fetch calls
    // or use an axios interceptor to handle 401s automatically
    window.addEventListener("unhandledrejection", (event) => {
      if ((event.reason as any)?.status === 401) {
        handle401();
      }
    });

    return () => {
      window.removeEventListener("unhandledrejection", () => {});
    };
  }, [isRefreshing, router]);

  const login = async (phoneOrEmail: string, password: string, redirectPath?: string) => {
    try {
      const isEmail = phoneOrEmail.includes("@");
      const dto = isEmail 
        ? { email: phoneOrEmail, password }
        : { phone: phoneOrEmail, password };
      
      const result = await authApi.login(dto);
      setAuthToken(result.accessToken);
      setUser(result.user);
      
      // Redirect to provided path or homepage after successful login
      router.push(redirectPath || "/");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthToken(null);
      setUser(null);
      // Force reload to clear any client-side state
      window.location.href = "/login";
    }
  };

  const refreshSession = async () => {
    try {
      const result = await authApi.refresh();
      setAuthToken(result.accessToken);
    } catch (error) {
      setAuthToken(null);
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
