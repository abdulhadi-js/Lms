"use client";

import { useState, useEffect } from 'react';
import { enrollmentsApi, attendanceApi, authApi, AuthUser } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  code?: string;
  teacher?: { firstName: string; lastName: string };
}

interface AttendanceSummary {
  studentId: string;
  totalClasses: number;
  presentPercent: number;
  absentPercent: number;
  latePercent: number;
}

interface CourseAttendance {
  course: Course;
  summary: AttendanceSummary | null;
}

export default function MyAttendance() {
  const [data, setData] = useState<CourseAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get current user
        const currentUser = await authApi.me();
        setUser(currentUser);

        // B7 FIX: fetch only the student's enrolled courses, not all courses in the system
        const enrollments = await enrollmentsApi.list();
        const enrolledCourses: Course[] = (Array.isArray(enrollments) ? enrollments : [])
          .filter((e: any) => e.status === 'ENROLLED' && e.course)
          .map((e: any) => e.course as Course);

        // For each enrolled course, fetch attendance summary
        const attendancePromises = enrolledCourses.map(async (course) => {
          let summary: AttendanceSummary | null = null;
          try {
            const summaries = await attendanceApi.getSummary(course.id, currentUser.id);
            if (summaries && summaries.length > 0) {
              summary = summaries[0];
            }
          } catch (e) {
            console.error(`Failed to fetch summary for ${course.title}`, e);
          }
          return { course, summary };
        });

        const results = await Promise.all(attendancePromises);
        setData(results);
      } catch (err: any) {
        setError(err.message || 'Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto space-y-8 pb-12 pt-8 px-4 md:px-8 w-full animate-pulse">
        <div className="h-10 bg-surface-container-high rounded w-64 mb-8"></div>
        <div className="h-32 bg-surface-container-high rounded-xl w-full mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="h-64 bg-surface-container-high rounded-xl w-full"></div>
           <div className="h-64 bg-surface-container-high rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-error text-center mt-10 bg-error-bg rounded-lg max-w-lg mx-auto">Error: {error}</div>;
  }

  // Calculate global totals
  let totalClasses = 0;
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLate = 0;

  data.forEach((item) => {
    if (item.summary) {
      totalClasses += item.summary.totalClasses;
      totalPresent += Math.round((item.summary.presentPercent / 100) * item.summary.totalClasses);
      totalAbsent += Math.round((item.summary.absentPercent / 100) * item.summary.totalClasses);
      totalLate += Math.round((item.summary.latePercent / 100) * item.summary.totalClasses);
    }
  });

  // B6 FIX: show 0% when no classes have occurred — not 100% (misleading)
  const overallPercent = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
  
  // Calculate SVG stroke offset for gauge (339.29 is circumference of r=54)
  const strokeDashoffset = 339.29 - (339.29 * overallPercent) / 100;

  // Check if at risk (below 75% globally)
  const isGloballyAtRisk = totalClasses > 0 && overallPercent < 75;

  return (
    <div className="max-w-container-max mx-auto space-y-8 pb-12 pt-8 px-4 md:px-8 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-bold text-evergreen mb-1">My Attendance</h1>
        <p className="text-[14px] text-body-secondary">Track your attendance across all enrolled courses.</p>
      </div>

      {/* Overall Attendance Card */}
      <div className="bg-surface rounded-xl shadow-[0_4px_12px_rgba(19,42,19,0.08)] border border-divider relative overflow-hidden flex flex-col md:flex-row items-center p-6 gap-8">
        <div className={`absolute top-0 left-0 w-full h-1 ${isGloballyAtRisk ? 'bg-error' : 'bg-gradient-to-r from-[#90a955] to-[#ecf39e]'}`}></div>
        
        <div className="relative w-[120px] h-[120px] flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Track */}
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e4e4e4" strokeWidth="12"></circle>
            {/* Progress */}
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isGloballyAtRisk ? '#b3423a' : '#90a955'}></stop>
                <stop offset="100%" stopColor={isGloballyAtRisk ? '#b3423a' : '#4f772d'}></stop>
              </linearGradient>
            </defs>
            <circle 
              cx="60" cy="60" r="54" fill="none" 
              stroke="url(#gaugeGradient)" 
              strokeWidth="12" strokeLinecap="round" 
              strokeDasharray="339.29" 
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-in-out"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-[20px] font-bold leading-none ${isGloballyAtRisk ? 'text-error' : 'text-evergreen'}`}>{overallPercent}%</span>
            <span className="text-[12px] font-medium text-body-secondary mt-1">Overall</span>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4 w-full">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-success-bg px-4 py-2 rounded-full border border-success/20">
              <span className="material-symbols-outlined text-success text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-[14px] text-success font-medium">Present: {totalPresent} classes</span>
            </div>
            <div className="flex items-center gap-2 bg-error-bg px-4 py-2 rounded-full border border-error/20">
              <span className="material-symbols-outlined text-error text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
              <span className="text-[14px] text-error font-medium">Absent: {totalAbsent}</span>
            </div>
            <div className="flex items-center gap-2 bg-warning-bg px-4 py-2 rounded-full border border-warning/20">
              <span className="material-symbols-outlined text-warning text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <span className="text-[14px] text-warning font-medium">Late: {totalLate}</span>
            </div>
          </div>
          
          <div className="space-y-3 mt-2 w-full">
            {isGloballyAtRisk ? (
              <div className="bg-error-bg border-l-4 border-error p-3 rounded-r-lg flex items-start gap-3">
                <span className="material-symbols-outlined text-error mt-0.5">warning</span>
                <p className="text-[14px] text-error">⚠️ Your overall attendance is below the 75% requirement. Please contact your instructors.</p>
              </div>
            ) : (
              <div className="bg-success-bg border-l-4 border-success p-3 rounded-r-lg flex items-start gap-3">
                <span className="material-symbols-outlined text-[#375320] mt-0.5">verified</span>
                <p className="text-[14px] text-[#375320]">Your attendance is above the required 75% threshold. Keep it up! ✓</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Per-Course Attendance Cards Grid */}
      <div>
        <h2 className="text-[20px] font-semibold text-evergreen mb-4">Course Breakdown</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.length > 0 ? (
            data.map(({ course, summary }) => {
              const present = summary ? Math.round((summary.presentPercent / 100) * summary.totalClasses) : 0;
              const absent = summary ? Math.round((summary.absentPercent / 100) * summary.totalClasses) : 0;
              const late = summary ? Math.round((summary.latePercent / 100) * summary.totalClasses) : 0;
              const total = summary ? summary.totalClasses : 0;
              const percent = total > 0 ? Math.round((present / total) * 100) : 0;
              const isAtRisk = total > 0 && percent < 75;

              return (
                <div key={course.id} className={`rounded-xl shadow-[0_4px_12px_rgba(19,42,19,0.08)] border border-divider p-6 relative overflow-hidden ${isAtRisk ? 'bg-error-bg/30 border-l-4 border-l-error' : 'bg-surface border-l-4 border-l-success'}`}>
                  {!isAtRisk && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success to-lime-cream"></div>}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-[24px] font-semibold text-evergreen">{course.code ? `${course.code} — ` : ''}{course.title}</h3>
                      <p className="text-[14px] text-body-secondary mt-1">{course.teacher ? `Instructor: ${course.teacher.firstName} ${course.teacher.lastName}` : 'No Instructor Assigned'}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium border ${isAtRisk ? 'bg-error-bg text-error border-error/20' : 'bg-success-bg text-success border-success/20'}`}>
                      {isAtRisk ? 'At Risk' : 'Good Standing'}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-[14px] mb-1">
                      <span className={`${isAtRisk ? 'text-error' : 'text-evergreen'} font-semibold`}>{percent}% Attendance</span>
                      <span className="text-body-secondary">Required: 75%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden relative">
                      <div className={`h-full rounded-full ${isAtRisk ? 'bg-error' : 'bg-gradient-to-r from-success to-lime-cream'}`} style={{ width: `${percent}%` }}></div>
                      <div className={`absolute top-0 bottom-0 left-[75%] w-0.5 z-10 ${isAtRisk ? 'bg-on-background' : 'bg-error'}`}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-center text-[14px]">
                    <div className={`${isAtRisk ? 'bg-surface border border-divider/50' : 'bg-neutral-bg'} p-2 rounded-lg`}><span className="block text-success font-semibold">{present}</span><span className="text-xs text-body-secondary">Present</span></div>
                    <div className={`${isAtRisk ? 'bg-error-bg border border-error/20' : 'bg-neutral-bg'} p-2 rounded-lg`}><span className="block text-error font-semibold">{absent}</span><span className="text-xs text-body-secondary">Absent</span></div>
                    <div className={`${isAtRisk ? 'bg-surface border border-divider/50' : 'bg-neutral-bg'} p-2 rounded-lg`}><span className="block text-warning font-semibold">{late}</span><span className="text-xs text-body-secondary">Late</span></div>
                    <div className={`${isAtRisk ? 'bg-surface border border-divider/50' : 'bg-neutral-bg'} p-2 rounded-lg`}><span className="block text-evergreen font-semibold">{total}</span><span className="text-xs text-body-secondary">Total</span></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 lg:col-span-2 text-center py-12 bg-surface rounded-xl border border-divider">
              <span className="material-symbols-outlined text-4xl text-icon-inactive mb-2">event_busy</span>
              <p className="text-on-surface font-medium">No courses found</p>
              <p className="text-body-secondary text-sm">You are not enrolled in any courses yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
