"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Upload, FileText, CheckCircle, Clock, AlertCircle,
  X, ArrowLeft, Award, Calendar, BookOpen, Paperclip,
} from 'lucide-react';
import { assignmentsApi } from '@/lib/api';

const ACCEPTED_TYPES = '.pdf,.doc,.docx,.zip,.txt,.py,.js,.ts,.jsx,.tsx,.csv';
const MAX_FILE_SIZE_MB = 10;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeUntilDue(dueDate: string) {
  const diff = new Date(dueDate).getTime() - Date.now();
  if (diff < 0) return { label: 'Overdue', color: 'text-error', bg: 'bg-error-bg' };
  const hours = diff / 1000 / 3600;
  if (hours < 24) return { label: `Due in ${Math.round(hours)}h`, color: 'text-warning', bg: 'bg-warning-bg' };
  const days = Math.floor(hours / 24);
  return { label: `Due in ${days}d`, color: 'text-success', bg: 'bg-success-bg' };
}

type Tab = 'file' | 'text';

export default function AssignmentSubmissionPage() {
  const params = useParams();
  const id = params?.id as string;

  const [assignment, setAssignment] = useState<any>(null);
  const [existingSubmission, setExistingSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      assignmentsApi.get(id),
      assignmentsApi.getSubmissions(id).catch(() => [])
    ])
      .then(([assignmentData, submissionsData]) => {
        setAssignment(assignmentData);
        if (Array.isArray(submissionsData) && submissionsData.length > 0) {
          setExistingSubmission(submissionsData[0]);
          setSubmitted(true);
        }
      })
      .catch(err => setError(err?.message || 'Failed to load assignment'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFileSelect = (file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async () => {
    if (tab === 'file' && !selectedFile) {
      toast.error('Please select a file to submit.');
      return;
    }
    if (tab === 'text' && textContent.trim().length < 10) {
      toast.error('Text submission must be at least 10 characters.');
      return;
    }
    setSubmitting(true);
    setUploadProgress(0);
    try {
      if (tab === 'file') {
        const formData = new FormData();
        formData.append('file', selectedFile!);
        await assignmentsApi.submit(id, formData, (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
      } else {
        await assignmentsApi.submit(id, { textContent: textContent.trim() });
      }
      setSubmitted(true);
      toast.success('Assignment submitted successfully! 🎉');
    } catch (err: any) {
      toast.error(err?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 pb-24 space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-surface-container rounded mb-6" />
        <div className="bg-surface rounded-2xl border border-divider p-8 space-y-4">
          <div className="h-7 w-3/4 bg-surface-container rounded" />
          <div className="h-4 w-full bg-surface-container rounded" />
          <div className="h-4 w-5/6 bg-surface-container rounded" />
        </div>
        <div className="bg-surface rounded-2xl border border-divider h-64" />
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="max-w-[900px] mx-auto px-8 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
        <h2 className="text-xl font-bold text-on-surface mb-2">Assignment Not Found</h2>
        <p className="text-body-secondary mb-6">{error || 'This assignment could not be loaded.'}</p>
        <Link href="/student/assignments" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </Link>
      </div>
    );
  }

  const due = assignment.dueDate ? timeUntilDue(assignment.dueDate) : null;
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 pb-24 space-y-6">
      {/* Back nav */}
      <Link
        href="/student/assignments"
        className="inline-flex items-center gap-2 text-sm text-body-secondary hover:text-primary transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </Link>

      {/* Assignment Detail Card */}
      <div className="bg-surface rounded-2xl border border-divider brand-shadow overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-evergreen to-lime-cream" />
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
            <div className="flex-1 min-w-0">
              {assignment.course && (
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-primary-container" />
                  <span className="text-xs font-bold text-primary-container uppercase tracking-wider">
                    {assignment.course?.code || assignment.course?.title || 'Course'}
                  </span>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-heading-on-light leading-tight">
                {assignment.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {due && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${due.bg} ${due.color} border border-current/20`}>
                  <Clock className="w-3.5 h-3.5" />
                  {due.label}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
                <Award className="w-3.5 h-3.5" />
                {assignment.maxMarks ?? 100} pts
              </span>
            </div>
          </div>

          {assignment.dueDate && (
            <div className="flex items-center gap-2 text-sm text-body-secondary mb-5">
              <Calendar className="w-4 h-4" />
              <span>
                Due:{' '}
                <span className="font-semibold text-on-surface">
                  {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              </span>
            </div>
          )}

          {assignment.description && (
            <div 
              className="prose max-w-none text-body-secondary leading-relaxed mb-6 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: assignment.description }} 
            />
          )}

          {/* Rubric table */}
          {Array.isArray(assignment.rubric) && assignment.rubric.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-3">Grading Rubric</h2>
              <div className="overflow-x-auto rounded-xl border border-divider">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider">
                      <th className="text-left py-3 px-4 font-semibold">Criterion</th>
                      <th className="text-left py-3 px-4 font-semibold">Description</th>
                      <th className="text-right py-3 px-4 font-semibold">Max Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider">
                    {assignment.rubric.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 px-4 font-semibold text-on-surface">{row.criterion}</td>
                        <td className="py-3 px-4 text-body-secondary">{row.description}</td>
                        <td className="py-3 px-4 text-right font-bold text-primary">{row.maxPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submission Section */}
      {submitted && existingSubmission ? (
        <div className="bg-surface rounded-2xl border border-success/30 brand-shadow p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Already Submitted</h2>
          <p className="text-body-secondary mb-6">
            Your assignment was submitted on {new Date(existingSubmission.submittedAt || new Date()).toLocaleString()}.
          </p>
          
          {existingSubmission.fileUrl && (
            <a href={existingSubmission.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-full max-w-sm mx-auto mb-6 gap-2 px-4 py-3 bg-surface-container-low rounded-xl text-primary hover:bg-surface-container transition-colors font-medium border border-divider">
               <Paperclip className="w-5 h-5" /> View Submitted File
            </a>
          )}
          {existingSubmission.grade !== null && existingSubmission.grade !== undefined && (
             <div className="w-full max-w-md mx-auto mb-6 p-5 bg-primary/5 border border-primary/20 rounded-xl">
               <p className="text-sm text-body-secondary font-semibold uppercase mb-1">Grade</p>
               <p className="text-3xl font-bold text-primary mb-3">{existingSubmission.grade} <span className="text-lg text-primary/70">/ {assignment.maxMarks}</span></p>
               {existingSubmission.feedback && (
                 <div className="p-3 bg-white rounded-lg border border-divider text-left">
                    <p className="text-xs text-body-secondary font-bold uppercase mb-1">Feedback</p>
                    <p className="text-sm text-on-surface italic">"{existingSubmission.feedback}"</p>
                 </div>
               )}
             </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button 
              onClick={() => { setSubmitted(false); setExistingSubmission(null); }} 
              className="text-sm font-semibold text-primary hover:underline"
            >
              Submit Again (Overwrite)
            </button>
            <Link
              href="/student/assignments"
              className="inline-flex items-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Assignments
            </Link>
          </div>
        </div>
      ) : submitted ? (
        <div className="bg-surface rounded-2xl border border-success/30 brand-shadow p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Submitted Successfully!</h2>
          <p className="text-body-secondary mb-6">
            Your assignment has been submitted. Your teacher will review it and provide feedback soon.
          </p>
          <Link
            href="/student/assignments"
            className="inline-flex items-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Assignments
          </Link>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-divider brand-shadow overflow-hidden">
          <div className="p-5 border-b border-divider bg-surface-container-low flex items-center gap-3">
            <Upload className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-heading-on-light">Submit Your Work</h2>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-divider">
            {(['file', 'text'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  tab === t
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-body-secondary hover:text-on-surface'
                }`}
              >
                {t === 'file' ? <Paperclip className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                {t === 'file' ? 'Upload File' : 'Text Submission'}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {tab === 'file' ? (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES}
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                {/* Drop zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all select-none ${
                    dragging
                      ? 'border-primary bg-primary/10 scale-[1.01]'
                      : 'border-divider hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragging ? 'text-primary' : 'text-icon-inactive'}`} />
                  <p className="font-semibold text-on-surface mb-1">
                    {dragging ? 'Drop your file here' : 'Drag & drop or click to browse'}
                  </p>
                  <p className="text-sm text-body-secondary">
                    PDF, DOC, DOCX, ZIP, TXT, code files · Max {MAX_FILE_SIZE_MB}MB
                  </p>
                </div>

                {/* Selected file chip */}
                {selectedFile && (
                  <div className="flex items-center gap-3 p-4 bg-success-bg border border-success/20 rounded-xl">
                    <Paperclip className="w-5 h-5 text-success shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-success truncate">{selectedFile.name}</p>
                      <p className="text-xs text-success/70">{formatBytes(selectedFile.size)}</p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="p-1 hover:bg-success/20 rounded-full transition-colors text-success"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-on-surface">
                  Your Answer / Essay
                </label>
                <textarea
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  rows={12}
                  placeholder="Type your answer here... (minimum 10 characters)"
                  className="w-full border border-divider rounded-xl px-4 py-3 bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container resize-y text-sm leading-relaxed"
                />
                <div className="flex justify-between text-xs text-body-secondary">
                  <span>{textContent.length} characters</span>
                  <span>{wordCount} words</span>
                </div>
              </div>
            )}

            {/* Actions */}
            {submitting && uploadProgress > 0 && (
              <div className="mt-4 mb-2">
                <div className="flex justify-between text-xs text-body-secondary mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <Link
                href="/student/assignments"
                className="px-5 py-2.5 text-sm font-semibold text-body-secondary border border-divider rounded-xl hover:bg-surface-container-low transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={submitting || (tab === 'file' ? !selectedFile : textContent.trim().length < 10)}
                className="px-6 py-2.5 primary-gradient text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Submit Assignment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
