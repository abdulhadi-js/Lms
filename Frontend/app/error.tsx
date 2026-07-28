"use client";

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, log to an error reporting service like Sentry
    console.error('Global Error Boundary caught an error:', error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-page-bg text-on-surface p-6 font-sans">
      <div className="max-w-md w-full bg-surface border border-error/20 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-error-bg rounded-full flex items-center justify-center mb-6 text-error">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-error mb-2">Something went wrong</h2>
        <p className="text-body-secondary mb-8">
          We encountered an unexpected error while loading this page. 
          {error.message && (
            <span className="block mt-2 text-xs font-mono bg-surface-container p-2 rounded text-left overflow-hidden text-ellipsis whitespace-nowrap" title={error.message}>
              {error.message}
            </span>
          )}
        </p>
        
        <div className="flex gap-4 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 bg-surface border border-outline/20 text-on-surface hover:bg-surface-container py-2.5 rounded-xl font-medium transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-hunter py-2.5 rounded-xl font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
