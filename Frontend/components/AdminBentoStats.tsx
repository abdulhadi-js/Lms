"use client";

import { useEffect, useState, useRef } from 'react';
import { reportsApi } from '@/lib/api';

interface StatProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ label, value, prefix = '', suffix = '', duration = 1200 }: StatProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === 0) {
      setTimeout(() => setDisplay(0), 0);
      return;
    }
    startRef.current = null;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-body-secondary mb-1">{label}</p>
      <p className="text-4xl font-extrabold text-heading-on-light tabular-nums">
        {prefix}{display.toLocaleString()}{suffix}
      </p>
    </div>
  );
}

interface BentoStatsProps {
  className?: string;
}

export function AdminBentoStats({ className = '' }: BentoStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsApi.overview()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-surface rounded-xl border border-divider p-5 animate-pulse">
            <div className="h-3 w-24 bg-surface-container rounded mb-4" />
            <div className="h-10 w-16 bg-surface-container rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards: {
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
    gradient: string;
    accent: string;
    textColor: string;
    icon: React.ReactNode;
    sparkline: number[];
  }[] = [
    {
      label: 'Total Students',
      value: stats?.totalStudents ?? 0,
      gradient: 'from-primary/10 to-transparent',
      accent: 'bg-primary',
      textColor: 'text-primary',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.63 48.63 0 0 1 12 20.904a48.63 48.63 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      ),
      sparkline: [20, 45, 38, 60, 72, 68, 85, 90, 95, 100],
    },
    {
      label: 'Active Courses',
      value: stats?.activeCourses ?? stats?.totalCourses ?? 0,
      gradient: 'from-info/10 to-transparent',
      accent: 'bg-info',
      textColor: 'text-info',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      sparkline: [10, 15, 18, 22, 25, 30, 28, 35, 40, 42],
    },
    {
      label: 'Pending Applications',
      value: stats?.pendingApplications ?? 0,
      gradient: 'from-warning/10 to-transparent',
      accent: 'bg-warning',
      textColor: 'text-warning',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      sparkline: [5, 8, 12, 10, 15, 9, 7, 11, 8, 6],
    },
    {
      label: 'Fees Collected',
      value: Math.round(stats?.totalFeesCollected ?? 0),
      prefix: '$',
      gradient: 'from-success/10 to-transparent',
      accent: 'bg-success',
      textColor: 'text-success',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
      ),
      sparkline: [100, 250, 180, 320, 400, 380, 500, 600, 750, 820],
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ${className}`}>
      {cards.map((card, i) => {
        const max = Math.max(...card.sparkline);
        const h = 32; // SVG height in px
        const w = 80;
        const points = card.sparkline.map((v, idx) =>
          `${(idx / (card.sparkline.length - 1)) * w},${h - (v / max) * h}`
        ).join(' ');

        return (
          <div
            key={i}
            className={`relative overflow-hidden bg-surface rounded-xl border border-divider p-4 brand-shadow group hover:shadow-md transition-shadow`}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} pointer-events-none`} />
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] ${card.accent}`} />

            <div className="relative p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.gradient} border border-divider ${card.textColor}`}>
                  {card.icon}
                </div>
                {/* Mini sparkline */}
                <svg width={w} height={h} className="opacity-40 group-hover:opacity-70 transition-opacity">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    className={card.textColor}
                  />
                </svg>
              </div>
              <AnimatedCounter
                label={card.label}
                value={card.value}
                prefix={card.prefix}
                suffix={card.suffix}
                duration={1000 + i * 200}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
