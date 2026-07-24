import Link from 'next/link';

export default function ApplicationSuccess() {
  return (
    <div className="bg-page-bg min-h-screen flex items-center justify-center p-4">
      <section className="w-full max-w-2xl bg-surface-container-lowest p-12 rounded-xl border border-border-light shadow-[0_4px_12px_rgba(19,42,19,0.08)] flex flex-col items-center text-center relative overflow-hidden">
        {/* Top Category Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#31572c] to-[#4f772d] rounded-t-xl"></div>
        
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#31572c] to-[#4f772d] flex items-center justify-center mb-8 shadow-md">
          <span className="material-symbols-outlined text-[64px] text-on-primary" style={{ fontVariationSettings: "'FILL' 0" }}>check</span>
        </div>
        
        <h2 className="text-[32px] md:text-[40px] font-bold text-evergreen mb-4 leading-tight">Done! 🎉</h2>
        <p className="text-[16px] text-body-secondary max-w-md mx-auto mb-6">
          Your application has been submitted successfully. You&apos;ll receive a confirmation email at <span className="font-semibold text-evergreen">student@email.com</span>
        </p>
        
        <div className="bg-success-bg px-6 py-2 rounded-full mb-10 border border-success/20">
          <span className="text-[12px] font-medium text-success uppercase tracking-wide">Application Ref: APP-2026-00142</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/apply" className="h-12 flex items-center justify-center px-8 rounded-lg border border-outline text-evergreen font-semibold hover:bg-surface-container-low transition-colors">
            Start Over
          </Link>
          <Link href="/login" className="h-12 flex items-center justify-center px-8 rounded-lg bg-gradient-to-r from-[#132A13] to-[#31572c] text-on-primary font-semibold shadow-md hover:opacity-90 transition-opacity">
            Go to My Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
