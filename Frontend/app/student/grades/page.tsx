"use client";
import React, { useEffect, useState } from 'react';
import { Award, BookOpen, ChevronDown, ChevronUp, Download, Loader2, AlertCircle } from 'lucide-react';
import { marksApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface Mark {
  id: string;
  component: string;
  score: number;
  maxScore: number;
  weightPercent: number;
  notes?: string;
  course?: { id: string; title: string; code: string; credits: number };
  gradedAt?: string;
}

function getGradeLabel(percentage: number): { letter: string; color: string } {
  if (percentage >= 90) return { letter: 'A', color: 'bg-success/10 text-success' };
  if (percentage >= 80) return { letter: 'B+', color: 'bg-primary/10 text-primary' };
  if (percentage >= 75) return { letter: 'B', color: 'bg-primary/10 text-primary' };
  if (percentage >= 70) return { letter: 'C+', color: 'bg-warning/10 text-warning' };
  if (percentage >= 60) return { letter: 'C', color: 'bg-warning/10 text-warning' };
  return { letter: 'F', color: 'bg-error/10 text-error' };
}

function groupBySubject(marks: Mark[]) {
  const map: Record<string, { course: Mark['course']; marks: Mark[] }> = {};
  for (const mark of marks) {
    const key = mark.course?.id || 'unknown';
    if (!map[key]) map[key] = { course: mark.course, marks: [] };
    map[key].marks.push(mark);
  }
  return Object.values(map);
}

export default function MyGrades() {
  const { user } = useAuth();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSubjects, setOpenSubjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    const fetchMarks = async () => {
      try {
        setIsLoading(true);
        const data = await marksApi.getTranscript(user.id);
        setMarks(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to load grades.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarks();
  }, [user]);

  const grouped = groupBySubject(marks);

  // Compute overall Percentage
  let overallTotalScore = 0;
  let overallTotalMax = 0;
  for (const { course, marks: courseMarks } of grouped) {
    const totalScore = courseMarks.reduce((s, m) => s + m.score, 0);
    // Since course has max total marks in `credits`, we could use it, but typically 
    // the sum of maxScore of components is what the teacher gave them out of.
    const totalMax = course?.credits || courseMarks.reduce((s, m) => s + m.maxScore, 0);
    overallTotalScore += totalScore;
    overallTotalMax += totalMax;
  }
  
  const overallPct = overallTotalMax > 0 ? ((overallTotalScore / overallTotalMax) * 100).toFixed(1) : '0.0';
  const gaugePercent = Math.min(parseFloat(overallPct), 100);
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (gaugePercent / 100) * circumference;

  const toggleSubject = (subjectId: string) => {
    setOpenSubjects(prev => {
      const next = new Set(prev);
      next.has(subjectId) ? next.delete(subjectId) : next.add(subjectId);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-body-secondary">Loading grades...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-error">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 px-4 md:px-8 space-y-8 max-w-[1280px] mx-auto w-full pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[28px] font-bold text-on-surface">My Academic Record</h1>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg text-[14px] font-medium shadow-sm hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          Download Transcript (PDF)
        </button>
      </div>

      {/* Overall Percentage Summary Banner */}
      <div className="rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden bg-gradient-to-br from-[#4f772d] via-[#90a955] to-[#ecf39e]">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-surface opacity-10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-evergreen opacity-10 rounded-full blur-2xl" />
        <div className="flex flex-col z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-[48px] font-bold leading-tight">{overallPct}%</span>
            <span className="text-[16px] opacity-80">Overall Percentage</span>
          </div>
          <span className="text-sm opacity-75">{grouped.length} subject{grouped.length !== 1 ? 's' : ''} · {overallTotalMax} Total Marks</span>
        </div>
        <div className="relative w-32 h-32 z-10 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
            <circle className="transition-all duration-1000 ease-out" cx="50" cy="50" fill="none" r="45"
              stroke="url(#gauge-gradient)" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeWidth="8" />
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#90a955" />
                <stop offset="100%" stopColor="#132A13" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{overallPct}%</span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {grouped.length === 0 ? (
        <div className="text-center py-16 border border-divider rounded-xl bg-surface">
          <Award className="w-12 h-12 text-body-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-on-surface mb-2">No Grades Yet</h3>
          <p className="text-body-secondary text-sm">Your grades will appear here once your instructor posts them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ course, marks: courseMarks }) => {
            const subjectId = course?.id || 'unknown';
            const isOpen = openSubjects.has(subjectId);
            const totalScore = courseMarks.reduce((s, m) => s + m.score, 0);
            const totalMax = course?.credits || courseMarks.reduce((s, m) => s + m.maxScore, 0);
            const pct = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
            const { letter, color } = getGradeLabel(pct);

            return (
              <div key={subjectId} className="bg-surface rounded-xl border border-divider overflow-hidden shadow-sm">
                <div className="h-1 w-full bg-gradient-to-r from-success to-primary-container" />
                <button
                  className="w-full flex items-center justify-between p-5 hover:bg-surface-container transition-colors text-left"
                  onClick={() => toggleSubject(subjectId)}
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <BookOpen className="w-5 h-5 text-primary shrink-0" />
                    <h2 className="text-[15px] font-semibold text-on-surface">
                      {course?.title || 'Unknown Subject'}
                      {course?.code && <span className="text-body-secondary font-normal ml-2">({course.code})</span>}
                    </h2>
                    <span className={`${color} px-3 py-0.5 rounded-full text-xs font-bold`}>Grade: {letter}</span>
                    <span className="text-body-secondary text-sm">{pct.toFixed(1)}%</span>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-body-secondary shrink-0" /> : <ChevronDown className="w-5 h-5 text-body-secondary shrink-0" />}
                </button>

                {isOpen && (
                  <div className="border-t border-divider overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-surface-container text-body-secondary text-xs uppercase">
                        <tr>
                          <th className="px-5 py-3">Component</th>
                          <th className="px-5 py-3 text-center">Score</th>
                          <th className="px-5 py-3 text-center">Max</th>
                          <th className="px-5 py-3 text-center">%</th>
                          <th className="px-5 py-3">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-divider">
                        {courseMarks.map(mark => {
                          const markPct = mark.maxScore > 0 ? ((mark.score / mark.maxScore) * 100).toFixed(1) : '0.0';
                          return (
                            <tr key={mark.id} className="hover:bg-surface-container/50 transition-colors">
                              <td className="px-5 py-3 font-medium text-on-surface">{mark.component}</td>
                              <td className="px-5 py-3 text-center font-semibold text-primary">{mark.score}</td>
                              <td className="px-5 py-3 text-center text-body-secondary">{mark.maxScore}</td>
                              <td className="px-5 py-3 text-center text-body-secondary">{markPct}%</td>
                              <td className="px-5 py-3 text-body-secondary text-xs">{mark.notes || '—'}</td>
                            </tr>
                          );
                        })}
                        <tr className="bg-surface-container font-semibold">
                          <td className="px-5 py-3 text-on-surface">Total</td>
                          <td className="px-5 py-3 text-center text-primary">{totalScore}</td>
                          <td className="px-5 py-3 text-center text-body-secondary">{totalMax}</td>
                          <td className="px-5 py-3 text-center text-primary">{pct.toFixed(1)}%</td>
                          <td className="px-5 py-3" />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
