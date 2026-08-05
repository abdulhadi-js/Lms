"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Paperclip, FileText, CheckCircle, Clock, Save, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { assignmentsApi, enrollmentsApi, marksApi } from '@/lib/api';

export default function AssignmentSubmissionsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [assignment, setAssignment] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Grading state
  const [pendingGrades, setPendingGrades] = useState<Record<string, { score: string, markId?: string, isNew: boolean }>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    setPendingGrades({});
    try {
      // Fetch assignment details first to get courseId
      const assignmentData = await assignmentsApi.get(id);
      setAssignment(assignmentData);

      const courseId = assignmentData.courseId || assignmentData.course?.id;

      if (courseId) {
        // Fetch enrollments, submissions, and existing marks concurrently
        const [enrollData, subData, marksData] = await Promise.all([
          enrollmentsApi.list(),
          assignmentsApi.getSubmissions(id).catch(() => []),
          marksApi.getGradebook(courseId).catch(() => [])
        ]);

        const courseStudents = (Array.isArray(enrollData) ? enrollData : [])
          .filter((e: any) => e.course?.id === courseId && e.status === 'ACTIVE' && e.student)
          .map((e: any) => e.student);

        setStudents(courseStudents);
        setSubmissions(Array.isArray(subData) ? subData : []);
        setMarks(Array.isArray(marksData) ? marksData : []);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  }

  const handleGradeChange = (studentId: string, value: string, existingMark?: any) => {
    if (value === '') {
      const newGrades = { ...pendingGrades };
      delete newGrades[studentId];
      setPendingGrades(newGrades);
      return;
    }
    
    setPendingGrades({
      ...pendingGrades,
      [studentId]: {
        score: value,
        markId: existingMark?.id,
        isNew: !existingMark
      }
    });
  };

  const handleSaveGrades = async () => {
    if (!assignment) return;
    setSaving(true);
    try {
      const courseId = assignment.courseId || assignment.course?.id;
      const promises = Object.entries(pendingGrades).map(async ([studentId, change]) => {
        if (change.isNew) {
          await marksApi.enterMark({
            studentId,
            courseId,
            component: assignment.id,
            score: parseFloat(change.score),
            maxScore: assignment.maxMarks || 100,
            weightPercent: assignment.weightPercent || 10
          });
        } else if (change.markId) {
          await marksApi.updateMark(change.markId, { score: parseFloat(change.score) });
        }
      });

      await Promise.all(promises);
      toast.success(`${Object.keys(pendingGrades).length} grade(s) saved successfully!`);
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save grades.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-8 w-48 bg-surface-container rounded" />
        <div className="h-32 bg-surface-container rounded-xl" />
        <div className="h-64 bg-surface-container rounded-xl" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-error mb-4">Assignment Not Found</h2>
        <Link href="/teacher/assignments" className="text-primary hover:underline font-semibold flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-8">
      {/* Header */}
      <div>
        <Link href="/teacher/assignments" className="inline-flex items-center gap-2 text-sm text-body-secondary hover:text-primary transition-colors font-medium mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-heading-on-light mb-2">{assignment.title}</h1>
            <p className="text-body-secondary flex items-center gap-2">
              <span className="font-semibold text-primary">{assignment.course?.title || 'Unknown Course'}</span>
              <span>•</span>
              <span>Max Marks: {assignment.maxMarks || 100}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </p>
          </div>
          {Object.keys(pendingGrades).length > 0 && (
            <button
              onClick={handleSaveGrades}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All Grades'}
            </button>
          )}
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-surface rounded-2xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 bg-surface-container-low border-b border-divider flex items-center justify-between">
          <h2 className="font-bold text-on-surface">Student Submissions</h2>
          <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
            {submissions.length} / {students.length} Submitted
          </span>
        </div>
        
        <div className="overflow-x-auto">
          {students.length === 0 ? (
            <div className="p-12 text-center text-body-secondary">No students enrolled in this course.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-lowest text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                  <th className="p-4 font-semibold">Student</th>
                  <th className="p-4 font-semibold">Submission Status</th>
                  <th className="p-4 font-semibold">Submitted Work</th>
                  <th className="p-4 font-semibold text-right w-48">Grade (/{assignment.maxMarks || 100})</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {students.map((student, index) => {
                  const submission = submissions.find(s => s.studentId === student.id);
                  const existingMark = marks.find(m => m.studentId === student.id && m.component === assignment.id);
                  const pending = pendingGrades[student.id];
                  const displayScore = pending ? pending.score : (existingMark ? existingMark.score : '');

                  return (
                    <tr key={student.id} className={`border-b border-divider hover:bg-surface-container-lowest transition-colors ${index % 2 === 0 ? 'bg-surface' : 'bg-surface/50'}`}>
                      <td className="p-4">
                        <div className="font-bold text-on-surface">{student.firstName} {student.lastName}</div>
                        <div className="text-xs text-body-secondary">{student.email}</div>
                      </td>
                      <td className="p-4">
                        {submission ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-success-bg text-success border border-success/20 w-fit">
                              <CheckCircle className="w-3.5 h-3.5" /> Submitted
                            </span>
                            <span className="text-xs text-body-secondary">
                              {new Date(submission.submittedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-surface-container text-body-secondary border border-divider w-fit">
                            Missing
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {submission ? (
                          <div className="space-y-2">
                            {submission.fileUrl && (
                              <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                                <Paperclip className="w-4 h-4" /> View Attachment
                              </a>
                            )}
                            {submission.textContent && (
                              <div className="text-sm text-on-surface bg-surface-container-lowest p-3 rounded-lg border border-divider max-h-32 overflow-y-auto">
                                <FileText className="w-3 h-3 inline mr-1 text-body-secondary mb-0.5" />
                                {submission.textContent}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-body-secondary italic text-xs">No submission</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <input
                          type="number"
                          placeholder="-"
                          value={displayScore}
                          onChange={(e) => handleGradeChange(student.id, e.target.value, existingMark)}
                          className={`w-24 text-right border rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                            pending ? 'bg-warning-bg/20 border-warning text-warning' : 'bg-surface border-divider text-on-surface'
                          }`}
                          max={assignment.maxMarks || 100}
                          min="0"
                          step="0.5"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
