"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { assignmentsApi } from '@/lib/api';
import { BookOpen, Clock, CheckCircle2, AlertTriangle, FileText, UploadCloud } from 'lucide-react';

type FilterType = 'ALL' | 'PENDING' | 'SUBMITTED' | 'GRADED';

interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  course?: { title: string; code: string };
  mySubmission?: { status: string; score?: number };
}

export default function MyAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortByDue, setSortByDue] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await assignmentsApi.list();
        setAssignments(Array.isArray(data) ? data : data?.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const getAssignmentStatus = (a: Assignment): FilterType => {
    if (a.mySubmission?.status === 'GRADED') return 'GRADED';
    if (a.mySubmission) return 'SUBMITTED';
    return 'PENDING';
  };

  const filtered = assignments
    .filter(a => filter === 'ALL' || getAssignmentStatus(a) === filter)
    .sort((a, b) => sortByDue
      ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );

  const counts = {
    ALL: assignments.length,
    PENDING: assignments.filter(a => getAssignmentStatus(a) === 'PENDING').length,
    SUBMITTED: assignments.filter(a => getAssignmentStatus(a) === 'SUBMITTED').length,
    GRADED: assignments.filter(a => getAssignmentStatus(a) === 'GRADED').length,
  };

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 w-full">
        <div className="mb-8 h-10 w-64 bg-surface-container-high rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface rounded-xl border border-divider p-5 h-52 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8">
        <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-error flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" /> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-heading-on-light">My Assignments</h1>
          <p className="text-sm text-body-secondary mt-1">Submit your written homework and class assignments.</p>
        </div>
        <button
          onClick={() => setSortByDue(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-divider rounded-lg text-primary hover:bg-surface-container-low text-sm font-medium"
        >
          <Clock className="w-4 h-4" />
          Sort: {sortByDue ? 'Earliest Due First' : 'Latest Due First'}
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'PENDING', 'SUBMITTED', 'GRADED'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              filter === f
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-body-secondary border-border-light hover:bg-surface-container-low'
            }`}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-surface-container'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((assignment) => {
            const dueDate = new Date(assignment.dueDate);
            const isPastDue = new Date() > dueDate;
            const status = getAssignmentStatus(assignment);
            const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            return (
              <article
                key={assignment.id}
                className={`bg-surface rounded-xl shadow-sm border border-divider border-l-[5px] p-5 flex flex-col hover:-translate-y-0.5 transition-all duration-200 ${
                  status === 'GRADED' ? 'border-l-success' :
                  status === 'SUBMITTED' ? 'border-l-primary' :
                  isPastDue ? 'border-l-error' : 'border-l-warning'
                }`}
              >
                {/* Subject Badge */}
                {assignment.course && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-md">
                      {assignment.course.code || assignment.course.title}
                    </span>
                    <span className="text-xs text-body-secondary">{assignment.course.title}</span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-heading-on-light flex-1 pr-2">{assignment.title}</h2>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${
                    status === 'GRADED' ? 'bg-success/10 text-success' :
                    status === 'SUBMITTED' ? 'bg-primary/10 text-primary' :
                    isPastDue ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                  }`}>
                    {status === 'GRADED' ? '✓ Graded' :
                     status === 'SUBMITTED' ? '✓ Submitted' :
                     isPastDue ? 'Overdue' : 'Pending'}
                  </span>
                </div>

                <p className="text-sm text-body-secondary line-clamp-2 mb-4 flex-grow">
                  {assignment.description || 'No description provided.'}
                </p>

                {/* Meta Row */}
                <div className="flex items-center justify-between text-xs text-body-secondary mb-4 pt-3 border-t border-divider">
                  <div className="flex items-center gap-1.5">
                    <Clock className={`w-3.5 h-3.5 ${isPastDue && status === 'PENDING' ? 'text-error' : ''}`} />
                    <span className={isPastDue && status === 'PENDING' ? 'text-error font-semibold' : ''}>
                      {isPastDue ? `Overdue by ${Math.abs(daysLeft)} day(s)` : `Due in ${daysLeft} day(s)`}
                    </span>
                    <span>• {dueDate.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Max: {assignment.maxMarks} marks
                  </div>
                </div>

                {/* Grade shown if graded */}
                {status === 'GRADED' && assignment.mySubmission?.score !== undefined && (
                  <div className="mb-3 p-2 bg-success-bg border border-success/20 rounded-lg text-xs text-success font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Score: {assignment.mySubmission.score} / {assignment.maxMarks} marks
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-auto">
                  {status === 'PENDING' ? (
                    <Link
                      href={`/student/assignments/${assignment.id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold primary-gradient text-white hover:shadow-md transition-shadow"
                    >
                      <UploadCloud className="w-4 h-4" /> Submit Assignment
                    </Link>
                  ) : (
                    <Link
                      href={`/student/assignments/${assignment.id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border border-border-light hover:bg-surface-container transition-colors text-body-secondary"
                    >
                      <BookOpen className="w-4 h-4" /> View Details
                    </Link>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-16 bg-surface rounded-xl border border-dashed border-divider">
            <FileText className="w-12 h-12 text-icon-inactive mx-auto mb-3 opacity-50" />
            <p className="font-medium text-on-surface">
              {filter === 'ALL' ? 'No assignments found' : `No ${filter.toLowerCase()} assignments`}
            </p>
            <p className="text-body-secondary text-sm mt-1">
              {filter === 'ALL' ? "You're all caught up!" : `Switch to "All" to see other assignments.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
