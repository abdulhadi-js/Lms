"use client";

import { AlertTriangle, Users, BookOpen, Clock, Banknote, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { reportsApi, enrollmentsApi } from '@/lib/api';
import { AdminBentoStats } from '@/components/AdminBentoStats';
import { RequireAccess } from '@/components/RequireAccess';

export default function AdminDashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [atRisk, setAtRisk] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewData, atRiskData, appsData] = await Promise.all([
          reportsApi.overview().catch(() => ({ totalStudents: 0, activeCourses: 0, pendingApplications: 0, totalFeesCollected: 0 })),
          reportsApi.atRisk().catch(() => []),
          enrollmentsApi.getApplications('PENDING_REVIEW').catch(() => [])
        ]);
        setOverview(overviewData);
        setAtRisk(Array.isArray(atRiskData) ? atRiskData : []);
        setApplications(Array.isArray(appsData) ? appsData.slice(0, 5) : []);
      } catch (error: any) {
        setFetchError(error?.message || 'Failed to load dashboard data.');
        toast.error('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setReviewingId(id);
    try {
      await enrollmentsApi.reviewApplication(id, status);
      setApplications(prev => prev.filter(app => app.id !== id));
      if (overview) {
        setOverview({ ...overview, pendingApplications: Math.max(0, (overview.pendingApplications || 0) - 1) });
      }
      toast.success(status === 'APPROVED' ? 'Application approved!' : 'Application rejected.');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to review application.');
    } finally {
      setReviewingId(null);
    }
  };

  const stats = [
    { title: 'Total Students',       val: loading ? '...' : overview?.totalStudents ?? 0,                            sub: 'Active enrollments',  icon: Users,    color: 'text-primary-container', bg: 'bg-surface-container-low' },
    // B3 FIX: was overview?.totalCourses — now matches what the API actually returns (activeCourses)
    { title: 'Active Courses',        val: loading ? '...' : overview?.activeCourses ?? overview?.totalCourses ?? 0,  sub: 'Current semester',    icon: BookOpen, color: 'text-primary-container', bg: 'bg-surface-container-low' },
    { title: 'Pending Applications',  val: loading ? '...' : overview?.pendingApplications ?? 0,                      sub: 'Needs review',        icon: Clock,    color: 'text-warning',           bg: 'bg-warning-bg' },
    { title: 'Fees Collected',        val: loading ? '...' : `$${(overview?.totalFeesCollected || 0).toLocaleString()}`, sub: 'Total received',   icon: Banknote, color: 'text-success',           bg: 'bg-success-bg' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex justify-between items-end mb-2 flex-wrap gap-2">
        <h2 className="text-3xl font-bold text-heading-on-light">Dashboard</h2>
        <span className="text-sm text-body-secondary">{currentDate}</span>
      </div>

      {/* B5 FIX: Show error state */}
      {fetchError && !loading && (
        <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{fetchError}</span>
        </div>
      )}

      {/* B1 FIX: "Review now" now links to /admin/reports instead of href="#" */}
      {loading ? (
        <div className="animate-pulse bg-warning-bg border-l-4 border-warning p-4 rounded-r-lg h-16 mb-6" />
      ) : atRisk.length > 0 ? (
        <div className="bg-warning-bg border-l-4 border-warning p-4 rounded-r-lg flex items-start shadow-sm mb-6">
          <AlertTriangle className="h-5 w-5 text-warning mr-3 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-on-surface">
              <span className="font-semibold">{atRisk.length} students are at-risk</span> due to low attendance or failing grades.{' '}
              <Link href="/admin/reports" className="text-primary font-semibold hover:underline">
                Review now &rarr;
              </Link>
            </p>
          </div>
        </div>
      ) : null}

      {/* Animated Bento Stats Grid — Sprint 2 */}
      <AdminBentoStats className="mb-2" />

      {/* Stat Cards (kept for quick at-a-glance detail) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface rounded-xl border border-divider brand-shadow relative overflow-hidden group transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute top-0 left-0 w-full h-1 card-accent-top" />
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-body-secondary mb-1 uppercase tracking-wider">{stat.title}</p>
                  <h3 className={`text-2xl font-bold mb-2 ${stat.title === 'Pending Applications' && (overview?.pendingApplications || 0) > 0 ? 'text-warning' : 'text-heading-on-light'}`}>
                    {loading ? <span className="inline-block w-12 h-7 bg-surface-container rounded animate-pulse" /> : stat.val}
                  </h3>
                  <p className="text-xs text-body-secondary">{stat.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Pending Applications Table */}
        <RequireAccess module="USERS_STUDENTS" action="canView" fallback={<div className="lg:col-span-7 bg-surface rounded-xl border border-divider p-8 text-center text-body-secondary flex items-center justify-center">You do not have permission to view pending enrollments.</div>}>
          <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
            <div className="p-4 border-b border-divider flex justify-between items-center bg-surface">
              <h3 className="text-lg font-semibold text-heading-on-light">Pending Enrollments</h3>
              {/* B2 FIX: "View All" is now a proper Link instead of a dead button */}
              <Link href="/admin/enrollments" className="text-primary text-sm font-semibold hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary-container text-white text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium">Program</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="py-3 px-4">
                          <div className="h-8 bg-surface-container rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-body-secondary">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success opacity-50" />
                        <p>No pending applications</p>
                      </td>
                    </tr>
                  ) : (
                    applications.map((row, i) => (
                      <tr key={row.id || i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                        <td className="py-3 px-4 flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {row.firstName?.[0] || 'U'}{row.lastName?.[0] || ''}
                          </div>
                          <span className="font-medium text-on-surface">{row.firstName} {row.lastName}</span>
                        </td>
                        <td className="py-3 px-4 text-body-secondary truncate max-w-[140px]">{row.desiredCourse || 'Unknown Course'}</td>
                        <td className="py-3 px-4 text-body-secondary whitespace-nowrap">
                          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-bg text-warning border border-warning/20">
                            {row.status?.replace('_', ' ')}
                          </span>
                        </td>
                        {/* B4 FIX: toast feedback on approve/reject */}
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleReview(row.id, 'APPROVED')}
                            disabled={reviewingId === row.id}
                            title="Approve"
                            className="text-success hover:bg-success-bg p-1.5 rounded transition-colors disabled:opacity-40"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReview(row.id, 'REJECTED')}
                            disabled={reviewingId === row.id}
                            title="Reject"
                            className="text-error hover:bg-error-bg p-1.5 rounded transition-colors disabled:opacity-40"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </RequireAccess>

        {/* Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface rounded-xl border border-divider brand-shadow p-5">
            <h3 className="text-lg font-semibold text-heading-on-light mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <RequireAccess module="USERS_STUDENTS" action="canView">
                <Link href="/admin/enrollments" className="flex flex-col items-center justify-center py-4 px-2 primary-gradient text-white rounded-lg hover:shadow-md transition-shadow">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-xs font-semibold">Enrollments</span>
                </Link>
              </RequireAccess>
              <RequireAccess module="ACADEMICS" action="canView">
                <Link href="/admin/academics" className="flex flex-col items-center justify-center py-4 px-2 bg-primary-container text-white rounded-lg hover:opacity-90 transition-all">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span className="text-xs font-semibold">Academics</span>
                </Link>
              </RequireAccess>
              <RequireAccess module="USERS_STAFF" action="canView">
                <Link href="/admin/users" className="flex flex-col items-center justify-center py-4 px-2 bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-all text-on-surface">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-xs font-semibold">Staff HR</span>
                </Link>
              </RequireAccess>
              <RequireAccess module="REPORTS" action="canView">
                <Link href="/admin/reports" className="flex flex-col items-center justify-center py-4 px-2 bg-success-bg rounded-lg hover:opacity-90 transition-all text-success">
                  <Banknote className="h-6 w-6 mb-2" />
                  <span className="text-xs font-semibold">Reports</span>
                </Link>
              </RequireAccess>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
