"use client";
import React, { useEffect, useState } from 'react';
import { Award, BookOpen, ChevronDown, ChevronUp, Download, Loader2, AlertCircle } from 'lucide-react';
import { marksApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface TranscriptCourse {
  code: string;
  name: string;
  credits: number;
  grade: string;
  points: number;
}
interface TranscriptTerm {
  term: string;
  courses: TranscriptCourse[];
  termGPA: number;
}

export default function StudentTranscript() {
  const { user } = useAuth();
  const [transcript, setTranscript] = useState<TranscriptTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openTerms, setOpenTerms] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    const fetchTranscript = async () => {
      try {
        setIsLoading(true);
        const data = await marksApi.getTranscript(user.id);
        // Backend may return marks array — group into terms
        if (Array.isArray(data) && data.length > 0 && data[0]?.term) {
          setTranscript(data);
        } else if (Array.isArray(data)) {
          // Group raw marks by semester/year if needed
          setTranscript(data);
        } else {
          setTranscript([]);
        }
        // Auto-open the first term
        if (Array.isArray(data) && data.length > 0) {
          setOpenTerms(new Set([data[0].term || '0']));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load transcript.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTranscript();
  }, [user]);

  const toggleTerm = (term: string) => {
    setOpenTerms(prev => {
      const next = new Set(prev);
      next.has(term) ? next.delete(term) : next.add(term);
      return next;
    });
  };

  const handleDownload = async () => {
    if (!user) return;
    try {
      setIsDownloading(true);
      await marksApi.downloadTranscriptPdf(user.id);
    } catch (err: any) {
      setError('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const totalCredits = transcript.reduce((s, t) => s + t.courses.reduce((cs, c) => cs + c.credits, 0), 0);
  const cgpa = transcript.length > 0
    ? (transcript.reduce((s, t) => {
        const termCredits = t.courses.reduce((cs, c) => cs + c.credits, 0);
        return s + (t.termGPA * termCredits);
      }, 0) / (totalCredits || 1)).toFixed(2)
    : '0.00';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-body-secondary">Loading transcript...</span>
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
    <div className="p-8 max-w-[1280px] mx-auto">
      <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-on-surface mb-2">Unofficial Transcript</h1>
          <p className="text-body-secondary">Review your academic history and grades.</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-surface text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isDownloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {/* GPA Header */}
      <div className="bg-primary rounded-xl p-6 mb-8 text-on-primary flex items-center justify-between shadow-lg flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-on-primary/10 flex items-center justify-center border-2 border-on-primary/20">
            <Award className="w-8 h-8 text-on-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Cumulative GPA: {cgpa}</h2>
            <p className="text-on-primary/80">Total Credits Earned: {totalCredits}</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="font-medium text-on-primary/70">Student ID: {user?.id?.slice(0, 8).toUpperCase() || '—'}</p>
          <p className="font-medium text-on-primary/70">Program: B.S. Student</p>
        </div>
      </div>

      {/* Empty state */}
      {transcript.length === 0 ? (
        <div className="text-center py-16 border border-divider rounded-xl bg-surface">
          <BookOpen className="w-12 h-12 text-body-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-on-surface mb-2">No Transcript Data</h3>
          <p className="text-body-secondary text-sm">Your transcript will appear here once grades are recorded.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transcript.map((termData, index) => {
            const termKey = termData.term || String(index);
            const isOpen = openTerms.has(termKey);
            const termCredits = termData.courses.reduce((s, c) => s + c.credits, 0);

            return (
              <div key={termKey} className="bg-surface rounded-xl border border-divider overflow-hidden shadow-sm">
                <button
                  className="p-4 border-b border-divider bg-surface flex items-center justify-between w-full cursor-pointer hover:bg-surface-container transition-colors"
                  onClick={() => toggleTerm(termKey)}
                >
                  <div className="flex items-center gap-3 text-on-surface font-bold">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="text-lg">{termData.term}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-primary">GPA: {termData.termGPA?.toFixed(2) || '—'}</span>
                    <span className="text-xs text-body-secondary">{termCredits} credits</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-body-secondary" /> : <ChevronDown className="w-5 h-5 text-body-secondary" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="overflow-x-auto">
                    {/* Mobile */}
                    <div className="md:hidden divide-y divide-divider bg-surface">
                      {termData.courses.map((course, idx) => (
                        <div key={idx} className="p-4">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-bold text-primary">{course.code}</div>
                            <div className="font-bold text-on-surface text-lg bg-surface-container px-2 rounded">{course.grade}</div>
                          </div>
                          <div className="text-on-surface font-medium mb-2">{course.name}</div>
                          <div className="flex gap-4 text-sm text-body-secondary">
                            <div>Credits: <span className="font-medium">{course.credits}</span></div>
                            <div>Points: <span className="font-medium">{course.points}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop */}
                    <table className="hidden md:table w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container text-body-secondary text-sm">
                          <th className="p-3 font-semibold border-b border-divider">Course Code</th>
                          <th className="p-3 font-semibold border-b border-divider">Course Name</th>
                          <th className="p-3 font-semibold border-b border-divider text-center">Credits</th>
                          <th className="p-3 font-semibold border-b border-divider text-center">Grade</th>
                          <th className="p-3 font-semibold border-b border-divider text-center">GPA Points</th>
                        </tr>
                      </thead>
                      <tbody className="text-on-surface">
                        {termData.courses.map((course, idx) => (
                          <tr key={idx} className="border-b border-divider last:border-0 hover:bg-surface-container transition-colors">
                            <td className="p-3 font-medium text-primary">{course.code}</td>
                            <td className="p-3">{course.name}</td>
                            <td className="p-3 text-center">{course.credits}</td>
                            <td className="p-3 font-bold text-on-surface text-center">{course.grade}</td>
                            <td className="p-3 text-center text-body-secondary">{course.points}</td>
                          </tr>
                        ))}
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
