import React from 'react';

export default function ApplyPage() {
  return (
    <>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-divider pb-4">
        <div>
          <nav className="text-body-secondary text-sm mb-2 font-medium">
            <ol className="flex items-center gap-2">
              <li><a href="#" className="hover:text-primary transition-colors">Enrollment</a></li>
              <li className="text-divider">/</li>
              <li className="text-primary font-semibold">New Application</li>
            </ol>
          </nav>
          <h1 className="text-[28px] font-bold text-evergreen m-0 p-0">Apply for Enrollment</h1>
        </div>
        <div className="inline-flex items-center gap-2 bg-warning-bg text-[#8a6521] px-4 py-1.5 rounded-full text-[12px] font-medium border border-[#8a6521]/20">
          <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span>
          Application Status: Pending Review
        </div>
      </header>

      {/* Stepper */}
      <div className="w-full py-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between min-w-[600px] relative">
          {/* Progress Line Background */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-light -z-10 -translate-y-1/2"></div>
          {/* Progress Line Active */}
          <div className="absolute top-1/2 left-0 w-[75%] h-0.5 bg-success -z-10 -translate-y-1/2"></div>
          
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2 bg-page-bg px-2">
            <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center shrink-0 border-2 border-page-bg">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
            <span className="text-xs font-semibold text-[#444444]">1. Personal Info</span>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2 bg-page-bg px-2">
            <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center shrink-0 border-2 border-page-bg">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
            <span className="text-xs font-semibold text-[#444444]">2. Academic Background</span>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2 bg-page-bg px-2">
            <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center shrink-0 border-2 border-page-bg">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
            <span className="text-xs font-semibold text-[#444444]">3. Program Selection</span>
          </div>
          {/* Step 4 Active */}
          <div className="flex flex-col items-center gap-2 bg-page-bg px-2">
            <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0 border-2 border-page-bg ring-4 ring-primary-container/20">
              <span className="text-sm font-bold">4</span>
            </div>
            <span className="text-xs font-bold text-primary-container">4. Documents</span>
          </div>
        </div>
      </div>

      {/* Main Form Card & Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents Upload Area */}
        <div className="lg:col-span-2 bg-white rounded-[12px] border border-divider shadow-[0_4px_6px_-1px_rgba(19,42,19,0.08)] p-6 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success to-primary-container"></div>
          <div>
            <h2 className="text-[20px] font-semibold text-evergreen mb-1">Required Documents</h2>
            <p className="text-body-secondary text-sm">Please upload clear, legible copies of the following documents. Maximum file size is 10MB per document.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doc 1: National ID (Completed) */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-on-surface font-semibold flex items-center justify-between">
                National ID / CNIC
                <span className="text-success flex items-center gap-1 text-[10px]"><span className="material-symbols-outlined text-sm">check_circle</span> Uploaded</span>
              </label>
              <div className="relative w-full h-32 rounded-lg border-2 border-success bg-success-bg/30 flex flex-col items-center justify-center text-center p-4">
                <span className="material-symbols-outlined text-success mb-2 text-3xl">task</span>
                <span className="text-sm font-medium text-success">id_card_front_back.pdf</span>
                <span className="text-xs text-body-secondary mt-1">2.4 MB</span>
                <button className="absolute top-2 right-2 text-icon-inactive hover:text-error transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>

            {/* Doc 2: Academic Certificates (Completed) */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-on-surface font-semibold flex items-center justify-between">
                Academic Certificates
                <span className="text-success flex items-center gap-1 text-[10px]"><span className="material-symbols-outlined text-sm">check_circle</span> Uploaded</span>
              </label>
              <div className="relative w-full h-32 rounded-lg border-2 border-success bg-success-bg/30 flex flex-col items-center justify-center text-center p-4">
                <span className="material-symbols-outlined text-success mb-2 text-3xl">task</span>
                <span className="text-sm font-medium text-success">highschool_transcript.pdf</span>
                <span className="text-xs text-body-secondary mt-1">4.1 MB</span>
                <button className="absolute top-2 right-2 text-icon-inactive hover:text-error transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>

            {/* Doc 3: Passport Photo (Pending) */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-on-surface font-semibold flex items-center justify-between">
                Passport Photo
                <span className="text-error text-[10px] font-medium">* Required</span>
              </label>
              <div className="w-full h-32 rounded-lg border-2 border-dashed border-[#90a955] bg-[#eff3e7] flex flex-col items-center justify-center text-center p-4 cursor-pointer relative overflow-hidden group hover:bg-[#e6ece2] transition-colors">
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <span className="material-symbols-outlined text-primary-container mb-2 text-3xl group-hover:scale-110 transition-transform">cloud_upload</span>
                <span className="text-sm font-medium text-primary-container">Click to upload or drag & drop</span>
                <span className="text-xs text-body-secondary mt-1">PNG, JPG up to 5MB</span>
              </div>
            </div>

            {/* Doc 4: Recommendation Letter (Pending/Optional) */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-on-surface font-semibold flex items-center justify-between">
                Recommendation Letter
                <span className="text-body-secondary text-[10px] font-medium">(Optional)</span>
              </label>
              <div className="w-full h-32 rounded-lg border-2 border-dashed border-[#90a955] bg-[#eff3e7] flex flex-col items-center justify-center text-center p-4 cursor-pointer relative overflow-hidden group hover:bg-[#e6ece2] transition-colors">
                <input type="file" accept=".pdf,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <span className="material-symbols-outlined text-primary-container mb-2 text-3xl group-hover:scale-110 transition-transform">cloud_upload</span>
                <span className="text-sm font-medium text-primary-container">Click to upload or drag & drop</span>
                <span className="text-xs text-body-secondary mt-1">PDF, DOCX up to 10MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Tracker / Action Area */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Application Tracker */}
          <div className="bg-white rounded-[12px] border border-divider shadow-[0_4px_6px_-1px_rgba(19,42,19,0.08)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-semibold text-evergreen">App Timeline</h3>
              <span className="text-xs font-bold text-evergreen bg-surface-container-high px-2 py-1 rounded">APP-2026-00142</span>
            </div>
            
            <div className="relative pl-6 border-l-2 border-border-light space-y-8">
              {/* Step 1 Complete */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-success flex items-center justify-center ring-4 ring-white">
                  <span className="material-symbols-outlined text-[10px] text-white">check</span>
                </div>
                <h4 className="text-sm font-semibold text-on-surface leading-none">Application Submitted</h4>
                <p className="text-xs text-body-secondary mt-1">15 Jul 2026, 09:42 AM</p>
              </div>
              {/* Step 2 Current */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-warning flex items-center justify-center ring-4 ring-white">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </div>
                <div className="absolute -left-[26px] bottom-full w-0.5 h-8 bg-success"></div>
                <h4 className="text-sm font-semibold text-warning leading-none">Under Review</h4>
                <p className="text-xs text-body-secondary mt-1">Admissions team is verifying documents.</p>
              </div>
              {/* Step 3 Upcoming */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-divider flex items-center justify-center ring-4 ring-white"></div>
                <h4 className="text-sm font-semibold text-body-secondary leading-none">Decision</h4>
                <p className="text-xs text-divider mt-1">Pending verification</p>
              </div>
              {/* Step 4 Upcoming */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-divider flex items-center justify-center ring-4 ring-white"></div>
                <h4 className="text-sm font-semibold text-body-secondary leading-none">Enrolled / Account Created</h4>
              </div>
            </div>
          </div>
          
          {/* Bottom Nav / Actions */}
          <div className="bg-white rounded-[12px] border border-divider shadow-[0_4px_6px_-1px_rgba(19,42,19,0.08)] p-6 flex flex-col gap-4 sticky top-6">
            <button className="w-full bg-gradient-to-r from-[#132A13] to-[#31572c] text-white font-semibold h-[52px] rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
              Submit Application
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
            <button className="w-full bg-transparent text-evergreen border border-evergreen/30 hover:bg-evergreen/5 font-semibold h-[52px] rounded-lg transition-all flex items-center justify-center gap-2">
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
