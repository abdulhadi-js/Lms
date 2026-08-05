import { GraduationCap, ArrowRight, Target, Users, Globe, Shield, Server, Database } from 'lucide-react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';

export const metadata = {
  title: 'About | EduCore ERP',
  description: 'Learn about EduCore ERP, the leading institutional management platform.',
};

export default function AboutPage() {
  return (
    <div className="text-on-surface antialiased min-h-screen bg-page-bg font-sans scroll-smooth">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-[32px] bg-surface-container-lowest border-b border-divider">
        <div className="max-w-[800px] mx-auto text-center animate-fade-in-up">
          <h1 className="font-heading font-bold text-[40px] md:text-[56px] leading-[1.1] text-heading-on-light mb-6">
            Empowering Educational <span className="text-primary">Institutions.</span>
          </h1>
          <p className="font-normal text-[18px] leading-[1.6] text-body-secondary mb-8">
            EduCore was founded with a singular mission: to provide universities and colleges with an infrastructure that is as robust and reliable as the education they provide.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 md:px-[32px] bg-page-bg">
        <div className="max-w-[1000px] mx-auto space-y-20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-heading-on-light mb-4">Our Vision</h2>
              <p className="text-body-secondary leading-relaxed mb-6">
                We believe that educators should focus on teaching, not wrestling with fragmented software systems. By consolidating academic records, financial ledgers, and human resources into a single pane of glass, we eliminate operational silos and bring absolute clarity to campus administration.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <Target className="w-5 h-5 text-primary" /> Precision Engineering for Scale
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <Shield className="w-5 h-5 text-primary" /> Uncompromising Data Security
                </li>
              </ul>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl border border-divider h-[400px] flex items-center justify-center relative overflow-hidden group shadow-inner">
              {/* Background ambient glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.08)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative w-full h-full flex items-center justify-center [perspective:2000px]">
                {/* 3D Scene Container */}
                <div className="relative w-56 h-56 [transform-style:preserve-3d] [transform:rotateX(60deg)_rotateZ(-45deg)] group-hover:[transform:rotateX(60deg)_rotateZ(-35deg)] transition-transform duration-1000 ease-out">
                  
                  {/* Top Layer - Application Interface */}
                  <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-md border border-primary/40 rounded-2xl flex items-center justify-center transition-all duration-700 ease-out [transform:translateZ(30px)] group-hover:[transform:translateZ(100px)] shadow-[20px_20px_20px_rgba(0,0,0,0.05)] group-hover:shadow-[40px_40px_40px_rgba(0,0,0,0.1)]">
                    <div className="grid grid-cols-2 gap-3 p-4 w-full h-full opacity-80">
                       <div className="bg-primary/20 rounded border border-primary/20 animate-pulse"></div>
                       <div className="bg-primary/20 rounded border border-primary/20 animate-pulse" style={{ animationDelay: '200ms' }}></div>
                       <div className="bg-primary/20 rounded border border-primary/20 col-span-2 animate-pulse" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>

                  {/* Middle Layer - API & Security */}
                  <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm border border-primary/20 rounded-2xl flex items-center justify-center transition-all duration-700 ease-out delay-75 [transform:translateZ(0px)] group-hover:[transform:translateZ(40px)] shadow-[20px_20px_20px_rgba(0,0,0,0.05)] group-hover:shadow-[30px_30px_30px_rgba(0,0,0,0.08)]">
                    <div className="w-full h-full border-[2px] border-dashed border-primary/30 rounded-xl m-4 flex items-center justify-center relative">
                      <Shield className="w-10 h-10 text-primary/50 [transform:rotateZ(45deg)_rotateX(-60deg)] group-hover:[transform:rotateZ(35deg)_rotateX(-60deg)] transition-transform duration-1000" />
                      
                      {/* Data traveling ping */}
                      <div className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),1)] animate-[ping_3s_linear_infinite]"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),1)] animate-[ping_3s_linear_infinite]" style={{ animationDelay: '1.5s' }}></div>
                    </div>
                  </div>

                  {/* Bottom Layer - Database & Infrastructure */}
                  <div className="absolute inset-0 bg-surface-container-high/90 border border-divider rounded-2xl flex items-center justify-center transition-all duration-700 ease-out delay-150 [transform:translateZ(-30px)] group-hover:[transform:translateZ(-20px)] shadow-[20px_20px_20px_rgba(0,0,0,0.1)] group-hover:shadow-[20px_20px_20px_rgba(0,0,0,0.15)]">
                    <Database className="w-12 h-12 text-body-secondary/60 [transform:rotateZ(45deg)_rotateX(-60deg)] group-hover:[transform:rotateZ(35deg)_rotateX(-60deg)] transition-transform duration-1000" />
                  </div>
                  
                </div>
              </div>
              
              {/* Floating interactive badges (Fade in on hover) */}
              <div className="absolute top-6 left-6 px-3 py-1 bg-surface border border-divider rounded-full text-[10px] font-bold text-body-secondary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 translate-y-2 group-hover:translate-y-0 shadow-sm">Application Layer</div>
              <div className="absolute bottom-6 right-6 px-3 py-1 bg-surface border border-divider rounded-full text-[10px] font-bold text-body-secondary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 delay-500 -translate-y-2 group-hover:translate-y-0 shadow-sm">Infrastructure Layer</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface p-8 rounded-xl border border-divider">
              <h3 className="text-4xl font-heading font-bold text-primary mb-2">500+</h3>
              <p className="text-sm font-medium text-body-secondary uppercase tracking-wider">Campuses Deployed</p>
            </div>
            <div className="bg-surface p-8 rounded-xl border border-divider">
              <h3 className="text-4xl font-heading font-bold text-primary mb-2">2M+</h3>
              <p className="text-sm font-medium text-body-secondary uppercase tracking-wider">Active Students</p>
            </div>
            <div className="bg-surface p-8 rounded-xl border border-divider">
              <h3 className="text-4xl font-heading font-bold text-primary mb-2">99.9%</h3>
              <p className="text-sm font-medium text-body-secondary uppercase tracking-wider">Infrastructure Uptime</p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-divider py-16 px-6 md:px-[32px]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <GraduationCap className="text-on-primary w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-lg text-heading-on-light">EduCore</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-sm text-body-secondary hover:text-primary transition-colors">About Us</Link>
              <Link href="/contact" className="text-sm text-body-secondary hover:text-primary transition-colors">Contact</Link>
              <Link href="/apply" className="text-sm text-body-secondary hover:text-primary transition-colors">Apply Admission</Link>
            </div>
          </div>
          <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-body-secondary text-sm">© 2026 EduCore Technologies. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-body-secondary">
              <span className="hover:text-primary transition-colors cursor-default">ISO 27001 Certified</span>
              <span className="hover:text-primary transition-colors cursor-default">FERPA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
