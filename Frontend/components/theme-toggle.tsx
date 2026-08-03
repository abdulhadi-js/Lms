"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) {
    return <div className={`w-8 h-8 rounded-full bg-surface-container animate-pulse ${className || ""}`} />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-surface hover:bg-surface-container transition-colors text-on-surface border border-divider shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${className || ""}`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun className="h-5 w-5 absolute transition-all dark:scale-0 dark:opacity-0 scale-100 opacity-100" />
      <Moon className="h-5 w-5 absolute transition-all dark:scale-100 dark:opacity-100 scale-0 opacity-0" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
