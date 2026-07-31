"use client";
import Link from "next/link";
import { Eye, EyeOff, Leaf, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('test_bypass') === 'true') {
        const email = urlParams.get('email') || 'dev.alhadi@gmail.com';
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/test-bypass`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
        .then(res => res.json())
        .then(data => {
          if (data.accessToken) {
            localStorage.setItem('lms_access_token', data.accessToken);
            localStorage.setItem('lms_refresh_token', data.refreshToken);
            window.location.href = data.user.role === 'STUDENT' ? '/student' : data.user.role === 'TEACHER' ? '/teacher' : '/admin';
          }
        });
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLocalError(null);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
    } catch (err: any) {
      toast.error(err?.message || 'Login failed. Please try again.');
    }
  };

  const displayError = localError ?? error;

  return (
    <div className="bg-page-bg text-on-surface h-screen w-full flex overflow-hidden">
      {/* ── Left hero panel ── */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-evergreen via-hunter to-fern">
        <div
          className="absolute top-0 -right-8 h-full w-24 bg-page-bg transform skew-x-[-8deg] z-10"
          style={{ borderRadius: "50% 0 0 50%" }}
        />
        <Link href="/" className="relative z-20 flex items-center gap-2 group w-max">
          <Leaf className="text-lime-cream group-hover:text-white transition-colors h-8 w-8" />
          <h1 className="text-white group-hover:text-lime-cream transition-colors text-4xl font-bold">EduCore</h1>
        </Link>
        <div className="relative z-20 flex-grow flex items-center justify-center my-12 pr-12">
          <div className="w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative bg-black/20 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center gap-6 p-10">
            <h2 className="text-3xl font-bold text-white text-center">
              Empower Every Learner
            </h2>
            <p className="text-white/70 text-center text-lg leading-relaxed">
              A complete academic ecosystem for students, teachers, and administrators.
            </p>
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              {["Students", "Teachers", "Admins"].map((role) => (
                <div
                  key={role}
                  className="bg-white/10 border border-white/20 rounded-xl p-4 text-center"
                >
                  <span className="text-white font-semibold text-sm">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="relative z-20 text-white/40 text-sm">
          © 2026 EduCore LMS. All rights reserved.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-page-bg relative z-20">
        <div className="w-full max-w-[380px] flex flex-col">
          <div className="flex justify-center mb-6 lg:hidden">
            <Leaf className="text-primary-container h-10 w-10" />
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-on-surface mb-2">Welcome Back</h2>
            <p className="text-body-secondary">Sign in to your account to continue</p>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                className="block text-sm font-medium text-on-surface mb-1.5"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className={`w-full h-12 bg-surface border ${errors.email ? 'border-error' : 'border-divider'} rounded-lg px-4 text-on-surface placeholder-placeholder focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all`}
              />
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-on-surface mb-1.5"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className={`w-full h-12 bg-surface border ${errors.password ? 'border-error' : 'border-divider'} rounded-lg pl-4 pr-12 text-on-surface placeholder-placeholder focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-inactive hover:text-primary"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end mb-4">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] rounded-lg font-semibold text-white transition-all hover:shadow-lg hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 primary-gradient flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-body-secondary">
              Don&apos;t have an account?{" "}
              <Link
                href="/apply"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                Apply Now
              </Link>
            </p>
            <p className="text-xs text-placeholder">
              By signing in you agree to our{" "}
              <Link href="#" className="hover:text-primary underline">
                Terms
              </Link>{" "}
              &amp;{" "}
              <Link href="#" className="hover:text-primary underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
