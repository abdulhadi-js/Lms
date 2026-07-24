import Link from 'next/link';

export default function AssignmentFeedback() {
  return (
    <div className="pt-8 px-4 md:px-8 pb-12 w-full max-w-[900px] mx-auto flex-1 flex flex-col space-y-8">
      {/* Breadcrumb (Mobile) */}
      <div className="md:hidden flex items-center gap-2 text-on-surface-variant text-[14px] mb-4">
        <Link href="/student/assignments" className="hover:text-primary transition-colors">Assignments</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface font-semibold">Introduction Quiz</span>
      </div>

      {/* Success Banner */}
      <div className="bg-success-bg rounded-xl p-4 flex items-center gap-3 border border-[#c6dfb4]">
        <span className="material-symbols-outlined text-success">check_circle</span>
        <h2 className="text-[20px] font-semibold text-primary">Assignment Graded</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Score Section */}
        <div className="md:col-span-1">
          <div className="bg-surface rounded-xl p-6 border border-divider shadow-sm sticky top-24">
            <h3 className="text-[20px] font-semibold text-on-surface mb-2">Total Score</h3>
            
            <div className="flex items-end gap-4 mb-4">
              <span className="text-[40px] font-bold text-evergreen leading-none">
                78<span className="text-2xl text-on-surface-variant">/100</span>
              </span>
              <span className="px-4 py-1 bg-[#eff3e7] text-[#4f5d2f] font-bold text-lg rounded-full">B</span>
            </div>
            
            <p className="text-[14px] text-body-secondary mb-6">Graded on Oct 24, 2026</p>
            
            <h4 className="text-[12px] uppercase tracking-wider text-on-surface-variant mb-2 font-medium">Submitted File</h4>
            <button className="flex w-full items-center gap-2 p-3 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors border border-border-light group">
              <span className="material-symbols-outlined text-primary">description</span>
              <span className="text-[14px] text-primary truncate group-hover:underline">intro_quiz_answers.pdf</span>
            </button>
          </div>
        </div>

        {/* Feedback & Rubric Section */}
        <div className="md:col-span-2 space-y-8">
          {/* Teacher Feedback */}
          <div className="bg-page-bg rounded-r-xl p-6 border-l-4 border-l-primary-container shadow-sm border border-y-divider border-r-divider">
            <h3 className="text-[20px] font-semibold text-primary mb-3">Prof. Ali&apos;s Feedback:</h3>
            <p className="text-[16px] text-on-surface italic text-gray-700">&quot;Great start on the fundamental concepts. Pay closer attention to the logic flow in section 3.&quot;</p>
          </div>

          {/* Rubric Table */}
          <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
            <div className="p-6 border-b border-divider bg-surface-container-lowest">
              <h3 className="text-[20px] font-semibold text-on-surface">Detailed Rubric</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-divider">
                  <tr>
                    <th className="p-4 text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Criterion</th>
                    <th className="p-4 text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider text-right">Marks Obtained</th>
                    <th className="p-4 text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider text-right">Max Marks</th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  <tr className="border-b border-divider last:border-b-0 hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 font-medium text-on-surface">Logic Flow & Reasoning</td>
                    <td className="p-4 text-right text-warning font-semibold">22</td>
                    <td className="p-4 text-right text-on-surface-variant">30</td>
                  </tr>
                  <tr className="border-b border-divider last:border-b-0 hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 font-medium text-on-surface">Documentation</td>
                    <td className="p-4 text-right text-success font-semibold">18</td>
                    <td className="p-4 text-right text-on-surface-variant">20</td>
                  </tr>
                  <tr className="border-b border-divider last:border-b-0 hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 font-medium text-on-surface">Efficiency & Execution</td>
                    <td className="p-4 text-right text-success font-semibold">38</td>
                    <td className="p-4 text-right text-on-surface-variant">50</td>
                  </tr>
                </tbody>
                <tfoot className="bg-surface-container-low border-t-2 border-divider">
                  <tr>
                    <td className="p-4 font-semibold text-on-surface text-right">Total:</td>
                    <td className="p-4 text-right text-evergreen font-bold">78</td>
                    <td className="p-4 text-right text-on-surface-variant">100</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
