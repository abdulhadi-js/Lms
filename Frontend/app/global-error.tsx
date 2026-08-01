"use client";

import { AlertOctagon, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
          <div className="w-full max-w-md bg-white border border-divider shadow-lg rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-bold text-heading-on-light mb-2">
              Critical System Error
            </h1>
            
            <p className="text-body-secondary mb-8">
              A fatal error occurred that caused the application to crash. Our team has been notified.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Try to recover
              </button>
              
              <Link 
                href="/"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-low text-on-surface rounded-xl font-medium border border-divider hover:bg-surface-container transition-colors"
              >
                <Home className="w-4 h-4" />
                Return to Homepage
              </Link>
            </div>
            
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 text-left">
                <p className="text-xs font-semibold text-error uppercase tracking-wider mb-2">Error Details (Dev Only)</p>
                <div className="bg-error/5 border border-error/20 rounded-lg p-3 overflow-x-auto">
                  <pre className="text-xs text-error font-mono">{error.message}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
