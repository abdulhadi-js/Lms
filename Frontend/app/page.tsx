import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="text-on-surface antialiased min-h-screen bg-page-bg font-sans">
      <nav className="bg-evergreen shadow-md fixed top-0 w-full z-50">
        <div className="flex justify-between items-center px-6 md:px-[24px] py-4 max-w-[1280px] mx-auto">
          <div className="flex items-center space-x-2">
            <GraduationCap className="text-lime-cream text-2xl w-5 h-5" />
            <span className="font-semibold text-[28px] leading-[1.3] text-white">EduCore</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="#" className="text-white font-bold border-b-2 border-primary-fixed pb-1">Features</Link>
            <Link href="#" className="text-white opacity-80 hover:opacity-100 hover:text-primary-fixed transition-colors duration-200">Solutions</Link>
            <Link href="#" className="text-white opacity-80 hover:opacity-100 hover:text-primary-fixed transition-colors duration-200">Testimonials</Link>
            <Link href="#" className="text-white opacity-80 hover:opacity-100 hover:text-primary-fixed transition-colors duration-200">About</Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/login" className="text-white border border-lime-cream px-4 py-2 rounded-lg font-semibold text-[16px] scale-95 transition-transform duration-150 hover:bg-lime-cream hover:text-evergreen inline-flex items-center justify-center">Login</Link>
            <Link href="/login" className="primary-gradient text-white px-6 py-2 rounded-lg font-semibold text-[16px] scale-95 transition-transform duration-150 inline-flex items-center justify-center">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-[#132a13] via-[#31572c] to-[#4f772d] pt-32 pb-24 md:pt-40 md:pb-32 px-4 md:px-[32px] overflow-hidden min-h-[100vh]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <h1 className="font-bold text-[40px] md:text-[48px] leading-[1.2] text-white">
              Empower Every Learner.<br/>Manage Every Classroom.
            </h1>
            <p className="font-normal text-[16px] leading-[1.6] text-surface-container-highest max-w-lg">
              A complete Learning Management System for schools and colleges — courses, attendance, grading, fees, and more in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="primary-gradient text-white px-8 py-3 rounded-lg font-semibold text-[16px] shadow-lg hover:shadow-xl transition-shadow inline-flex items-center justify-center">Get Started</Link>
              <Link href="#features" className="border border-lime-cream text-lime-cream px-8 py-3 rounded-lg font-semibold text-[16px] hover:bg-lime-cream/10 transition-colors inline-flex items-center justify-center">Learn More</Link>
            </div>
            <p className="font-normal text-[14px] text-secondary-fixed opacity-90 pt-4 flex items-center">
              <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Trusted by 200+ institutions nationwide
            </p>
          </div>
          <div className="relative z-10 w-full h-[400px] md:h-[500px]">
            <img 
              className="w-full h-full object-contain filter drop-shadow-2xl" 
              alt="An isometric, modern 3D illustration of a digital learning dashboard floating in space." 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY4mhPaxldNmS8Htoxbm0WilS7QMxLbTFs92W_oOkdpNuk46fKdblQZIViGjHGV35GlR8kR25vpTmbxiPS_ztoMv6dz-RYeRKTO4J-1qcuegjvluu5b0H5nLl-VFrzLVrS7jnyH5WO8kFxVDiY3onQw2Uujfas_8Xk9-tAHy0K_BCkh07-RE-5Eh6lkVCQcqCjKOhkmbshWy2125CO7VWGHpGMr5IEJFDXERrwypvKBVKb8FLVg126" 
            />
          </div>
        </div>
      </section>
    </div>
  );
}
