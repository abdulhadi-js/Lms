"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { assignmentsApi } from '@/lib/api';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  weightPercent: number;
  rubric?: Array<{
    criterion: string;
    description: string;
    maxPoints: number;
  }>;
}

export default function AssignmentSubmission() {
  const { id } = useParams() as { id: string };
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const data = await assignmentsApi.get(id);
        setAssignment(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await assignmentsApi.submit(id, { textContent, fileUrl: '' });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-8 px-4 md:px-8 pb-12 w-full max-w-[1280px] mx-auto flex-1 flex flex-col">
        {/* Skeleton Breadcrumb */}
        <div className="h-4 bg-surface-container-high rounded w-48 mb-6 animate-pulse"></div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/5 flex flex-col space-y-6">
            <div className="h-10 bg-surface-container-high rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-6 bg-surface-container-high rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="h-32 bg-surface-container-high rounded w-full animate-pulse"></div>
            <div className="h-48 bg-surface-container-high rounded w-full animate-pulse"></div>
          </div>
          <div className="lg:w-3/5">
            <div className="bg-white rounded-xl border border-divider shadow-sm p-8 h-[600px] flex flex-col animate-pulse">
               <div className="h-8 bg-surface-container-high rounded w-1/3 mb-6"></div>
               <div className="h-40 bg-surface-container-high rounded w-full mb-6"></div>
               <div className="h-32 bg-surface-container-high rounded w-full mb-6"></div>
               <div className="mt-auto h-12 bg-surface-container-high rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error && !assignment) return <div className="p-8 text-error">Error: {error}</div>;
  if (!assignment) return <div className="p-8 text-on-surface">Assignment not found.</div>;

  const dueDate = new Date(assignment.dueDate);
  const isPastDue = new Date() > dueDate;

  return (
    <div className="pt-8 px-4 md:px-8 pb-12 w-full max-w-[1280px] mx-auto flex-1 flex flex-col">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-body-secondary mb-6 font-medium">
        <ol className="flex items-center space-x-2">
          <li><Link href="/student/assignments" className="hover:text-primary transition-colors">Assignments</Link></li>
          <li><span className="material-symbols-outlined text-sm mx-1">chevron_right</span></li>
          <li className="text-on-background">{assignment.title}</li>
        </ol>
      </nav>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN: Details (40%) */}
        <div className="lg:w-2/5 flex flex-col space-y-6">
          {/* Assignment Header Info */}
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-heading-on-light mb-4 leading-tight">{assignment.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className={`flex items-center px-3 py-1.5 rounded-full border text-[12px] font-medium ${isPastDue ? 'bg-error-bg text-error border-error-container' : 'bg-success-bg text-[#466d24] border-secondary-fixed'}`}>
                <span className="material-symbols-outlined text-[18px] mr-1.5">{isPastDue ? 'error' : 'check_circle'}</span>
                {isPastDue ? 'Past Due' : 'Active'}
              </div>
              <div className="flex items-center text-body-secondary text-[14px]">
                <span className="material-symbols-outlined text-[18px] mr-1.5">calendar_month</span>
                Due: {dueDate.toLocaleString()}
              </div>
            </div>
            
            <div className="flex items-center text-on-surface text-[14px]">
              <span className="font-semibold mr-2">Max Marks:</span> {assignment.maxMarks} ({assignment.weightPercent}% weight)
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none text-on-surface text-[14px] whitespace-pre-wrap">
            {assignment.description}
          </div>

          {/* Rubric Table */}
          {assignment.rubric && assignment.rubric.length > 0 && (
            <div>
              <h3 className="text-[20px] font-semibold text-heading-on-light mb-3">Rubric</h3>
              <div className="overflow-x-auto rounded-lg border border-border-light shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-primary-container text-on-primary">
                      <th className="px-4 py-3 text-[14px] font-semibold">Criteria</th>
                      <th className="px-4 py-3 text-[14px] font-semibold text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] text-on-background divide-y divide-border-light">
                    {assignment.rubric.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-surface-container-low"}>
                        <td className="px-4 py-3">
                          <div className="font-medium">{item.criterion}</div>
                          <div className="text-xs text-body-secondary mt-1">{item.description}</div>
                        </td>
                        <td className="px-4 py-3 text-right">{item.maxPoints}</td>
                      </tr>
                    ))}
                    <tr className="bg-lime-cream text-evergreen font-semibold border-t-2 border-primary-container/20">
                      <td className="px-4 py-3">Total</td>
                      <td className="px-4 py-3 text-right">{assignment.rubric.reduce((acc, curr) => acc + curr.maxPoints, 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Submission Panel (60%) */}
        <div className="lg:w-3/5">
          <div className="bg-white rounded-xl border border-divider shadow-[0_4px_12px_rgba(19,42,19,0.08)] overflow-hidden flex flex-col h-full sticky top-24 relative">
            {/* Top Accent Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#4f772d] to-[#ecf39e]"></div>
            
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h2 className="text-[28px] font-bold text-heading-on-light mb-6 flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary text-3xl">upload_file</span>
                Submit Your Work
              </h2>

              {success ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#4f772d] bg-success-bg rounded-xl">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-secondary-fixed">
                    <span className="material-symbols-outlined text-[40px] text-[#466d24]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <h3 className="text-xl font-bold text-evergreen mb-2">Submission Successful!</h3>
                  <p className="text-sm text-body-secondary mb-6">Your assignment has been submitted successfully and is pending grading.</p>
                  <button onClick={() => setSuccess(false)} className="px-6 py-2 border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors">
                    Submit another response
                  </button>
                </div>
              ) : (
                <div className="flex flex-col flex-1">
                  {/* Upload Zone */}
                  <div className="mb-6">
                    <label className="block text-[14px] font-medium text-on-background mb-2">Upload Files</label>
                    <div className="border-2 border-dashed border-[#4f772d] bg-success-bg rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#e1e9db] transition-colors relative group">
                      <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-secondary text-3xl">cloud_upload</span>
                      </div>
                      <p className="text-[14px] text-on-background font-medium mb-1">Drag and drop files here</p>
                      <p className="text-[12px] text-body-secondary">or click to browse from your computer</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-[14px] font-medium text-on-background mb-2">Text Content (Optional)</label>
                    <textarea 
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="w-full border border-divider rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[150px]"
                      placeholder="Type your answer here..."
                    />
                  </div>

                  {error && <div className="text-error text-sm mb-4">{error}</div>}

                  {/* Submit Button */}
                  <div className="mt-auto pt-6 flex gap-3">
                    <button className="flex-1 bg-white border border-outline-variant text-on-surface font-semibold py-3 px-6 rounded-lg hover:bg-surface-container-low transition-colors text-sm">
                      Cancel
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-[#4f772d] to-[#3a5a22] text-white font-semibold py-3 px-6 rounded-lg hover:shadow-md transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {submitting ? (
                         <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">send</span>
                      )}
                      {submitting ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
