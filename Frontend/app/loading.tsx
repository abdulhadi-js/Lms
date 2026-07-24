export default function Loading() {
  return (
    <div className="bg-page-bg min-h-screen flex items-center justify-center p-4">
      <section className="w-full max-w-[1000px] h-[600px] bg-surface-container-lowest border border-border-light rounded-xl shadow-[0_4px_12px_rgba(19,42,19,0.08)] overflow-hidden flex relative">
        {/* Overlay Loader */}
        <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-pulse">
            <span className="material-symbols-outlined text-4xl text-lime-cream" style={{ fontVariationSettings: "'FILL' 0" }}>eco</span>
          </div>
          <p className="text-[12px] font-medium text-body-secondary uppercase tracking-wider">Loading your dashboard...</p>
        </div>
        
        {/* Skeleton Sidebar */}
        <div className="w-64 border-r border-border-light bg-neutral-bg p-6 hidden md:flex flex-col gap-6">
          <div className="w-32 h-8 rounded animate-pulse bg-surface-variant mb-8"></div>
          <div className="w-full h-10 rounded animate-pulse bg-surface-variant"></div>
          <div className="w-full h-10 rounded animate-pulse bg-surface-variant"></div>
          <div className="w-full h-10 rounded animate-pulse bg-surface-variant"></div>
          <div className="w-full h-10 rounded animate-pulse bg-surface-variant"></div>
        </div>
        
        {/* Skeleton Content */}
        <div className="flex-1 p-8 flex flex-col gap-8">
          {/* Top Nav Skeleton */}
          <div className="w-full flex justify-between items-center">
            <div className="w-48 h-8 rounded animate-pulse bg-surface-variant"></div>
            <div className="w-10 h-10 rounded-full animate-pulse bg-surface-variant"></div>
          </div>
          
          {/* Stat Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-24 rounded-lg animate-pulse bg-surface-variant"></div>
            <div className="h-24 rounded-lg animate-pulse bg-surface-variant"></div>
            <div className="h-24 rounded-lg animate-pulse bg-surface-variant"></div>
            <div className="h-24 rounded-lg animate-pulse bg-surface-variant"></div>
          </div>
          
          {/* Main Panels Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            <div className="md:col-span-2 rounded-xl animate-pulse bg-surface-variant h-full min-h-[300px]"></div>
            <div className="rounded-xl animate-pulse bg-surface-variant h-full min-h-[300px]"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
