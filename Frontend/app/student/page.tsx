"use client";

import { BookOpen, Award, FileText, Clock, PlayCircle, CheckCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { enrollmentsApi, feesApi, assignmentsApi, marksApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useQuery } from '@tanstack/react-query';

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: enrollments = [], isLoading: isLoadingEnrollments, error: enrollmentsError } = useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const data = await enrollmentsApi.list();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user,
  });

  const { data: fees = [], isLoading: isLoadingFees } = useQuery({
    queryKey: ['fees'],
    queryFn: async () => {
      const data = await feesApi.list();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user,
  });

  const { data: assignments = [], isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const data = await assignmentsApi.list();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user,
  });

  const { data: transcript = { marks: [], cumulativeGPA: 0 }, isLoading: isLoadingMarks } = useQuery({
    queryKey: ['transcript', user?.id],
    queryFn: async () => {
      try {
        return await marksApi.getTranscript(user!.id);
      } catch (err) {
        return { marks: [], cumulativeGPA: 0 };
      }
    },
    enabled: !!user?.id,
  });

  const marks = Array.isArray(transcript.marks) ? transcript.marks : [];
  const loading = isLoadingEnrollments || isLoadingFees || isLoadingAssignments || isLoadingMarks;
  const error = enrollmentsError ? 'Failed to load some dashboard data.' : null;

  const activeEnrollments = enrollments.filter((e: any) => e.status === 'ACTIVE');
  const outstandingFees = fees.filter((f: any) => f.status === 'PENDING' || f.status === 'OVERDUE').length;

  // Compute CGPA from marks is now partly handled by backend, but we'll use transcript.cumulativeGPA if available
  const cgpa = transcript.cumulativeGPA > 0 ? transcript.cumulativeGPA.toFixed(2) : '0.00';

  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const allScheduleSlots: Array<{courseCode: string, courseTitle: string, room: string, day: string, time: string}> = [];
  // For now, students don't have schedule attached directly to enrollments.
  // We'd need to fetch timetable or map section/class. Leaving this empty or mocked for now.
  activeEnrollments.forEach((enrollment: any) => {
    // If schedule existed on section:
    if (enrollment.section?.schedule && Array.isArray(enrollment.section.schedule)) {
      enrollment.section.schedule.forEach((slot: any) => {
        allScheduleSlots.push({
          courseCode: enrollment.section.name,
          courseTitle: enrollment.section.academicClass?.name,
          room: slot.room || 'TBA',
          day: slot.dayOfWeek || slot.day,
          time: slot.startTime || slot.time
        });
      });
    }
  });

  const todayClasses = allScheduleSlots
    .filter(s => s.day === currentDayName)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Upcoming assignment deadlines (due in the next 7 days)
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingAssignments = assignments
    .filter(a => {
      if (!a.dueDate) return false;
      const due = new Date(a.dueDate);
      return due >= now && due <= sevenDaysLater;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Current GPA',
      val: loading ? '...' : cgpa ?? '—',
      sub: cgpa ? 'Cumulative GPA' : 'No grades yet',
      icon: Award,
      color: 'text-warning',
      bg: 'bg-warning-bg',
      href: '/student/transcript',
    },
    {
      title: 'Enrolled Courses',
      val: loading ? '...' : activeEnrollments.length,
      sub: 'Current Semester',
      icon: BookOpen,
      color: 'text-primary-container',
      bg: 'bg-surface-container-low',
      href: '/student/courses',
    },
    {
      title: 'Outstanding Fees',
      val: loading ? '...' : outstandingFees,
      sub: outstandingFees > 0 ? 'Requires attention' : 'All cleared',
      icon: CheckCircle,
      color: outstandingFees > 0 ? 'text-error' : 'text-success',
      bg: outstandingFees > 0 ? 'bg-error-bg' : 'bg-success-bg',
      href: '/student/fees',
    },
    {
      title: 'Assignments Due',
      val: loading ? '...' : upcomingAssignments.length,
      sub: 'Next 7 days',
      icon: FileText,
      color: upcomingAssignments.length > 0 ? 'text-error' : 'text-success',
      bg: upcomingAssignments.length > 0 ? 'bg-error-bg' : 'bg-success-bg',
      href: '/student/assignments',
    },
  ];

  if (error && !loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-error">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex justify-between items-end mb-2 flex-wrap gap-2">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">My Dashboard</h2>
          <p className="text-sm text-body-secondary mt-1">
            Welcome back, <span className="font-semibold text-primary">{user?.firstName}!</span>
          </p>
        </div>
        <span className="text-sm text-body-secondary">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Link href={stat.href} key={i} className="bg-surface rounded-xl border border-divider shadow-sm relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 cursor-pointer block">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container" />
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-body-secondary mb-1 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl font-bold mb-2 text-heading-on-light">
                    {loading ? <span className="inline-block w-10 h-7 bg-surface-container rounded animate-pulse" /> : stat.val}
                  </h3>
                  <p className="text-xs text-body-secondary">{stat.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Courses */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
            <div className="p-5 border-b border-divider flex justify-between items-center bg-surface">
              <h3 className="text-lg font-semibold text-heading-on-light">My Courses</h3>
              <Link href="/student/courses" className="text-sm font-semibold text-primary hover:underline">View All</Link>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="border border-divider rounded-lg p-4 h-32 animate-pulse bg-surface-container" />
                ))
              ) : activeEnrollments.length > 0 ? (
                activeEnrollments.map((enrollment, i) => {
                  const colors = ['bg-blue-500', 'bg-primary', 'bg-amber-500', 'bg-success'];
                  const color = colors[i % colors.length];
                  return (
                    <Link href={`/student/courses/${enrollment.section?.id}`} key={enrollment.id || i}
                      className="block border border-divider rounded-lg p-4 hover:border-primary transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                          {enrollment.section?.name || 'SEC'}
                        </span>
                        <PlayCircle className="w-5 h-5 text-body-secondary group-hover:text-primary transition-colors" />
                      </div>
                      <h4 className="font-bold text-on-surface mb-1 truncate">{enrollment.section?.academicClass?.name || 'Untitled Class'}</h4>
                      <p className="text-xs text-body-secondary mb-4">{enrollment.section?.capacity || 30} Students</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-body-secondary">
                          <span>Progress</span>
                          <span className="font-medium text-on-surface">Enrolled</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: '30%' }} />
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-12 text-body-secondary">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No active courses found.</p>
                  <p className="text-xs mt-1">Contact admin to get enrolled in courses.</p>
                </div>
              )}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
            <div className="p-5 border-b border-divider flex justify-between items-center bg-surface">
              <h3 className="text-lg font-semibold text-heading-on-light">Today's Classes ({currentDayName})</h3>
            </div>
            <div className="p-5">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-16 border border-divider rounded-lg animate-pulse bg-surface-container" />
                  <div className="h-16 border border-divider rounded-lg animate-pulse bg-surface-container" />
                </div>
              ) : todayClasses.length > 0 ? (
                <div className="space-y-3">
                  {todayClasses.map((cls, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-lg border border-divider hover:border-primary/50 transition-colors group">
                      <div className="w-16 h-16 shrink-0 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center font-bold text-sm">
                        <span>{cls.time.split('-')[0].trim()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-on-surface truncate">{cls.courseTitle}</h4>
                        <div className="flex items-center text-xs text-body-secondary mt-1 gap-3">
                          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {cls.courseCode}</span>
                          {cls.room && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Room {cls.room}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-body-secondary">
                  <CheckCircle className="w-10 h-10 mx-auto mb-3 text-success opacity-50" />
                  <p className="font-medium">No classes scheduled for today.</p>
                  <p className="text-xs mt-1">Enjoy your free time!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
            <div className="p-5 border-b border-divider flex justify-between items-center bg-surface">
              <h3 className="text-lg font-semibold text-heading-on-light">Upcoming Deadlines</h3>
              <span className="text-xs text-body-secondary bg-surface-container px-2 py-1 rounded-full">
                {upcomingAssignments.length} due soon
              </span>
            </div>

            {loading ? (
              <div className="divide-y divide-divider">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-4 flex gap-3">
                    <div className="w-10 h-10 rounded bg-surface-container animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-container rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-surface-container rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingAssignments.length > 0 ? (
              <div className="divide-y divide-divider">
                {upcomingAssignments.map((item, i) => {
                  const dueDate = new Date(item.dueDate);
                  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const isUrgent = diffDays <= 1;
                  return (
                    <div key={i} className="p-4 flex gap-3 hover:bg-surface-container transition-colors">
                      <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${isUrgent ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}`}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-on-surface truncate">{item.title}</h4>
                        <p className="text-xs text-primary font-medium my-0.5">{item.subject?.name || item.section?.name || 'Assignment'}</p>
                        <p className={`text-xs flex items-center gap-1 ${isUrgent ? 'text-error font-semibold' : 'text-body-secondary'}`}>
                          Due: {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-body-secondary">
                <CheckCircle className="w-10 h-10 mx-auto mb-3 text-success opacity-50" />
                <p className="font-medium text-sm">No deadlines in the next 7 days!</p>
              </div>
            )}

            <div className="p-3 border-t border-divider bg-surface-container-lowest text-center">
              <Link href="/student/assignments" className="text-sm font-semibold text-primary flex items-center justify-center gap-1 group">
                View All Assignments <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
