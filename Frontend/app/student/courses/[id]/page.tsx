import Link from 'next/link';

export default function CourseContent() {
  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Left Panel: Navigator (Desktop) */}
      <aside className="hidden lg:flex flex-col w-[300px] bg-neutral-bg border-r border-divider shrink-0 overflow-y-auto custom-scrollbar h-[calc(100vh-140px-64px)] sticky top-0">
        <div className="px-6 py-4 border-b border-divider/50 bg-neutral-bg/80 backdrop-blur sticky top-0 z-10">
          <h3 className="text-evergreen text-[16px] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            Course Content
          </h3>
        </div>
        <div className="flex-1 pb-20">
          {/* Module 1 (Expanded) */}
          <div className="module-group">
            <div className="px-6 py-3 bg-white/50 border-b border-divider flex justify-between items-center cursor-pointer hover:bg-white/80 transition-colors">
              <span className="font-medium text-sm text-on-surface">Module 1: Introduction to Programming</span>
              <span className="material-symbols-outlined text-icon-inactive text-sm transition-transform duration-200">keyboard_arrow_down</span>
            </div>
            <div className="module-items bg-white/30">
              {/* Completed Lesson */}
              <div className="px-8 py-3 text-sm text-success flex items-center gap-3 border-l-4 border-transparent hover:bg-white/50 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-medium">1.1 What is Programming?</span>
              </div>
              {/* Completed Lesson */}
              <div className="px-8 py-3 text-sm text-success flex items-center gap-3 border-l-4 border-transparent hover:bg-white/50 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-medium">1.2 Basic Concepts</span>
              </div>
              {/* Active Lesson */}
              <div className="px-8 py-3 text-sm text-evergreen font-semibold bg-[#eff3e7] border-l-4 border-primary-container flex items-center gap-3 cursor-default shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
                <span className="material-symbols-outlined text-[18px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                <span>1.3 Variables</span>
              </div>
              {/* Locked Lesson */}
              <div className="px-8 py-3 text-sm text-placeholder flex items-center gap-3 border-l-4 border-transparent">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>1.4 Functions</span>
              </div>
            </div>
          </div>
          {/* Module 2 (Locked) */}
          <div className="module-group">
            <div className="px-6 py-3 border-b border-divider flex justify-between items-center bg-neutral-bg">
              <span className="font-medium text-sm text-placeholder">Module 2: Data Structures</span>
              <span className="material-symbols-outlined text-placeholder text-sm">lock</span>
            </div>
          </div>
        </div>
        {/* Bottom Progress Sticky */}
        <div className="mt-auto border-t border-divider bg-neutral-bg p-6 pb-8 sticky bottom-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-medium text-body-secondary mb-3 flex justify-between">
            <span>Course Progress</span>
            <span>5 of 12 lessons</span>
          </div>
          <div className="h-2 bg-border-light rounded-full overflow-hidden w-full">
            <div className="h-full bg-gradient-to-r from-[#90a955] to-[#4f772d] w-[42%] rounded-full shadow-inner"></div>
          </div>
        </div>
      </aside>

      {/* Right Panel: Content Viewer */}
      <section className="flex-1 bg-white p-6 md:p-10 overflow-y-auto h-[calc(100vh-140px-64px)]">
        <div className="max-w-4xl mx-auto pb-24">
          {/* Video Player Container (Bento style) */}
          <div className="bg-white rounded-xl border border-divider shadow-[0_4px_12px_rgba(19,42,19,0.08)] relative overflow-hidden mb-8">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#90a955] to-[#4f772d] z-10"></div>
            <div className="aspect-video bg-evergreen relative overflow-hidden group">
              {/* Large Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 hover:scale-110 transition-transform shadow-lg">
                  <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </div>
              </div>
              {/* Mock Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-4 text-white">
                  <span className="material-symbols-outlined cursor-pointer hover:text-lime-cream">pause</span>
                  <div className="text-xs font-mono">04:12 / 15:30</div>
                  <div className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer relative">
                    <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#90a955] to-[#4f772d] w-[30%] rounded-full shadow-[0_0_8px_rgba(144,169,85,0.8)]"></div>
                    <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                  </div>
                  <span className="material-symbols-outlined cursor-pointer hover:text-lime-cream text-sm">volume_up</span>
                  <span className="material-symbols-outlined cursor-pointer hover:text-lime-cream text-sm">fullscreen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Details */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-1 bg-info-bg text-info text-xs font-semibold rounded uppercase tracking-wider">Video Lesson</span>
              <span className="text-body-secondary text-sm flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 15 mins</span>
            </div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-evergreen mb-4 leading-[1.2]">Variables in Python</h1>
            <p className="text-[16px] text-[#444444] max-w-3xl leading-relaxed">
              In this lesson, we explore how to store and manipulate data using variables. We&apos;ll cover naming conventions, data types, and assignment operators in Python, building a solid foundation for your programming journey.
            </p>
          </div>

          {/* Resources Grid */}
          <div className="mb-12">
            <h3 className="text-[20px] font-semibold text-evergreen mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">folder_open</span> Learning Resources
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Resource Card 1 */}
              <div className="bg-[#eff3e7] p-4 rounded-xl flex items-center gap-4 border border-[#c8d4aa] hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-10 h-10 rounded bg-white flex items-center justify-center shadow-sm text-primary-container group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold text-evergreen">Variables_Notes.pdf</div>
                  <div className="text-xs text-body-secondary">PDF Document • 2.4 MB</div>
                </div>
                <span className="text-primary-container font-bold text-sm hover:underline flex items-center">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </span>
              </div>
              {/* Resource Card 2 */}
              <div className="bg-surface p-4 rounded-xl flex items-center gap-4 border border-border-light hover:border-[#c8d4aa] hover:shadow-md transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded bg-white flex items-center justify-center shadow-sm text-info group-hover:scale-105 transition-transform border border-border-light">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold text-evergreen">Practice_Exercise.py</div>
                  <div className="text-xs text-body-secondary">Python Script • 4 KB</div>
                </div>
                <span className="text-info font-bold text-sm hover:underline flex items-center">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex justify-center md:justify-start mb-16">
            <button className="bg-gradient-to-b from-[#3a6633] to-[#31572c] text-white px-8 h-[48px] rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all focus:ring-2 focus:ring-primary-container focus:ring-offset-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Mark as Complete
            </button>
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-divider/60">
            <button className="flex items-center gap-2 text-primary-container font-medium hover:text-secondary hover:-translate-x-1 transition-all group">
              <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">arrow_back</span>
              <span className="hidden sm:inline">Previous Lesson</span>
              <span className="sm:hidden">Previous</span>
            </button>
            <button className="bg-gradient-to-b from-[#3a6633] to-[#31572c] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow hover:shadow-md hover:translate-x-1 transition-all group">
              <span className="hidden sm:inline">Next Lesson</span>
              <span className="sm:hidden">Next</span>
              <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
