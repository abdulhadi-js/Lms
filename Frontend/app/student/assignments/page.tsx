"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { assignmentsApi } from '@/lib/api';

interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
}

export default function MyAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        // Note: Currently fetches all assignments globally since there is no course filter attached
        const data = await assignmentsApi.list();
        setAssignments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 w-full">
        <div className="mb-8 h-10 w-64 bg-surface-container-high rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface rounded-xl border border-divider p-5 h-64 animate-pulse flex flex-col">
              <div className="h-6 bg-surface-container-high rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-surface-container-high rounded w-full mb-2"></div>
              <div className="h-4 bg-surface-container-high rounded w-2/3 mb-auto"></div>
              <div className="h-10 bg-surface-container-high rounded w-full mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-error">Error: {error}</div>;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 w-full">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-evergreen mb-4">My Assignments</h1>
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-1.5 rounded-full bg-primary-container text-white text-[12px] font-medium transition-colors border border-primary-container">
              All
            </button>
            <button className="px-4 py-1.5 rounded-full bg-surface text-body-secondary text-[12px] font-medium hover:bg-surface-container-low transition-colors border border-border-light">
              Pending
            </button>
            <button className="px-4 py-1.5 rounded-full bg-surface text-body-secondary text-[12px] font-medium hover:bg-surface-container-low transition-colors border border-border-light">
              Submitted
            </button>
            <button className="px-4 py-1.5 rounded-full bg-surface text-body-secondary text-[12px] font-medium hover:bg-surface-container-low transition-colors border border-border-light">
              Graded
            </button>
          </div>
        </div>
        {/* Optional Actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-divider rounded-lg text-primary hover:bg-surface-container-low transition-colors text-[12px] font-medium">
            <span className="material-symbols-outlined text-[18px]">sort</span>
            Sort by Due Date
          </button>
        </div>
      </div>

      {/* Assignments List (Bento-inspired Grid layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assignments.length > 0 ? (
          assignments.map((assignment) => {
            const dueDate = new Date(assignment.dueDate);
            const isPastDue = new Date() > dueDate;
            
            return (
              <article key={assignment.id} className={`bg-surface rounded-xl shadow-[0_4px_12px_rgba(19,42,19,0.08)] border border-divider border-l-[5px] p-5 flex flex-col h-full hover:-translate-y-1 transition-transform duration-200 ${isPastDue ? 'border-l-error' : 'border-l-warning'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold tracking-wider text-body-secondary uppercase">COURSE</span>
                    <h2 className="text-[20px] font-semibold text-heading-on-light">{assignment.title}</h2>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${isPastDue ? 'bg-error-bg text-error' : 'bg-warning-bg text-[#8a6521]'}`}>
                    {isPastDue ? 'Overdue' : 'Pending'}
                  </span>
                </div>
                <p className="text-[14px] text-body-secondary line-clamp-2 mb-4 flex-grow">
                  {assignment.description || "No description provided."}
                </p>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[18px] ${isPastDue ? 'text-error' : 'text-warning'}`}>
                      {isPastDue ? 'error' : 'schedule'}
                    </span>
                    <span className={`text-[12px] font-semibold ${isPastDue ? 'text-error' : 'text-warning'}`}>
                      {isPastDue ? 'Past Due' : 'Due ' + dueDate.toLocaleDateString()}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-primary hover:text-success transition-colors text-[12px] font-semibold underline underline-offset-2">
                    <span className="material-symbols-outlined text-[16px]">description</span>
                    View Details
                  </button>
                </div>
                <div className="mt-auto">
                  <Link href={`/student/assignments/${assignment.id}`} className="w-full bg-gradient-to-br from-[#1a3f17] to-[#31572c] text-white font-semibold text-[16px] py-2.5 rounded-lg hover:shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary flex justify-center items-center gap-2">
                    Submit Assignment
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                  </Link>
                </div>
              </article>
            );
          })
        ) : (
          <div className="col-span-1 lg:col-span-2 text-center py-12 bg-surface rounded-xl border border-divider">
            <span className="material-symbols-outlined text-4xl text-icon-inactive mb-2">task</span>
            <p className="text-on-surface font-medium">No assignments found</p>
            <p className="text-body-secondary text-sm">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
