"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { marksApi, usersApi, attendanceApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, Printer, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

function getPakGrade(pct: number): { letter: string; remarks: string } {
  if (pct >= 90) return { letter: 'A+', remarks: 'Outstanding' };
  if (pct >= 80) return { letter: 'A',  remarks: 'Excellent' };
  if (pct >= 70) return { letter: 'B',  remarks: 'Good' };
  if (pct >= 60) return { letter: 'C',  remarks: 'Satisfactory' };
  if (pct >= 50) return { letter: 'D',  remarks: 'Pass' };
  if (pct >= 40) return { letter: 'E',  remarks: 'Pass (Minimum)' };
  return { letter: 'F', remarks: 'Fail' };
}

export default function ReportCard() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading]     = useState(true);
  const [student, setStudent]     = useState<any>(null);
  const [marks, setMarks]         = useState<any[]>([]);
  const [attendance, setAttendance] = useState<{ present: number; total: number } | null>(null);

  useEffect(() => {
    if (user?.id) loadData(user.id);
  }, [user]);

  async function loadData(studentId: string) {
    setLoading(true);
    try {
      const [profileData, marksData, attData] = await Promise.all([
        usersApi.getUnifiedProfile(studentId),
        marksApi.getStudentMarks(studentId),
        // Fetch real attendance — sum across all courses
        attendanceApi.get(undefined, studentId).catch(() => []),
      ]);
      setStudent(profileData);
      setMarks(Array.isArray(marksData) ? marksData : marksData?.data || []);

      // Compute attendance from real data
      const attList = Array.isArray(attData) ? attData : attData?.data || [];
      const present = attList.filter((a: any) => a.status === 'PRESENT').length;
      const total = attList.length;
      setAttendance(total > 0 ? { present, total } : null);
    } catch {
      toast.error('Failed to load report card');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const s = student || {};

  const grNumber   = s.grNumber || s.id?.slice(0, 8).toUpperCase() || 'N/A';
  const className  = s.className || s.class?.name || s.enrollments?.[0]?.course?.classLevel || 'N/A';
  const section    = s.section || 'N/A';
  const fatherName = s.fatherName || s.family?.father?.name || 'N/A';
  const rollNo     = s.rollNumber || s.grNumber || 'N/A';
  const currentTerm = 'Annual Examination 2025–2026';

  // Group marks by subject/course
  const subjectsMap: Record<string, { obtained: number; max: number; code: string }> = {};
  marks.forEach((m: any) => {
    const subj = m.course?.title || m.assignment?.course?.title || m.subject || 'General';
    const code = m.course?.code  || m.assignment?.course?.code  || '';
    if (!subjectsMap[subj]) subjectsMap[subj] = { obtained: 0, max: 0, code };
    subjectsMap[subj].obtained += Number(m.score ?? m.obtainedMarks ?? 0);
    subjectsMap[subj].max      += Number(m.maxScore ?? m.totalMarks ?? m.course?.credits ?? 100);
  });

  let totalMarks = 0, obtainedMarks = 0;
  const subjectRows = Object.entries(subjectsMap).map(([subj, data]) => {
    const pct = data.max > 0 ? (data.obtained / data.max) * 100 : 0;
    totalMarks   += data.max;
    obtainedMarks += data.obtained;
    const { letter, remarks } = getPakGrade(pct);
    return { subject: subj, code: data.code, total: data.max, obtained: data.obtained, pct, letter, remarks };
  });

  const overallPct = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
  const { letter: overallGrade, remarks: overallRemarks } = getPakGrade(overallPct);
  const isPassed = overallPct >= 40;

  const attPct = attendance ? ((attendance.present / attendance.total) * 100).toFixed(0) : null;

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 space-y-6 print:block w-full">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { -webkit-print-color-adjust: exact; background: white !important; }
          .print-hidden { display: none !important; }
          .print-border { border: 1px solid #000 !important; }
        }
      `}} />

      {/* Controls */}
      <div className="flex justify-between items-center print-hidden mb-6">
        <button onClick={() => router.back()}
          className="flex items-center text-sm font-semibold hover:text-primary transition-colors gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={() => window.print()}
          className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
          <Printer className="w-4 h-4" /> Print Result Card
        </button>
      </div>

      {/* Report Card */}
      <div className="border-4 border-slate-800 bg-white text-black p-8 print:p-4 print:border-2">

        {/* Header */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-5">
          <h1 className="text-2xl font-bold uppercase tracking-wider">EduCore School System</h1>
          <h2 className="text-lg font-semibold uppercase mt-1">Progress Report Card — 2025–2026</h2>
          <p className="text-sm mt-1 text-gray-600">{currentTerm}</p>
        </div>

        {/* Student Info Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 mb-5 text-sm">
          <p><span className="font-semibold inline-block w-28">Student Name:</span>
            <span className="border-b border-black inline-block w-44">{s.firstName || 'Unknown'} {s.lastName || 'Student'}</span></p>
          <p><span className="font-semibold inline-block w-28">GR Number:</span>
            <span className="border-b border-black inline-block w-44 font-mono">{grNumber}</span></p>
          <p><span className="font-semibold inline-block w-28">Father's Name:</span>
            <span className="border-b border-black inline-block w-44">{fatherName}</span></p>
          <p><span className="font-semibold inline-block w-28">Roll No:</span>
            <span className="border-b border-black inline-block w-44">{rollNo}</span></p>
          <p><span className="font-semibold inline-block w-28">Class:</span>
            <span className="border-b border-black inline-block w-44">{className}</span></p>
          <p><span className="font-semibold inline-block w-28">Section:</span>
            <span className="border-b border-black inline-block w-44">{section}</span></p>
        </div>

        {/* Marks Table */}
        <table className="w-full border-collapse border-2 border-slate-800 mb-5 text-sm text-center">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-800">
              <th className="border border-slate-800 p-2 text-left w-1/3">Subject</th>
              <th className="border border-slate-800 p-2 w-16">Code</th>
              <th className="border border-slate-800 p-2 w-20">Tot. Marks</th>
              <th className="border border-slate-800 p-2 w-20">Obtained</th>
              <th className="border border-slate-800 p-2 w-16">%</th>
              <th className="border border-slate-800 p-2 w-14">Grade</th>
              <th className="border border-slate-800 p-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {subjectRows.length > 0 ? subjectRows.map((row, i) => (
              <tr key={i} className="border-b border-slate-400">
                <td className="border border-slate-400 p-2 text-left font-medium">{row.subject}</td>
                <td className="border border-slate-400 p-2 font-mono text-xs">{row.code}</td>
                <td className="border border-slate-400 p-2">{row.total}</td>
                <td className="border border-slate-400 p-2 font-semibold">{row.obtained}</td>
                <td className="border border-slate-400 p-2">{row.pct.toFixed(1)}%</td>
                <td className={`border border-slate-400 p-2 font-bold ${row.letter === 'F' ? 'text-red-700' : row.letter === 'A+' || row.letter === 'A' ? 'text-green-700' : ''}`}>
                  {row.letter}
                </td>
                <td className="border border-slate-400 p-2 text-xs">{row.remarks}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500 italic">
                  No exam results recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Summary Row */}
        <div className="border-2 border-slate-800 p-4 mb-4 text-sm grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><span className="font-semibold">Total Marks:</span> {totalMarks}</div>
          <div><span className="font-semibold">Marks Obtained:</span> {obtainedMarks}</div>
          <div><span className="font-semibold">Percentage:</span> {overallPct.toFixed(1)}%</div>
          <div>
            <span className="font-semibold">Grade:</span>{' '}
            <span className={`font-bold ${overallGrade === 'F' ? 'text-red-700' : 'text-green-700'}`}>
              {overallGrade} — {overallRemarks}
            </span>
          </div>
        </div>

        {/* Attendance & Result */}
        <div className="border-2 border-slate-800 p-4 mb-4 text-sm grid grid-cols-2 gap-3">
          <div>
            <span className="font-semibold">Attendance:</span>{' '}
            {attendance
              ? `${attendance.present}/${attendance.total} days (${attPct}%)`
              : 'Not recorded'}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Result:</span>
            {isPassed ? (
              <span className="flex items-center gap-1 text-green-700 font-bold">
                <CheckCircle2 className="w-4 h-4" /> PASS — Promoted
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-700 font-bold">
                <XCircle className="w-4 h-4" /> FAIL — Detained
              </span>
            )}
          </div>
        </div>

        {/* Pakistani Grading Scale Reference */}
        <div className="border border-slate-400 p-3 mb-6 text-xs">
          <p className="font-bold mb-1">Grading Scale (Pakistani Board):</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {[['A+','90–100','Outstanding'],['A','80–89','Excellent'],['B','70–79','Good'],['C','60–69','Satisfactory'],['D','50–59','Pass'],['E','40–49','Pass (Min.)'],['F','Below 40','Fail']].map(([g, r, l]) => (
              <span key={g}><strong>{g}</strong>: {r} ({l})</span>
            ))}
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end text-sm font-semibold mt-8 gap-4">
          <div className="text-center">
            <div className="w-40 border-b-2 border-black mb-1"></div>
            <p>Class Teacher</p>
          </div>
          <div className="text-center">
            <div className="w-40 border-b-2 border-black mb-1"></div>
            <p>Head of Section</p>
          </div>
          <div className="text-center">
            <div className="w-40 border-b-2 border-black mb-1"></div>
            <p>Principal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
