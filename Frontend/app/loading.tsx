"use client";

import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8 bg-page-bg">
      <div className="flex flex-col items-center gap-4 text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
