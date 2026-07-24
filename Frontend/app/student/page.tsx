"use client";

import { useState, useEffect } from 'react';
import { BookOpen, Award, FileText, Clock, PlayCircle, FileUp, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { enrollmentsApi, feesApi } from '@/lib/api';

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [enrollmentsData, feesData] = await Promise.all([
          enrollmentsApi.list(),
          feesApi.list()
        ]);
        setEnrollments(enrollmentsData);
        setFees(feesData);
      } catch (error) {
        console.error('Failed to load student data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeEnrollments = enrollments.filter(e => e.status === 'ENROLLED');
  const outstandingFees = fees.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE').length;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-3xl font-bold text-heading-on-light">My Dashboard</h2>
        <span className="text-sm text-body-secondary">Thursday, Oct 12, 2026</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Current GPA', val: '3.8', sub: 'Cumulative', icon: Award, color: 'text-warning', bg: 'bg-warning-bg' },
          { title: 'Enrolled Courses', val: loading ? '...' : activeEnrollments.length, sub: 'Current Semester', icon: BookOpen, color: 'text-primary-container', bg: 'bg-surface-container-low' },
          { title: 'Outstanding Fees', val: loading ? '...' : outstandingFees, sub: 'Pending Invoices', icon: CheckCircle, color: 'text-success', bg: 'bg-success-bg' },
          { title: 'Assignments Due', val: '2', sub: 'Next 7 days', icon: FileText, color: 'text-error', bg: 'bg-error-bg' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-divider brand-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 card-accent-top"></div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-body-secondary mb-1 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl font-bold mb-2 text-heading-on-light">{stat.val}</h3>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
            <div className="p-5 border-b border-divider flex justify-between items-center bg-surface">
              <h3 className="text-lg font-semibold text-heading-on-light">My Courses</h3>
              <Link href="/student/courses" className="text-sm font-semibold text-primary hover:underline">View All</Link>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="border border-border-light rounded-lg p-4 h-32 animate-pulse bg-surface-container-lowest"></div>
                ))
              ) : activeEnrollments.length > 0 ? (
                activeEnrollments.map((enrollment, i) => {
                  const colors = ['bg-info', 'bg-primary', 'bg-warning', 'bg-success'];
                  const color = colors[i % colors.length];
                  return (
                    <Link href={`/student/courses/${enrollment.course?.id}`} key={enrollment.id || i} className="block border border-border-light rounded-lg p-4 hover:border-primary-fixed transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-primary-container bg-primary-container/10 px-2 py-0.5 rounded uppercase tracking-wider">{enrollment.course?.code || 'CODE'}</span>
                        <PlayCircle className="w-5 h-5 text-icon-inactive group-hover:text-primary transition-colors" />
                      </div>
                      <h4 className="font-bold text-on-surface mb-1 truncate">{enrollment.course?.title || 'Untitled Course'}</h4>
                      <p className="text-xs text-body-secondary mb-4">{enrollment.course?.department || 'Department'}</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-body-secondary">
                          <span>Course Progress</span>
                          <span className="font-medium text-on-surface">50%</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `50%` }}></div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-8 text-body-secondary">No active courses found.</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
            <div className="p-5 border-b border-divider flex justify-between items-center bg-surface">
              <h3 className="text-lg font-semibold text-heading-on-light">Upcoming Deadlines</h3>
            </div>
            <div className="divide-y divide-border-light">
              {[
                { title: 'Midterm Project Code', course: 'CS-101', date: 'Tomorrow, 11:59 PM', type: 'assignment' },
                { title: 'Chapter 4 Quiz', course: 'MGT-201', date: 'Friday, 10:00 AM', type: 'quiz' },
                { title: 'Research Draft 1', course: 'ENG-102', date: 'Next Mon, 11:59 PM', type: 'assignment' },
              ].map((item, i) => (
                <div key={i} className="p-4 flex gap-3 hover:bg-surface-container-low transition-colors">
                  <div className="w-10 h-10 rounded bg-error-bg flex items-center justify-center text-error flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-on-surface">{item.title}</h4>
                    <p className="text-xs text-primary font-medium my-0.5">{item.course}</p>
                    <p className="text-xs text-body-secondary flex items-center gap-1">
                      Due: {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-divider bg-surface-container-lowest text-center">
              <Link href="#" className="text-sm font-semibold text-primary flex items-center justify-center gap-1 group">
                View Calendar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
