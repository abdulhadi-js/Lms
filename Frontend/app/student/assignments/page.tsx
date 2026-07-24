import Link from 'next/link';

export default function MyAssignments() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 w-full">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-evergreen mb-4">My Assignments</h1>
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-1.5 rounded-full bg-primary-container text-white text-[12px] font-medium transition-colors border border-primary-container">
              All
            </button>
            <button className="px-4 py-1.5 rounded-full bg-surface text-body-secondary text-[12px] font-medium hover:bg-surface-container-low transition-colors border border-border-light">
              Pending
            </button>
            <button className="px-4 py-1.5 rounded-full bg-surface text-body-secondary text-[12px] font-medium hover:bg-surface-container-low transition-colors border border-border-light">
              Submitted
            </button>
            <button className="px-4 py-1.5 rounded-full bg-surface text-body-secondary text-[12px] font-medium hover:bg-surface-container-low transition-colors border border-border-light">
              Graded
            </button>
          </div>
        </div>
        {/* Optional Actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-divider rounded-lg text-primary hover:bg-surface-container-low transition-colors text-[12px] font-medium">
            <span className="material-symbols-outlined text-[18px]">sort</span>
            Sort by Due Date
          </button>
        </div>
      </div>

      {/* Assignments List (Bento-inspired Grid layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Overdue */}
        <article className="bg-surface rounded-xl shadow-[0_4px_12px_rgba(19,42,19,0.08)] border border-divider border-l-[5px] border-l-error p-5 flex flex-col h-full hover:-translate-y-1 transition-transform duration-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wider text-body-secondary uppercase">CS101</span>
              <h2 className="text-[20px] font-semibold text-heading-on-light">Assignment 2 — Basic Algorithms</h2>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-warning-bg text-[#8a6521]">Pending</span>
          </div>
          <p className="text-[14px] text-body-secondary line-clamp-2 mb-4 flex-grow">
            Implement sorting algorithms (Bubble, Merge, Quick) in Python and compare their time complexities using provided datasets. Ensure comprehensive test coverage.
          </p>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-error text-[18px]">error</span>
            <span className="text-[12px] font-semibold text-error">Due 2 days ago</span>
          </div>
          <div className="mt-auto">
            <Link href="/student/assignments/1" className="w-full bg-gradient-to-br from-[#1a3f17] to-[#31572c] text-white font-semibold text-[16px] py-2.5 rounded-lg hover:shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary flex justify-center items-center gap-2">
              Submit Assignment
              <span className="material-symbols-outlined text-[18px]">upload</span>
            </Link>
          </div>
        </article>

        {/* Card 2: Due Soon */}
        <article className="bg-surface rounded-xl shadow-[0_4px_12px_rgba(19,42,19,0.08)] border border-divider border-l-[5px] border-l-warning p-5 flex flex-col h-full hover:-translate-y-1 transition-transform duration-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wider text-body-secondary uppercase">CS101</span>
              <h2 className="text-[20px] font-semibold text-heading-on-light">Assignment 3 — Python Functions</h2>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-warning-bg text-[#8a6521]">Pending</span>
          </div>
          <p className="text-[14px] text-body-secondary line-clamp-2 mb-4 flex-grow">
            Create a series of reusable functions demonstrating scope, default arguments, and lambda functions. Review the rubric for specific docstring requirements.
          </p>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-warning text-[18px]">schedule</span>
              <span className="text-[12px] font-semibold text-warning">Due in 3 days</span>
            </div>
            <button className="flex items-center gap-1 text-primary hover:text-success transition-colors text-[12px] font-semibold underline underline-offset-2">
              <span className="material-symbols-outlined text-[16px]">description</span>
              View Rubric
            </button>
          </div>
          <div className="mt-auto">
            <Link href="/student/assignments/2" className="w-full bg-gradient-to-br from-[#1a3f17] to-[#31572c] text-white font-semibold text-[16px] py-2.5 rounded-lg hover:shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary flex justify-center items-center gap-2">
              Submit Assignment
              <span className="material-symbols-outlined text-[18px]">upload</span>
            </Link>
          </div>
        </article>

        {/* Card 3: Submitted */}
        <article className="bg-surface rounded-xl shadow-[0_4px_12px_rgba(19,42,19,0.08)] border border-divider border-l-[5px] border-l-success p-5 flex flex-col h-full hover:-translate-y-1 transition-transform duration-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wider text-body-secondary uppercase">CS101</span>
              <h2 className="text-[20px] font-semibold text-heading-on-light">Lab 1 — Setup Environment</h2>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#eff3e7] text-[#4f5d2f]">Submitted</span>
          </div>
          <p className="text-[14px] text-body-secondary line-clamp-2 mb-4 flex-grow">
            Install necessary IDEs and dependencies for the course. Submit a screenshot of the &apos;Hello World&apos; output in your chosen terminal.
          </p>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
            <span className="text-[12px] font-semibold text-success">Submitted on time</span>
          </div>
          <div className="mt-auto">
            <button className="w-full border-2 border-[#31572c] text-[#31572c] font-semibold text-[16px] py-2 rounded-lg hover:bg-[#31572c]/5 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary flex justify-center items-center gap-2">
              View Submission
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </button>
          </div>
        </article>

        {/* Card 4: Graded */}
        <article className="bg-surface rounded-xl shadow-[0_4px_12px_rgba(19,42,19,0.08)] border border-divider border-l-[5px] border-l-success p-5 flex flex-col h-full hover:-translate-y-1 transition-transform duration-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wider text-body-secondary uppercase">CS101</span>
              <h2 className="text-[20px] font-semibold text-heading-on-light">Introduction Quiz</h2>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-success-bg text-success font-semibold text-xs border border-success/20">
              <span className="material-symbols-outlined text-[14px]">military_tech</span>
              <span>Graded — 78/100</span>
            </div>
          </div>
          <p className="text-[14px] text-body-secondary line-clamp-2 mb-4 flex-grow">
            Multiple choice quiz covering syllabus, basic programming concepts, and academic integrity policies.
          </p>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-icon-inactive text-[18px]">history</span>
            <span className="text-[12px] text-body-secondary font-medium">Graded on Oct 12</span>
          </div>
          <div className="mt-auto">
            <Link href="/student/assignments/3/feedback" className="w-full border-2 border-success text-success font-semibold text-[16px] py-2 rounded-lg hover:bg-success/5 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-success flex justify-center items-center gap-2">
              View Feedback
              <span className="material-symbols-outlined text-[18px]">rate_review</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
