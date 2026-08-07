"use client";
import React, { useEffect, useState } from 'react';
import { Award, BookOpen, ChevronDown, ChevronUp, Download, Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { marksApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

function getPakGrade(pct: number): { letter: string; color: string; remarks: string } {
  if (pct >= 90) return { letter: 'A+', color: 'text-emerald-600 bg-emerald-50',  remarks: 'Outstanding' };
  if (pct >= 80) return { letter: 'A',  color: 'text-green-600 bg-green-50',      remarks: 'Excellent' };
  if (pct >= 70) return { letter: 'B',  color: 'text-blue-600 bg-blue-50',        remarks: 'Good' };
  if (pct >= 60) return { letter: 'C',  color: 'text-amber-600 bg-amber-50',      remarks: 'Satisfactory' };
  if (pct >= 50) return { letter: 'D',  color: 'text-orange-600 bg-orange-50',    remarks: 'Pass' };
  if (pct >= 40) return { letter: 'E',  color: 'text-red-500 bg-red-50',          remarks: 'Pass (Min.)' };
  return           { letter: 'F',  color: 'text-red-700 bg-red-100',         remarks: 'Fail' };
}

// Group raw marks array into exam-term buckets
function groupMarksByTerm(marks: any[]): any[] {
  const termMap: Record<string, { subjects: Record<string, { obtained: number; max: number; code: string }> }> = {};

  marks.forEach((m: any) => {
    const term = m.examType || m.term || m.examTerm || 'Annual 2025–2026';
    const subj = m.course?.title || m.subject || 'General';
    const code = m.course?.code || '';
    if (!termMap[term]) termMap[term] = { subjects: {} };
    if (!termMap[term].subjects[subj]) termMap[term].subjects[subj] = { obtained: 0, max: 0, code };
    termMap[term].subjects[subj].obtained += Number(m.score ?? m.obtainedMarks ?? 0);
    termMap[term].subjects[subj].max      += Number(m.maxScore ?? m.totalMarks ?? m.course?.credits ?? 100);
  });

  return Object.entries(termMap).map(([term, data]) => {
    let termTotal = 0, termObtained = 0;
    const courses = Object.entries(data.subjects).map(([name, s]) => {
      const pct = s.max > 0 ? (s.obtained / s.max) * 100 : 0;
      termTotal    += s.max;
      termObtained += s.obtained;
      const grade = getPakGrade(pct);
      return { name, code: s.code, totalMarks: s.max, obtained: s.obtained, pct, ...grade };
    });
    const termPct = termTotal > 0 ? (termObtained / termTotal) * 100 : 0;
    const termGrade = getPakGrade(termPct);
    return { term, courses, termTotal, termObtained, termPct, termGrade };
  });
}

export default function StudentTranscript() {
  const { user } = useAuth();
  const [rawMarks, setRawMarks]     = useState<any[]>([]);
  const [termData, setTermData]     = useState<any[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [openTerms, setOpenTerms]   = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        setIsLoading(true);
        // Try transcript endpoint first, fall back to raw marks
        let marks: any[] = [];
        try {
          const transcriptData = await marksApi.getTranscript(user.id);
          // If backend returns grouped terms, handle it; otherwise use raw
          if (Array.isArray(transcriptData) && transcriptData.length > 0 && transcriptData[0]?.courses) {
            // Already grouped — just remap to our format
            const remapped = transcriptData.map((t: any) => {
              let termTotal = 0, termObtained = 0;
              const courses = (t.courses || []).map((c: any) => {
                // Handle both GPA-based and marks-based responses
                const pct = c.percentage ?? (c.points && c.credits ? (c.points / c.credits) * 100 : 0);
                termTotal    += c.totalMarks || c.credits || 100;
                termObtained += c.obtained   || c.points  || 0;
                return { name: c.name || c.title, code: c.code, totalMarks: c.totalMarks || c.credits || 100, obtained: c.obtained || c.points || 0, pct, ...getPakGrade(pct) };
              });
              const termPct = termTotal > 0 ? (termObtained / termTotal) * 100 : 0;
              return { term: t.term, courses, termTotal, termObtained, termPct, termGrade: getPakGrade(termPct) };
            });
            setTermData(remapped);
            if (remapped.length > 0) setOpenTerms(new Set([remapped[0].term]));
            return;
          }
          marks = Array.isArray(transcriptData) ? transcriptData : [];
        } catch {
          let fallbackMarks: any = await marksApi.getStudentMarks(user.id).catch(() => []);
          marks = Array.isArray(fallbackMarks) ? fallbackMarks : fallbackMarks?.data || [];
        }
        const grouped = groupMarksByTerm(marks);
        setRawMarks(marks);
        setTermData(grouped);
        if (grouped.length > 0) setOpenTerms(new Set([grouped[0].term]));
      } catch (err: any) {
        setError(err.message || 'Failed to load transcript.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
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
    } catch {
      setError('PDF not available. Please contact admin.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Cumulative overall
  const cumTotal    = termData.reduce((s, t) => s + t.termTotal, 0);
  const cumObtained = termData.reduce((s, t) => s + t.termObtained, 0);
  const cumPct      = cumTotal > 0 ? (cumObtained / cumTotal) * 100 : 0;
  const cumGrade    = getPakGrade(cumPct);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-3 text-body-secondary">Loading transcript...</span>
    </div>
  );

  if (error) return (
    <div className="p-8 max-w-[1280px] mx-auto">
      <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-error">
        <AlertCircle className="w-5 h-5 shrink-0" /><p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1280px] mx-auto pb-24">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-on-surface mb-1">Academic Transcript</h1>
          <p className="text-body-secondary text-sm">Your complete marks history and performance by exam.</p>
        </div>
        <button onClick={handleDownload} disabled={isDownloading}
          className="flex items-center gap-2 bg-surface text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50 text-sm font-semibold">
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isDownloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {/* Cumulative Banner */}
      <div className="primary-gradient rounded-xl p-5 mb-6 text-white flex items-center justify-between flex-wrap gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs uppercase tracking-wider mb-0.5">Cumulative Result</p>
            <h2 className="text-2xl font-bold">{cumPct.toFixed(1)}% — Grade {cumGrade.letter}</h2>
            <p className="text-white/80 text-sm">{cumObtained} / {cumTotal} marks · {cumGrade.remarks}</p>
          </div>
        </div>
        <div className="text-right">
          {cumPct >= 40 ? (
            <span className="flex items-center gap-1 text-white font-bold text-sm bg-white/20 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4" /> Overall PASS
            </span>
          ) : (
            <span className="flex items-center gap-1 text-white font-bold text-sm bg-red-500/30 px-3 py-1.5 rounded-full">
              <XCircle className="w-4 h-4" /> Overall FAIL
            </span>
          )}
        </div>
      </div>

      {/* Pakistani Grading Reference */}
      <div className="bg-surface border border-divider rounded-xl p-4 mb-6 text-xs">
        <p className="font-bold text-sm mb-2">📊 Pakistani Board Grading Scale</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {[['A+','90–100','Outstanding','text-emerald-600'],['A','80–89','Excellent','text-green-600'],['B','70–79','Good','text-blue-600'],['C','60–69','Satisfactory','text-amber-600'],['D','50–59','Pass','text-orange-600'],['E','40–49','Pass (Min)','text-red-500'],['F','<40','Fail','text-red-700']].map(([g,r,l,c]) => (
            <div key={g} className="text-center border border-divider rounded-lg p-2">
              <div className={`text-lg font-bold ${c}`}>{g}</div>
              <div className="text-body-secondary">{r}</div>
              <div className="text-[10px] text-body-secondary">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* No Data */}
      {termData.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-divider rounded-xl bg-surface">
          <BookOpen className="w-12 h-12 text-body-secondary mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-on-surface mb-2">No Records Found</h3>
          <p className="text-body-secondary text-sm">Your transcript will appear here once your teacher enters exam results.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {termData.map((t, index) => {
            const termKey = t.term || String(index);
            const isOpen = openTerms.has(termKey);
            return (
              <div key={termKey} className="bg-surface rounded-xl border border-divider overflow-hidden shadow-sm">
                {/* Term Header */}
                <button
                  className="p-4 border-b border-divider w-full flex items-center justify-between hover:bg-surface-container transition-colors"
                  onClick={() => toggleTerm(termKey)}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-bold text-on-surface">{t.term}</div>
                      <div className="text-xs text-body-secondary">{t.courses.length} subjects · {t.termObtained}/{t.termTotal} marks</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-sm ${t.termGrade.color}`}>
                      {t.termPct.toFixed(1)}% · {t.termGrade.letter}
                    </span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-body-secondary" /> : <ChevronDown className="w-5 h-5 text-body-secondary" />}
                  </div>
                </button>

                {/* Subject Rows */}
                {isOpen && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-surface-container text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                          <th className="py-3 px-4 font-semibold">Subject</th>
                          <th className="py-3 px-4 font-semibold">Code</th>
                          <th className="py-3 px-4 font-semibold text-center">Total</th>
                          <th className="py-3 px-4 font-semibold text-center">Obtained</th>
                          <th className="py-3 px-4 font-semibold text-center">%</th>
                          <th className="py-3 px-4 font-semibold text-center">Grade</th>
                          <th className="py-3 px-4 font-semibold">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.courses.map((c: any, i: number) => (
                          <tr key={i} className="border-b border-border-light hover:bg-surface-container/50 transition-colors">
                            <td className="py-3 px-4 font-medium text-on-surface">{c.name}</td>
                            <td className="py-3 px-4 text-body-secondary font-mono text-xs">{c.code || '—'}</td>
                            <td className="py-3 px-4 text-center">{c.totalMarks}</td>
                            <td className="py-3 px-4 text-center font-semibold">{c.obtained}</td>
                            <td className="py-3 px-4 text-center">{c.pct.toFixed(1)}%</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded font-bold text-sm ${c.color}`}>{c.letter}</span>
                            </td>
                            <td className="py-3 px-4 text-sm text-body-secondary">{c.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-surface-container font-bold border-t-2 border-divider">
                          <td className="py-3 px-4" colSpan={2}>Term Total</td>
                          <td className="py-3 px-4 text-center">{t.termTotal}</td>
                          <td className="py-3 px-4 text-center">{t.termObtained}</td>
                          <td className="py-3 px-4 text-center">{t.termPct.toFixed(1)}%</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded font-bold ${t.termGrade.color}`}>{t.termGrade.letter}</span>
                          </td>
                          <td className="py-3 px-4 text-sm">{t.termGrade.remarks}</td>
                        </tr>
                      </tfoot>
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
