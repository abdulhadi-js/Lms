"use client";

import Link from "next/link";
import { Leaf, Mail, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import toast from 'react-hot-toast';
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      toast.success('Reset link sent!');
      setStep(2);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send reset link.');
      setError(err?.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

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

          <Link href="/login" className="flex items-center gap-2 text-sm text-body-secondary hover:text-primary transition-colors w-max mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>

          {step === 1 ? (
            <>
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-on-surface mb-2">Forgot Password</h2>
                <p className="text-body-secondary">Enter your email and we'll send you a reset link.</p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-12 bg-surface border border-divider rounded-lg px-4 text-on-surface placeholder-placeholder focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[52px] rounded-lg font-semibold text-white transition-all hover:shadow-lg hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 primary-gradient flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-primary-container/20 text-primary-container rounded-full flex items-center justify-center mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-3">Check your email</h2>
              <p className="text-body-secondary mb-8">
                We've sent a password reset link to <br />
                <span className="font-medium text-on-surface">{email}</span>
              </p>
              
              <p className="text-sm text-body-secondary mt-4">
                Didn't receive the email?{" "}
                <button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="text-primary hover:underline font-medium disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
