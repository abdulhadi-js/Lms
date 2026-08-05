"use client";

import { GraduationCap, Building2, Users, BookOpen, Calendar, ShieldCheck, PieChart, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';

export default function LandingPage() {
  return (
    <div className="text-on-surface antialiased min-h-screen bg-page-bg font-sans scroll-smooth">
      <MarketingNavbar />

      {/* Enterprise Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 md:px-[32px] bg-surface-container-lowest overflow-hidden border-b border-divider">
        <div className="relative z-10 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Column: Authoritative Copy */}
          <div className="flex flex-col items-start text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Enterprise Grade Campus Management</span>
            </div>

            <h1 className="font-heading font-bold text-[40px] md:text-[56px] lg:text-[64px] leading-[1.1] text-heading-on-light mb-6">
              Unified Infrastructure for <br className="hidden lg:block" />
              <span className="text-primary">Higher Education.</span>
            </h1>
            
            <p className="font-normal text-[16px] md:text-[18px] leading-[1.6] text-body-secondary max-w-[500px] mb-8">
              EduCore ERP consolidates academic operations, student information systems, and financial management into a single, secure, institutional-grade platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link href="/apply" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-on-primary bg-primary rounded-md shadow-sm hover:opacity-90 transition-opacity">
                Schedule a Consultation <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="#modules" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-on-surface bg-surface border border-divider rounded-md hover:bg-surface-container transition-colors">
                View Architecture
              </Link>
            </div>
            
            <div className="mt-12 pt-8 border-t border-divider w-full max-w-[400px]">
              <p className="text-xs font-semibold text-body-secondary uppercase tracking-wider mb-4">Trusted by leading academic institutions</p>
              <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                <Building2 className="w-8 h-8 text-on-surface" />
                <BookOpen className="w-8 h-8 text-on-surface" />
                <Users className="w-8 h-8 text-on-surface" />
              </div>
            </div>
          </div>

          {/* Right Column: Animated Interactive UI */}
          <div className="relative w-full h-[400px] sm:h-[500px] mt-10 lg:mt-0 perspective-[1000px] flex items-center justify-center group z-10">
             
             {/* Central Hub */}
             <div className="absolute w-[90%] max-w-[320px] bg-surface border border-divider shadow-xl rounded-2xl p-5 md:p-6 transition-all duration-700 ease-out z-20 group-hover:scale-[1.05] group-hover:shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                     </div>
                     <div>
                       <div className="text-[10px] md:text-xs font-bold text-body-secondary uppercase tracking-wider">Total Enrollment</div>
                       <div className="text-2xl md:text-3xl font-heading font-bold text-heading-on-light">24,592</div>
                     </div>
                   </div>
                   <div className="text-xs font-bold text-success bg-success-bg px-2.5 py-1 rounded-full shadow-sm border border-success/10">+12%</div>
                </div>
                
                {/* Animated Chart Bars */}
                <div className="flex items-end gap-2 h-32 md:h-40 mt-4 border-b border-divider/50 pb-1">
                  {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-surface-container-high rounded-t-md relative hover:bg-primary/10 transition-colors duration-500 h-full">
                      <div 
                        className="absolute bottom-0 left-0 w-full bg-primary rounded-t-md origin-bottom animate-fade-in-up" 
                        style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] md:text-xs text-body-secondary font-medium px-1">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
             </div>

             {/* Floating Card 1 (Top Left) */}
             <div className="hidden md:block absolute top-[8%] left-[0%] lg:left-[5%] w-[220px] bg-surface/90 backdrop-blur-md border border-divider shadow-xl rounded-xl p-4 z-10 transition-all duration-700 ease-out transform -rotate-3 group-hover:-rotate-6 group-hover:-translate-y-8 group-hover:-translate-x-8 hover:!scale-105 hover:!z-30 cursor-default">
               <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="w-5 h-5 text-success" />
                 <span className="text-sm font-semibold text-on-surface">System Status</span>
               </div>
               <div className="space-y-4">
                 <div>
                   <div className="flex justify-between items-center text-xs mb-1.5">
                     <span className="text-body-secondary">API Uptime</span>
                     <span className="font-bold text-success">99.99%</span>
                   </div>
                   <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                     <div className="bg-success h-full rounded-full w-[99%]"></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between items-center text-xs mb-1.5">
                     <span className="text-body-secondary">Database Uptime</span>
                     <span className="font-bold text-success">100%</span>
                   </div>
                   <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                     <div className="bg-success h-full rounded-full w-full"></div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Floating Card 2 (Bottom Right) */}
             <div className="hidden md:block absolute bottom-[8%] right-[0%] lg:right-[5%] w-[250px] bg-surface/90 backdrop-blur-md border border-divider shadow-xl rounded-xl p-5 z-30 transition-all duration-700 ease-out transform rotate-3 group-hover:rotate-6 group-hover:translate-y-8 group-hover:translate-x-8 hover:!scale-105 cursor-default">
               <div className="flex items-center gap-4">
                 <div className="relative w-12 h-12 rounded-full bg-primary-container flex items-center justify-center border border-primary/20 shrink-0">
                   <div className="absolute top-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-surface animate-pulse"></div>
                   <span className="text-sm font-bold text-on-primary-container">AD</span>
                 </div>
                 <div>
                   <div className="text-sm font-semibold text-on-surface mb-1">Admin Gateway</div>
                   <div className="text-[10px] md:text-xs font-medium text-body-secondary flex items-center gap-1">
                     Syncing records
                     <div className="flex gap-0.5 ml-1">
                       <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                       <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                       <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
             
             {/* Decorative Ambient Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.12)_0%,transparent_70%)] rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"></div>
          </div>
        </div>
      </section>

      {/* Core ERP Modules */}
      <section id="modules" className="py-20 px-6 md:px-[32px] bg-page-bg">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-heading-on-light mb-4">Comprehensive Module Architecture</h2>
            <p className="text-body-secondary text-lg">A fully integrated suite of tools designed to manage every aspect of your institution's operational lifecycle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Module 1 */}
            <div className="bg-surface p-6 rounded-xl border border-divider shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5 border border-primary/10">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg text-heading-on-light mb-2">Academic Core</h3>
              <p className="text-body-secondary text-sm leading-relaxed mb-4">Curriculum management, SCORM integration, automated grading matrices, and transcript generation.</p>
              <Link href="#" className="text-primary font-semibold text-sm hover:underline flex items-center">Explore Academics <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </div>

            {/* Module 2 */}
            <div className="bg-surface p-6 rounded-xl border border-divider shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5 border border-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg text-heading-on-light mb-2">Student Information</h3>
              <p className="text-body-secondary text-sm leading-relaxed mb-4">Centralized student records, enrollment lifecycles, attendance tracking, and demographic analytics.</p>
              <Link href="#" className="text-primary font-semibold text-sm hover:underline flex items-center">Explore SIS <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </div>

            {/* Module 3 */}
            <div className="bg-surface p-6 rounded-xl border border-divider shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5 border border-primary/10">
                <PieChart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg text-heading-on-light mb-2">Financial Operations</h3>
              <p className="text-body-secondary text-sm leading-relaxed mb-4">Fee structures, automated invoicing, payment gateway integration, and comprehensive ledger reporting.</p>
              <Link href="#" className="text-primary font-semibold text-sm hover:underline flex items-center">Explore Finance <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </div>

            {/* Module 4 */}
            <div className="bg-surface p-6 rounded-xl border border-divider shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-info-bg rounded-lg flex items-center justify-center mb-5 border border-info/10">
                <ShieldCheck className="w-6 h-6 text-info" />
              </div>
              <h3 className="font-heading font-bold text-lg text-heading-on-light mb-2">Identity & Access</h3>
              <p className="text-body-secondary text-sm leading-relaxed mb-4">Role-based access control (RBAC), multi-portal architecture, and stringent security compliance.</p>
              <Link href="#" className="text-info font-semibold text-sm hover:underline flex items-center">Explore IAM <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Infrastructure Section */}
      <section id="infrastructure" className="py-20 px-6 md:px-[32px] bg-surface border-y border-divider">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-heading-on-light mb-6">Engineered for Scale and Reliability</h2>
            <p className="text-body-secondary text-lg mb-8 leading-relaxed">
              EduCore is built on a robust, multi-tenant architecture that ensures high availability and strict data isolation for your institution.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-heading-on-light">Role-Based Portals</h4>
                  <p className="text-sm text-body-secondary">Dedicated, isolated dashboard environments for Administrators, Faculty, and Students.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-heading-on-light">Real-Time Data Sync</h4>
                  <p className="text-sm text-body-secondary">Grades, attendance, and financial records update instantaneously across all unified modules.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-heading-on-light">Audit & Compliance Ready</h4>
                  <p className="text-sm text-body-secondary">Comprehensive logging of all system actions for administrative oversight and compliance reporting.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-surface-container-low rounded-xl p-8 border border-divider">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded-lg border border-divider text-center">
                  <div className="text-3xl font-bold text-primary mb-1">99.9%</div>
                  <div className="text-xs text-body-secondary font-medium uppercase">Uptime SLA</div>
                </div>
                <div className="bg-surface p-4 rounded-lg border border-divider text-center">
                  <div className="text-3xl font-bold text-primary mb-1">SOC 2</div>
                  <div className="text-xs text-body-secondary font-medium uppercase">Type II Certified</div>
                </div>
                <div className="bg-surface p-4 rounded-lg border border-divider text-center">
                  <div className="text-3xl font-bold text-primary mb-1">256-bit</div>
                  <div className="text-xs text-body-secondary font-medium uppercase">AES Encryption</div>
                </div>
                <div className="bg-surface p-4 rounded-lg border border-divider text-center">
                  <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                  <div className="text-xs text-body-secondary font-medium uppercase">Technical Support</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1714416172/grid-dark_j16j7u.svg')] bg-center opacity-10 pointer-events-none"></div>
        <div className="max-w-[800px] mx-auto text-center px-6 relative z-10">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-on-primary mb-6">Modernize your institutional infrastructure.</h2>
          <p className="text-lg text-on-primary/80 mb-10 max-w-2xl mx-auto">Deploy a unified ERP system that faculty, staff, and students actually want to use. Request a technical demonstration today.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/apply" className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-primary bg-on-primary rounded-md hover:bg-surface-container transition-colors shadow-sm">
              Apply Admission
            </Link>
            <Link href="#contact" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-on-primary bg-transparent border border-on-primary/20 rounded-md hover:bg-on-primary/10 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer className="bg-surface border-t border-divider pt-16 pb-8 px-6 md:px-[32px]">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                  <GraduationCap className="text-on-primary w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-xl text-heading-on-light">EduCore ERP</span>
              </div>
              <p className="text-body-secondary text-sm max-w-xs mb-6">Providing robust, secure, and scalable enterprise resource planning solutions for higher education institutions globally.</p>
            </div>
            
            <div>
              <h4 className="font-heading font-bold text-heading-on-light mb-4 text-sm">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-body-secondary hover:text-primary text-sm transition-colors">Academic Core</Link></li>
                <li><Link href="#" className="text-body-secondary hover:text-primary text-sm transition-colors">Student Information</Link></li>
                <li><Link href="#" className="text-body-secondary hover:text-primary text-sm transition-colors">Financial Ledger</Link></li>
                <li><Link href="#" className="text-body-secondary hover:text-primary text-sm transition-colors">Security & Access</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-heading-on-light mb-4 text-sm">Institution</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-body-secondary hover:text-primary text-sm transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-body-secondary hover:text-primary text-sm transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-body-secondary hover:text-primary text-sm transition-colors">Partnerships</Link></li>
                <li><Link href="/contact" className="text-body-secondary hover:text-primary text-sm transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-heading-on-light mb-4 text-sm">Legal & Compliance</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-body-secondary hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-body-secondary hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-body-secondary hover:text-primary text-sm transition-colors">Data Processing Addendum</Link></li>
                <li><Link href="#" className="text-body-secondary hover:text-primary text-sm transition-colors">Security Certifications</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-body-secondary text-sm">© 2026 EduCore Technologies. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-body-secondary">
              <Link href="#" className="hover:text-primary transition-colors">ISO 27001 Certified</Link>
              <Link href="#" className="hover:text-primary transition-colors">FERPA Compliant</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
