"use client";

import { AlertTriangle, Users, BookOpen, Clock, Banknote, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { reportsApi, enrollmentsApi } from '@/lib/api';

export default function AdminDashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [atRisk, setAtRisk] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewData, atRiskData, appsData] = await Promise.all([
          reportsApi.overview().catch(() => ({ totalStudents: 0, activeCourses: 0, pendingApplications: 0, feesCollected: 0 })),
          reportsApi.atRisk().catch(() => []),
          enrollmentsApi.getApplications('PENDING_REVIEW').catch(() => [])
        ]);
        setOverview(overviewData);
        setAtRisk(atRiskData);
        setApplications(Array.isArray(appsData) ? appsData.slice(0, 5) : []);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-3xl font-bold text-heading-on-light">Dashboard</h2>
        <span className="text-sm text-body-secondary">{currentDate}</span>
      </div>

      {loading ? (
        <div className="animate-pulse bg-warning-bg border-l-4 border-warning p-4 rounded-r-lg h-16 mb-6"></div>
      ) : atRisk && atRisk.length > 0 ? (
        <div className="bg-warning-bg border-l-4 border-warning p-4 rounded-r-lg flex items-start shadow-sm mb-6">
          <AlertTriangle className="h-5 w-5 text-warning mr-3 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-on-surface">
              <span className="font-semibold">{atRisk.length} students are at-risk</span> due to low attendance or failing grades.
              <Link href="#" className="text-primary font-semibold hover:underline ml-1">Review now &rarr;</Link>
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Students', val: loading ? '...' : overview?.totalStudents || '0', sub: 'Active enrollments', icon: Users, color: 'text-primary-container', bg: 'bg-surface-container-low' },
          { title: 'Active Courses', val: loading ? '...' : overview?.activeCourses || '0', sub: 'Current semester', icon: BookOpen, color: 'text-primary-container', bg: 'bg-surface-container-low' },
          { title: 'Pending Applications', val: loading ? '...' : overview?.pendingApplications || '0', sub: 'Needs review', icon: Clock, color: 'text-warning', bg: 'bg-warning-bg' },
          { title: 'Fees Collected (Jul)', val: loading ? '...' : `PKR ${(overview?.feesCollected || 0).toLocaleString()}`, sub: 'Total received', icon: Banknote, color: 'text-success', bg: 'bg-success-bg' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-divider brand-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 card-accent-top"></div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-body-secondary mb-1 uppercase tracking-wider">{stat.title}</p>
                  <h3 className={`text-2xl font-bold mb-2 ${stat.title === 'Pending Applications' ? 'text-warning' : 'text-heading-on-light'}`}>{stat.val}</h3>
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
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
            <div className="p-4 border-b border-divider flex justify-between items-center bg-surface">
              <h3 className="text-lg font-semibold text-heading-on-light">Pending Enrollments</h3>
              <button className="text-primary text-sm font-semibold hover:underline">View All</button>
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
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-body-secondary">Loading...</td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-body-secondary">No pending applications</td>
                    </tr>
                  ) : (
                    applications.map((row, i) => (
                      <tr key={i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                        <td className="py-3 px-4 flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold text-body-secondary">
                            {row.student?.user?.firstName?.[0] || 'U'}{row.student?.user?.lastName?.[0] || 'U'}
                          </div>
                          <span className="font-medium text-on-surface">
                            {row.student?.user?.firstName} {row.student?.user?.lastName}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-body-secondary">{row.course?.title || 'Unknown Course'}</td>
                        <td className="py-3 px-4 text-body-secondary">{new Date(row.enrollmentDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-bg text-warning border border-warning/20">
                            {row.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button className="text-success hover:bg-success-bg p-1 rounded transition-colors"><CheckCircle className="h-5 w-5" /></button>
                          <button className="text-error hover:bg-error-bg p-1 rounded transition-colors"><XCircle className="h-5 w-5" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-divider brand-shadow p-5">
            <h3 className="text-lg font-semibold text-heading-on-light mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center py-4 px-2 primary-gradient text-white rounded-lg hover:shadow-md transition-shadow">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-xs font-semibold">Enroll Student</span>
              </button>
              <button className="flex flex-col items-center justify-center py-4 px-2 bg-primary-container text-white rounded-lg hover:opacity-90 transition-all">
                <BookOpen className="h-6 w-6 mb-2" />
                <span className="text-xs font-semibold">Create Course</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
