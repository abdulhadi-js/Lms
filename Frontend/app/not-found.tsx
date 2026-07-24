import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-page-bg min-h-screen flex items-center justify-center p-4">
      <section className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(19,42,19,0.08)] bg-gradient-to-br from-[#132A13] to-[#31572c] text-center py-20 px-8 relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')" }}></div>
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-[120px] font-bold leading-none text-[#ecf39e] mb-4 drop-shadow-lg">404</span>
          <h2 className="text-[32px] md:text-[40px] font-bold text-white mb-4 leading-tight">Page Not Found</h2>
          <p className="text-[16px] text-white/70 mb-10 max-w-md">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="h-12 flex items-center justify-center px-8 rounded-lg bg-[#ecf39e] text-[#132a13] font-semibold shadow-md hover:bg-opacity-90 transition-all border border-[#ecf39e]">
              Go Home
            </Link>
            <button className="h-12 px-8 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-[#132a13] transition-colors">
              Go Back
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
