"use client";
import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Calendar, Loader2, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { examsApi, enrollmentsApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

const EXAM_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  MONTHLY_TEST:  { label: 'Monthly Test',     color: 'bg-blue-100 text-blue-700' },
  MID_TERM:      { label: 'Mid-Term Exam',    color: 'bg-amber-100 text-amber-700' },
  HALF_YEARLY:   { label: 'Half-Yearly',      color: 'bg-orange-100 text-orange-700' },
  ANNUAL:        { label: 'Annual Exam',       color: 'bg-purple-100 text-purple-700' },
  QUIZ:          { label: 'Quiz',             color: 'bg-green-100 text-green-700' },
};

export default function StudentExams() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'AVAILABLE' | 'MISSED'>('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        const enrollments = await enrollmentsApi.list();
        const enrollList = Array.isArray(enrollments) ? enrollments : enrollments?.data || [];

        let allExams: any[] = [];
        // Try fetching exams per course
        const uniqueCourseIds = [...new Set(
          enrollList
            .filter((e: any) => e.status === 'ACTIVE' && e.course?.id)
            .map((e: any) => e.course.id)
        )];

        for (const courseId of uniqueCourseIds) {
          try {
            const res = await examsApi.getExams(courseId as string);
            const list = res.data || res || [];
            allExams = [...allExams, ...list.map((ex: any) => ({ ...ex, courseId }))];
          } catch {}
        }

        // If no course-based exams, try global
        if (allExams.length === 0) {
          const globalRes = await examsApi.getExams().catch(() => []);
          allExams = globalRes.data || globalRes || [];
        }

        setExams(allExams);
      } catch (err) {
        toast.error('Failed to load exam schedule');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getExamStatus = (exam: any): 'UPCOMING' | 'AVAILABLE' | 'MISSED' => {
    const now = Date.now();
    const start = new Date(exam.startTime).getTime();
    const end = new Date(exam.endTime).getTime();
    if (now < start) return 'UPCOMING';
    if (now > end) return 'MISSED';
    return 'AVAILABLE';
  };

  const enrichedExams = exams.map(e => ({ ...e, _status: getExamStatus(e) }));
  const filtered = filter === 'ALL' ? enrichedExams : enrichedExams.filter(e => e._status === filter);

  const counts = {
    ALL: enrichedExams.length,
    UPCOMING: enrichedExams.filter(e => e._status === 'UPCOMING').length,
    AVAILABLE: enrichedExams.filter(e => e._status === 'AVAILABLE').length,
    MISSED: enrichedExams.filter(e => e._status === 'MISSED').length,
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-heading-on-light">Exam Schedule</h2>
        <p className="text-sm text-body-secondary mt-1">
          View your upcoming written examinations, monthly tests, and quizzes.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'UPCOMING', 'AVAILABLE', 'MISSED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === f
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-body-secondary border-border-light hover:bg-surface-container-low'
            }`}
          >
            {f === 'ALL' ? 'All Exams' :
             f === 'UPCOMING' ? '📅 Upcoming' :
             f === 'AVAILABLE' ? '🟢 Active Now' : '✓ Completed'}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-surface-container'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-divider rounded-xl bg-surface">
          <Calendar className="w-12 h-12 text-icon-inactive mx-auto mb-3 opacity-40" />
          <p className="font-medium text-on-surface">
            {filter === 'ALL' ? 'No exams scheduled yet' : `No ${filter.toLowerCase()} exams`}
          </p>
          <p className="text-sm text-body-secondary mt-1">Your teacher will add exam dates here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(exam => {
            const status = exam._status;
            const startDate = new Date(exam.startTime);
            const endDate = new Date(exam.endTime);
            const typeInfo = EXAM_TYPE_LABELS[exam.examType] || EXAM_TYPE_LABELS[exam.type] || { label: 'Exam', color: 'bg-surface-container text-body-secondary' };
            const daysUntil = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            return (
              <div key={exam.id} className={`bg-surface rounded-xl border border-divider brand-shadow p-5 flex flex-col border-t-4 ${
                status === 'AVAILABLE' ? 'border-t-success' :
                status === 'UPCOMING' ? 'border-t-primary' : 'border-t-divider'
              }`}>
                {/* Status + Type */}
                <div className="flex justify-between items-start mb-3 gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    status === 'UPCOMING' ? 'bg-primary/10 text-primary' :
                    status === 'AVAILABLE' ? 'bg-success/20 text-success' :
                    'bg-surface-container text-body-secondary'
                  }`}>
                    {status === 'UPCOMING' ? `In ${daysUntil}d` :
                     status === 'AVAILABLE' ? '● LIVE NOW' : 'Completed'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg text-on-surface mb-1 line-clamp-1">{exam.title}</h3>
                {exam.course?.title && (
                  <p className="text-xs text-body-secondary mb-3">{exam.course.title}</p>
                )}

                {/* Details */}
                <div className="space-y-1.5 text-sm text-body-secondary flex-grow">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-icon-inactive" />
                    <span>{startDate.toLocaleDateString('en-PK', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-icon-inactive" />
                    <span>{startDate.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })} — {endDate.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {exam.durationMinutes && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-icon-inactive" />
                      <span>Duration: {exam.durationMinutes} minutes</span>
                    </div>
                  )}
                  {exam.totalMarks && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-icon-inactive" />
                      <span>Total Marks: <strong>{exam.totalMarks}</strong></span>
                    </div>
                  )}
                  {exam.room && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-icon-inactive" />
                      <span>Hall: {exam.room}</span>
                    </div>
                  )}
                </div>

                {/* Status Footer */}
                <div className={`mt-4 pt-3 border-t border-divider text-xs font-semibold flex items-center gap-2 ${
                  status === 'AVAILABLE' ? 'text-success' :
                  status === 'UPCOMING' ? 'text-primary' : 'text-body-secondary'
                }`}>
                  {status === 'AVAILABLE' && <><CheckCircle2 className="w-4 h-4" /> Exam is currently active</>}
                  {status === 'UPCOMING' && <><AlertTriangle className="w-4 h-4" /> Prepare well — exam approaching</>}
                  {status === 'MISSED' && <>✓ Exam period has ended</>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
