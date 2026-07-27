"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, FileText, Award, Calendar, CreditCard, MessageSquare, LogOut, HelpCircle, Bell, Menu, GraduationCap, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'STUDENT') {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'STUDENT') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-page-bg text-evergreen gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <h2 className="text-xl font-medium animate-pulse">Loading Student Portal...</h2>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-page-bg font-sans text-on-surface overflow-hidden">
      {/* Top Navigation (Mobile/Tablet) */}
      <header className="md:hidden flex justify-between items-center px-4 h-16 w-full bg-primary border-b border-outline/20 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Menu className="text-on-primary w-5 h-5" />
          <span className="font-semibold text-[24px] text-on-primary">EduCore LMS</span>
        </div>
        <div className="flex items-center gap-4 text-on-primary">
          <Bell className="hover:opacity-80 transition-opacity cursor-pointer w-5 h-5" />
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-evergreen font-bold text-xs border border-outline/20">
            {user.firstName ? user.firstName[0].toUpperCase() : 'S'}
          </div>
        </div>
      </header>

      {/* Side Navigation (Desktop) */}
      <nav className="hidden md:flex flex-col h-full bg-gradient-to-b from-evergreen to-primary-container shadow-md docked left-0 h-screen w-64 py-8 shrink-0 z-40">
        <div className="px-6 mb-8 text-center flex flex-col items-center">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 rounded-full bg-primary-fixed-dim flex items-center justify-center text-evergreen font-bold text-xl border-2 border-on-primary/20">
              {user.firstName ? user.firstName[0].toUpperCase() : 'S'}
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-lime-cream rounded-full border-2 border-evergreen"></span>
          </div>
          <h2 className="font-semibold text-[20px] text-on-primary">{user.firstName} {user.lastName}</h2>
          <span className="badge-admin-gradient text-white font-medium text-[12px] px-3 py-1 rounded-full mt-2 inline-block">Student Portal</span>
        </div>
        <ul className="flex flex-col gap-1 px-4 flex-grow overflow-y-auto">
          <li>
            <Link href="/student" className={`flex items-center gap-3 py-3 rounded-lg font-medium transition-colors ${pathname === '/student' ? 'text-primary-fixed font-bold border-l-4 border-primary-fixed pl-4 bg-primary-container/20' : 'text-on-primary/70 pl-5 hover:bg-primary-container/50 hover:text-white'}`}>
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/student/courses" className={`flex items-center gap-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/student/courses') ? 'text-primary-fixed font-bold border-l-4 border-primary-fixed pl-4 bg-primary-container/20' : 'text-on-primary/70 pl-5 hover:bg-primary-container/50 hover:text-white'}`}>
              <GraduationCap className="w-5 h-5" />
              <span>My Courses</span>
            </Link>
          </li>
          <li>
            <Link href="/student/assignments" className={`flex items-center gap-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/student/assignments') ? 'text-primary-fixed font-bold border-l-4 border-primary-fixed pl-4 bg-primary-container/20' : 'text-on-primary/70 pl-5 hover:bg-primary-container/50 hover:text-white'}`}>
              <FileText className="w-5 h-5" />
              <span>Assignments</span>
            </Link>
          </li>
          <li>
            <Link href="/student/transcript" className={`flex items-center gap-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/student/transcript') ? 'text-primary-fixed font-bold border-l-4 border-primary-fixed pl-4 bg-primary-container/20' : 'text-on-primary/70 pl-5 hover:bg-primary-container/50 hover:text-white'}`}>
              <Award className="w-5 h-5" />
              <span>Grades & Transcripts</span>
            </Link>
          </li>
          <li>
            <Link href="/student/attendance" className={`flex items-center gap-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/student/attendance') ? 'text-primary-fixed font-bold border-l-4 border-primary-fixed pl-4 bg-primary-container/20' : 'text-on-primary/70 pl-5 hover:bg-primary-container/50 hover:text-white'}`}>
              <Calendar className="w-5 h-5" />
              <span>Attendance</span>
            </Link>
          </li>
          <li>
            <Link href="/student/fees" className={`flex items-center gap-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/student/fees') ? 'text-primary-fixed font-bold border-l-4 border-primary-fixed pl-4 bg-primary-container/20' : 'text-on-primary/70 pl-5 hover:bg-primary-container/50 hover:text-white'}`}>
              <CreditCard className="w-5 h-5" />
              <span>Fees & Payments</span>
            </Link>
          </li>
          <li>
            <Link href="/student/chat" className={`flex items-center gap-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/student/chat') ? 'text-primary-fixed font-bold border-l-4 border-primary-fixed pl-4 bg-primary-container/20' : 'text-on-primary/70 pl-5 hover:bg-primary-container/50 hover:text-white'}`}>
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>
          </li>
        </ul>
        <div className="px-6 mt-auto">
          <button onClick={() => logout()} className="flex items-center justify-center gap-2 w-full text-on-primary/70 font-medium text-[14px] py-2 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-1 overflow-y-auto bg-page-bg relative flex flex-col">
        {children}
      </main>
      
      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface border-t border-divider flex justify-around items-center h-16 z-50 px-2 pb-safe">
        <Link href="/student" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname === '/student' ? 'text-primary font-bold' : 'text-icon-inactive hover:text-primary'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Home</span>
        </Link>
        <Link href="/student/courses" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname.startsWith('/student/courses') ? 'text-primary font-bold' : 'text-icon-inactive hover:text-primary'}`}>
          <GraduationCap className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Courses</span>
        </Link>
        <Link href="/student/assignments" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname.startsWith('/student/assignments') ? 'text-primary font-bold' : 'text-icon-inactive hover:text-primary'}`}>
          <FileText className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Assignments</span>
        </Link>
        <Link href="/student/attendance" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname.startsWith('/student/attendance') ? 'text-primary font-bold' : 'text-icon-inactive hover:text-primary'}`}>
          <Calendar className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Attendance</span>
        </Link>
        <Link href="/student/chat" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname.startsWith('/student/chat') ? 'text-primary font-bold' : 'text-icon-inactive hover:text-primary'}`}>
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Messages</span>
        </Link>
      </nav>
    </div>
  );
}
