"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { marksApi, usersApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, Printer, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ReportCard() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [marks, setMarks] = useState<any[]>([]);
  const [transcript, setTranscript] = useState<any>(null);
  const [attendance, setAttendance] = useState({ present: 185, total: 210 }); // Mocked for simplicity or could be fetched

  useEffect(() => {
    if (user?.id) {
      loadData(user.id);
    }
  }, [user]);

  async function loadData(studentId: string) {
    setLoading(true);
    try {
      const [profileData, marksData, transcriptData] = await Promise.all([
        usersApi.getUnifiedProfile(studentId),
        marksApi.getStudentMarks(studentId),
        marksApi.getTranscript(studentId).catch(() => null)
      ]);
      setStudent(profileData);
      setMarks(marksData);
      setTranscript(transcriptData);
    } catch (err: any) {
      toast.error("Failed to load report card");
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

  if (!student) return null;

  const currentTerm = 'Annual 2026';
  const grNumber = student.grNumber || student.id.slice(0, 8).toUpperCase();
  const className = student.class || student.enrollments?.[0]?.course?.title || 'Not Enrolled';
  const section = student.section || student.enrollments?.[0]?.section?.title || 'N/A';
  
  // Compute totals
  let totalMarks = 0;
  let obtainedMarks = 0;
  
  // Aggregate marks by course if needed, assuming marksData has course/subject info
  const subjectsMap: Record<string, any> = {};
  
  marks.forEach(m => {
    const subj = m.assignment?.course?.title || 'General';
    if (!subjectsMap[subj]) {
      subjectsMap[subj] = { obtained: 0, max: 0, grade: 'N/A' };
    }
    subjectsMap[subj].obtained += m.score || 0;
    subjectsMap[subj].max += m.maxScore || 100;
  });

  const subjectRows = Object.keys(subjectsMap).map(subj => {
    const data = subjectsMap[subj];
    const pct = data.max > 0 ? (data.obtained / data.max) * 100 : 0;
    
    totalMarks += data.max;
    obtainedMarks += data.obtained;
    
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B';
    else if (pct >= 60) grade = 'C';
    else if (pct >= 50) grade = 'D';
    
    return { subject: subj, total: data.max, obtained: data.obtained, pct, grade };
  });

  const overallPct = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
  let overallGrade = 'F';
  if (overallPct >= 90) overallGrade = 'A+';
  else if (overallPct >= 80) overallGrade = 'A';
  else if (overallPct >= 70) overallGrade = 'B';
  else if (overallPct >= 60) overallGrade = 'C';
  else if (overallPct >= 50) overallGrade = 'D';

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 space-y-6 print:block w-full">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print { 
          body { -webkit-print-color-adjust: exact; background: white !important; }
          .print-hidden { display: none !important; }
        }
      `}} />
      
      <div className="flex justify-between items-center print-hidden mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm font-semibold hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <button
          onClick={() => window.print()}
          className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print Result Card
        </button>
      </div>

      <div className="border-4 border-slate-800 p-8 bg-white text-black print:p-0 print:border-none">
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">EduCore LMS / School Name</h1>
          <h2 className="text-xl font-semibold uppercase">Progress Report Card — 2025-2026</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm font-semibold">
          <div>
            <p className="mb-2"><span className="inline-block w-24">Student:</span> <span className="border-b border-black inline-block w-48">{student.firstName} {student.lastName}</span></p>
            <p className="mb-2"><span className="inline-block w-24">Class:</span> <span className="border-b border-black inline-block w-48">{className}</span></p>
            <p className="mb-2"><span className="inline-block w-24">Roll No:</span> <span className="border-b border-black inline-block w-48">{student.rollNumber || 'N/A'}</span></p>
          </div>
          <div>
            <p className="mb-2"><span className="inline-block w-24">GR No:</span> <span className="border-b border-black inline-block w-48">{grNumber}</span></p>
            <p className="mb-2"><span className="inline-block w-24">Section:</span> <span className="border-b border-black inline-block w-48">{section}</span></p>
            <p className="mb-2"><span className="inline-block w-24">Term:</span> <span className="border-b border-black inline-block w-48">{currentTerm}</span></p>
          </div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-800 mb-6 text-sm text-center">
          <thead>
            <tr className="border-b-2 border-slate-800 bg-slate-100">
              <th className="border-r border-slate-800 p-2 text-left w-2/5">Subject</th>
              <th className="border-r border-slate-800 p-2">Tot. Marks</th>
              <th className="border-r border-slate-800 p-2">Obtained</th>
              <th className="border-r border-slate-800 p-2">%</th>
              <th className="p-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            {subjectRows.length > 0 ? subjectRows.map((row, i) => (
              <tr key={i} className="border-b border-slate-800">
                <td className="border-r border-slate-800 p-2 text-left font-medium">{row.subject}</td>
                <td className="border-r border-slate-800 p-2">{row.total}</td>
                <td className="border-r border-slate-800 p-2">{row.obtained}</td>
                <td className="border-r border-slate-800 p-2">{row.pct.toFixed(1)}%</td>
                <td className="p-2 font-bold">{row.grade}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="p-4 text-center">No subjects recorded.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="border-2 border-slate-800 p-4 mb-6 text-sm grid grid-cols-3 gap-4">
          <div className="font-semibold">Total: {totalMarks}</div>
          <div className="font-semibold">Obtained: {obtainedMarks}</div>
          <div className="font-semibold">Pct: {overallPct.toFixed(1)}%</div>
          <div className="font-semibold">Overall Grade: {overallGrade}</div>
          <div className="font-semibold">Position: 3rd in class</div>
          <div className="font-semibold text-green-700">Remarks: Promoted to Next Class</div>
        </div>

        <div className="border-2 border-slate-800 p-4 mb-12 text-sm font-semibold">
          Attendance: {attendance.present}/{attendance.total} days ({((attendance.present/attendance.total)*100).toFixed(0)}%)
        </div>

        <div className="flex justify-between items-end mt-12 text-sm font-semibold">
          <div className="text-center">
            <div className="w-48 border-b border-black mb-2"></div>
            Class Teacher
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-black mb-2"></div>
            Principal
          </div>
        </div>
      </div>
    </div>
  );
}
