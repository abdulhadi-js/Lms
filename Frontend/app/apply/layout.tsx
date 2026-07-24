export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-page-bg font-sans text-on-surface overflow-hidden">
      {/* TopNav */}
      <nav className="bg-primary dark:bg-evergreen text-on-primary dark:text-on-primary h-16 w-full fixed top-0 flex justify-between items-center px-4 md:px-8 shadow-md z-50">
        <div className="flex items-center gap-8">
          <div className="text-[20px] font-semibold text-on-primary">EduGrowth LMS</div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-on-primary/80 font-medium hover:text-lime-cream transition-colors">Dashboard</a>
            <a href="#" className="text-on-primary/80 font-medium hover:text-lime-cream transition-colors">Courses</a>
            <a href="#" className="text-on-primary font-bold border-b-2 border-lime-cream pb-1 hover:text-lime-cream transition-colors">Applications</a>
            <a href="#" className="text-on-primary/80 font-medium hover:text-lime-cream transition-colors">Resources</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-primary hover:text-lime-cream transition-colors hidden md:block">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-on-primary hover:text-lime-cream transition-colors hidden md:block">
            <span className="material-symbols-outlined">help</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-lime-cream/20 flex items-center justify-center overflow-hidden border border-lime-cream/30">
            <span className="text-sm font-bold text-lime-cream">ST</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex w-full max-w-[1280px] mx-auto mt-16 px-4 md:px-8 py-8 gap-8 overflow-hidden">
        {/* SideNav (Hidden on Mobile) */}
        <aside className="bg-evergreen dark:bg-surface-container-lowest text-primary dark:text-primary-fixed h-[calc(100vh-8rem)] w-64 hidden md:flex flex-col border-r border-divider shrink-0 rounded-xl overflow-y-auto shadow-lg p-4 gap-2 sticky top-24">
          <div className="mb-6 p-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden shrink-0 border border-lime-cream/30">
                <span className="text-sm font-bold text-lime-cream">ST</span>
              </div>
              <div>
                <div className="text-on-primary font-bold text-[14px]">Welcome, Student</div>
                <div className="text-on-primary/70 text-xs">Application ID: #APP-2024</div>
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <a href="#" className="text-on-primary/70 hover:bg-primary/50 rounded-lg transition-all duration-200 flex items-center gap-3 p-3">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-[14px]">Overview</span>
            </a>
            <a href="#" className="text-on-primary/70 hover:bg-primary/50 rounded-lg transition-all duration-200 flex items-center gap-3 p-3">
              <span className="material-symbols-outlined">person</span>
              <span className="text-[14px]">My Profile</span>
            </a>
            <a href="#" className="bg-primary-container text-on-primary-container rounded-lg font-bold transition-all duration-200 flex items-center gap-3 p-3">
              <span className="material-symbols-outlined">assignment_ind</span>
              <span className="text-[14px]">Enrollment</span>
            </a>
            <a href="#" className="text-on-primary/70 hover:bg-primary/50 rounded-lg transition-all duration-200 flex items-center gap-3 p-3">
              <span className="material-symbols-outlined">description</span>
              <span className="text-[14px]">Documents</span>
            </a>
            <a href="#" className="text-on-primary/70 hover:bg-primary/50 rounded-lg transition-all duration-200 flex items-center gap-3 p-3">
              <span className="material-symbols-outlined">contact_support</span>
              <span className="text-[14px]">Support</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col gap-6 overflow-y-auto pb-24 pr-2">
          {children}
        </main>
      </div>
    </div>
  );
}
