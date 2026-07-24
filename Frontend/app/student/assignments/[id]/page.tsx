import Link from 'next/link';

export default function AssignmentSubmission() {
  return (
    <div className="pt-8 px-4 md:px-8 pb-12 w-full max-w-[1280px] mx-auto flex-1 flex flex-col">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-body-secondary mb-6 font-medium">
        <ol className="flex items-center space-x-2">
          <li><Link href="/student/assignments" className="hover:text-primary transition-colors">Assignments</Link></li>
          <li><span className="material-symbols-outlined text-sm mx-1">chevron_right</span></li>
          <li className="text-on-background">Assignment 3 — Python Functions</li>
        </ol>
      </nav>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN: Details (40%) */}
        <div className="lg:w-2/5 flex flex-col space-y-6">
          {/* Assignment Header Info */}
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-heading-on-light mb-4 leading-tight">Assignment 3 — Python Functions</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center px-3 py-1.5 bg-success-bg text-[#466d24] rounded-full border border-secondary-fixed text-[12px] font-medium">
                <span className="material-symbols-outlined text-[18px] mr-1.5">check_circle</span>
                Active
              </div>
              <div className="flex items-center text-body-secondary text-[14px]">
                <span className="material-symbols-outlined text-[18px] mr-1.5">calendar_month</span>
                Due: Sat 26 Jul 2026 11:59 PM
              </div>
            </div>
            
            <div className="flex items-center text-error font-bold text-[14px] bg-error-bg/50 px-4 py-2 rounded-lg inline-flex border border-error-container">
              <span className="material-symbols-outlined mr-2">timer</span>
              46h 12m remaining
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none text-on-surface text-[14px]">
            <p className="mb-3">In this assignment, you will demonstrate your understanding of Python functions, scope, and parameter passing. You are required to implement a set of utility functions described in the attached requirements document.</p>
            <p className="mb-3"><strong>Key Objectives:</strong></p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Define and call functions with positional and keyword arguments.</li>
              <li>Implement functions that return multiple values.</li>
              <li>Utilize docstrings for clear code documentation.</li>
              <li>Handle edge cases within function bodies.</li>
            </ul>
            <p>Please ensure your code passes all provided unit tests before submission.</p>
          </div>

          {/* File Attachments */}
          <div>
            <h3 className="text-[20px] font-semibold text-heading-on-light mb-3">Resources</h3>
            <div className="space-y-2">
              <button className="flex w-full items-center p-3 bg-success-bg rounded-lg border border-outline-variant hover:shadow-sm transition-shadow text-left">
                <div className="w-10 h-10 rounded bg-white flex items-center justify-center mr-3 shadow-sm">
                  <span className="material-symbols-outlined text-secondary">description</span>
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-on-background">Requirements_Spec.pdf</p>
                  <p className="text-[12px] text-body-secondary">PDF • 1.2 MB</p>
                </div>
                <span className="material-symbols-outlined text-icon-inactive">download</span>
              </button>
              
              <button className="flex w-full items-center p-3 bg-success-bg rounded-lg border border-outline-variant hover:shadow-sm transition-shadow text-left">
                <div className="w-10 h-10 rounded bg-white flex items-center justify-center mr-3 shadow-sm">
                  <span className="material-symbols-outlined text-secondary">code</span>
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-on-background">starter_code.zip</p>
                  <p className="text-[12px] text-body-secondary">ZIP • 45 KB</p>
                </div>
                <span className="material-symbols-outlined text-icon-inactive">download</span>
              </button>
            </div>
          </div>

          {/* Rubric Table */}
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
                  <tr className="bg-white">
                    <td className="px-4 py-3">Function Accuracy & Logic</td>
                    <td className="px-4 py-3 text-right">40</td>
                  </tr>
                  <tr className="bg-surface-container-low">
                    <td className="px-4 py-3">Code Style & PEP8</td>
                    <td className="px-4 py-3 text-right">20</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3">Documentation (Docstrings)</td>
                    <td className="px-4 py-3 text-right">20</td>
                  </tr>
                  <tr className="bg-surface-container-low">
                    <td className="px-4 py-3">Test Coverage</td>
                    <td className="px-4 py-3 text-right">20</td>
                  </tr>
                  <tr className="bg-lime-cream text-evergreen font-semibold border-t-2 border-primary-container/20">
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-right">100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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

              {/* Upload Zone */}
              <div className="mb-6">
                <label className="block text-[14px] font-medium text-on-background mb-2">Upload Files <span className="text-error">*</span></label>
                <div className="border-2 border-dashed border-[#4f772d] bg-success-bg rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#e1e9db] transition-colors relative group">
                  <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-secondary text-3xl">cloud_upload</span>
                  </div>
                  <p className="text-[14px] text-on-background font-medium mb-1">Drag and drop files here</p>
                  <p className="text-[12px] text-body-secondary">or click to browse from your computer</p>
                  <p className="text-[12px] text-placeholder mt-4">Max file size: 50MB. Allowed: .py, .zip, .pdf</p>
                </div>
              </div>

              {/* Uploaded File Preview */}
              <div className="mb-6">
                <h4 className="text-[12px] font-medium text-body-secondary mb-2 uppercase tracking-wide">Attached Files (1)</h4>
                <div className="flex items-center p-4 bg-surface rounded-lg border border-border-light shadow-sm group">
                  <div className="w-10 h-10 rounded bg-info-bg flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-info">data_object</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-on-background truncate">Functions_Assignment_Final.py</p>
                    <div className="flex items-center text-[12px] text-body-secondary mt-0.5">
                      <span>14 KB</span>
                      <span className="mx-2">•</span>
                      <span className="text-success flex items-center"><span className="material-symbols-outlined text-[14px] mr-1">check_circle</span> Uploaded successfully</span>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full hover:bg-error-bg text-icon-inactive hover:text-error flex items-center justify-center transition-colors ml-2 focus:outline-none focus:ring-2 focus:ring-error">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Textarea for notes */}
              <div className="mb-8 flex-1">
                <label htmlFor="submission-notes" className="block text-[14px] font-medium text-on-background mb-2">Submission Comments (Optional)</label>
                <textarea 
                  id="submission-notes"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border-light bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[14px] placeholder:text-placeholder resize-none"
                  placeholder="Add any notes or context for your instructor here..."
                ></textarea>
              </div>

              {/* Submit Action */}
              <div className="mt-auto pt-4 border-t border-divider">
                <button className="w-full py-4 rounded-lg bg-gradient-to-r from-[#1a3f17] to-[#31572c] text-white font-semibold text-[16px] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined mr-2">send</span>
                  Submit Assignment
                </button>
                <p className="text-center text-[12px] text-body-secondary mt-3">By submitting, you agree to the Academic Integrity Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
