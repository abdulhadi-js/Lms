"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi, tokens, AuthUser, LoginResponse } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount — Hydrate user state
  useEffect(() => {
    async function loadUser() {
      try {
        const storedUser = localStorage.getItem("lms_user");
        const accessToken = tokens.getAccessToken();
        
        if (storedUser && accessToken) {
          // Verify token is still valid with backend
          const validUser = await authApi.me();
          setUser(validUser);
        }
      } catch (err) {
        // Token invalid or expired
        tokens.clear();
        localStorage.removeItem("lms_user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const data: LoginResponse = await authApi.login(email, password);
      tokens.set(data.accessToken, data.refreshToken);
      localStorage.setItem("lms_user", JSON.stringify(data.user));
      setUser(data.user);

      // Route based on role
      const roleRoutes: Record<string, string> = {
        ADMIN: "/admin",
        TEACHER: "/teacher",
        STUDENT: "/student",
      };
      router.push(roleRoutes[data.user.role] ?? "/");
    } catch (err: any) {
      setError(err.message ?? "Login failed. Please check your credentials.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Silently ignore — still clear local state
    } finally {
      tokens.clear();
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
