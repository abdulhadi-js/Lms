"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { authApi, tokens, AuthUser, LoginResponse } from "@/lib/api";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Silent token refresh ────────────────────────────────────────────────────
  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    // Refresh 2 minutes before a standard 15-minute token expires
    const REFRESH_INTERVAL_MS = 13 * 60 * 1000; // 13 minutes

    refreshTimerRef.current = setTimeout(async () => {
      const refreshToken = localStorage.getItem("lms_refresh_token");
      if (!refreshToken) {
        // No refresh token — log the user out cleanly
        tokens.clear();
        localStorage.removeItem("lms_user");
        setUser(null);
        router.push("/login");
        return;
      }

      try {
        const data = await authApi.refresh(refreshToken);
        tokens.set(data.accessToken, data.refreshToken);
        // Schedule the next refresh cycle
        scheduleRefresh();
      } catch {
        // Refresh failed — session truly expired, force logout
        tokens.clear();
        localStorage.removeItem("lms_user");
        setUser(null);
        router.push("/login");
      }
    }, REFRESH_INTERVAL_MS);
  }, [router]);

  // ── Hydrate user on mount ───────────────────────────────────────────────────
  useEffect(() => {
    async function loadUser() {
      try {
        const storedUser = localStorage.getItem("lms_user");
        const accessToken = tokens.getAccessToken();

        if (storedUser && accessToken) {
          // Verify token is still valid
          await authApi.me();
          setUser(JSON.parse(storedUser));
          // Start the refresh timer once we know we're authenticated
          scheduleRefresh();
        }
      } catch {
        // Token invalid or expired — try refresh before giving up
        const refreshToken = localStorage.getItem("lms_refresh_token");
        if (refreshToken) {
          try {
            const data = await authApi.refresh(refreshToken);
            tokens.set(data.accessToken, data.refreshToken);
            const me = await authApi.me();
            localStorage.setItem("lms_user", JSON.stringify(me));
            setUser(me);
            scheduleRefresh();
          } catch {
            // Both access and refresh tokens are invalid
            tokens.clear();
            localStorage.removeItem("lms_user");
            setUser(null);
          }
        } else {
          tokens.clear();
          localStorage.removeItem("lms_user");
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();

    // ── Cross-tab logout sync ─────────────────────────────────────────────────
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "lms_access_token" && !e.newValue) {
        // Token was cleared in another tab — sync state here
        setUser(null);
        router.push("/login");
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [scheduleRefresh, router]);

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const data: LoginResponse = await authApi.login(email, password);
      tokens.set(data.accessToken, data.refreshToken);
      localStorage.setItem("lms_user", JSON.stringify(data.user));
      setUser(data.user);
      scheduleRefresh();

      // Route based on role — backend uses INSTRUCTOR (not TEACHER)
      const redirectPaths: Record<string, string> = {
        ADMIN: "/admin",
        INSTRUCTOR: "/teacher",
        STUDENT: "/student",
      };
      router.push(redirectPaths[data.user.role ?? ''] ?? "/");
    } catch (err: any) {
      setError(err.message ?? "Login failed. Please check your credentials.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, scheduleRefresh]);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    try {
      await authApi.logout();
    } catch {
      // Silently ignore — still clear local state
    } finally {
      tokens.clear();
      localStorage.removeItem("lms_user");
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

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
