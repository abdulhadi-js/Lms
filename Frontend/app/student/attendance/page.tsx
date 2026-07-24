export default function MyAttendance() {
  return (
    <div className="max-w-container-max mx-auto space-y-8 pb-12 pt-8 px-4 md:px-8 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-bold text-evergreen mb-1">My Attendance</h1>
        <p className="text-[14px] text-body-secondary">Track your attendance across all enrolled courses.</p>
      </div>

      {/* Overall Attendance Card */}
      <div className="bg-surface rounded-xl shadow-[0_4px_12px_rgba(19,42,19,0.08)] border border-divider relative overflow-hidden flex flex-col md:flex-row items-center p-6 gap-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#90a955] to-[#ecf39e]"></div>
        
        <div className="relative w-[120px] h-[120px] flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Track */}
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e4e4e4" strokeWidth="12"></circle>
            {/* Progress */}
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#90a955"></stop>
                <stop offset="100%" stopColor="#4f772d"></stop>
              </linearGradient>
            </defs>
            <circle 
              cx="60" cy="60" r="54" fill="none" 
              stroke="url(#gaugeGradient)" 
              strokeWidth="12" strokeLinecap="round" 
              strokeDasharray="339.29" strokeDashoffset="27.14"
              className="transition-all duration-1000 ease-in-out"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[20px] font-bold text-evergreen leading-none">92%</span>
            <span className="text-[12px] font-medium text-body-secondary mt-1">Overall</span>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4 w-full">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-success-bg px-4 py-2 rounded-full border border-success/20">
              <span className="material-symbols-outlined text-success text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-[14px] text-success font-medium">Present: 44 classes</span>
            </div>
            <div className="flex items-center gap-2 bg-error-bg px-4 py-2 rounded-full border border-error/20">
              <span className="material-symbols-outlined text-error text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
              <span className="text-[14px] text-error font-medium">Absent: 4</span>
            </div>
            <div className="flex items-center gap-2 bg-warning-bg px-4 py-2 rounded-full border border-warning/20">
              <span className="material-symbols-outlined text-warning text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <span className="text-[14px] text-warning font-medium">Late: 2</span>
            </div>
          </div>
          
          <div className="space-y-3 mt-2 w-full">
            {/* Good Status Banner */}
            <div className="bg-success-bg border-l-4 border-success p-3 rounded-r-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-[#375320] mt-0.5">verified</span>
              <p className="text-[14px] text-[#375320]">Your attendance is above the required 75% threshold. Keep it up! ✓</p>
            </div>
            {/* At Risk Status Banner Context */}
            <div className="bg-warning-bg border-l-4 border-warning p-3 rounded-r-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-warning mt-0.5">warning</span>
              <p className="text-[14px] text-warning">⚠️ Your attendance is 68% in CS201 — below the 75% requirement. Contact your teacher.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Course Attendance Cards Grid */}
      <div>
        <h2 className="text-[20px] font-semibold text-evergreen mb-4">Course Breakdown</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Good Standing */}
          <div className="bg-surface rounded-xl shadow-[0_4px_12px_rgba(19,42,19,0.08)] border border-divider p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success to-lime-cream"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[24px] font-semibold text-evergreen">CS101 — Intro to Programming</h3>
                <p className="text-[14px] text-body-secondary mt-1">Section A | Prof. Ali Raza</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-success-bg text-success border border-success/20">
                Good Standing
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-[14px] mb-1">
                <span className="text-evergreen font-medium">89% Attendance</span>
                <span className="text-body-secondary">Required: 75%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-success to-lime-cream rounded-full" style={{ width: '89%' }}></div>
                <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-error z-10"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-center text-[14px]">
              <div className="bg-neutral-bg p-2 rounded-lg"><span className="block text-success font-semibold">32</span><span className="text-xs text-body-secondary">Present</span></div>
              <div className="bg-neutral-bg p-2 rounded-lg"><span className="block text-error font-semibold">4</span><span className="text-xs text-body-secondary">Absent</span></div>
              <div className="bg-neutral-bg p-2 rounded-lg"><span className="block text-warning font-semibold">1</span><span className="text-xs text-body-secondary">Late</span></div>
              <div className="bg-neutral-bg p-2 rounded-lg"><span className="block text-evergreen font-semibold">37</span><span className="text-xs text-body-secondary">Total</span></div>
            </div>
          </div>

          {/* Card 2: At Risk */}
          <div className="bg-error-bg/30 rounded-xl shadow-[0_4px_12px_rgba(19,42,19,0.08)] border border-divider border-l-4 border-l-error p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[24px] font-semibold text-evergreen">CS202 — Data Structures</h3>
                <p className="text-[14px] text-body-secondary mt-1">Section B | Dr. Feynman</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-error-bg text-error border border-error/20">
                At Risk
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-[14px] mb-1">
                <span className="text-error font-bold">68% Attendance</span>
                <span className="text-body-secondary">Required: 75%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden relative">
                <div className="h-full bg-error rounded-full" style={{ width: '68%' }}></div>
                <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-on-background z-10"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-center text-[14px]">
              <div className="bg-surface p-2 rounded-lg border border-divider/50"><span className="block text-success font-semibold">22</span><span className="text-xs text-body-secondary">Present</span></div>
              <div className="bg-error-bg p-2 rounded-lg border border-error/20"><span className="block text-error font-semibold">10</span><span className="text-xs text-body-secondary">Absent</span></div>
              <div className="bg-surface p-2 rounded-lg border border-divider/50"><span className="block text-warning font-semibold">3</span><span className="text-xs text-body-secondary">Late</span></div>
              <div className="bg-surface p-2 rounded-lg border border-divider/50"><span className="block text-evergreen font-semibold">35</span><span className="text-xs text-body-secondary">Total</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
