"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BASE_URL } from '@/lib/api';
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationBell } from '@/components/NotificationBell';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, FileText, Award, Calendar, CreditCard, MessageSquare, LogOut, HelpCircle, Bell, Menu, GraduationCap, Loader2, ChevronLeft, ChevronRight, Settings, Edit } from 'lucide-react';
import Image from 'next/image';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else {
        const roleName = typeof user.role === 'object' ? (user.role as any)?.name : user.role;
        if (roleName?.toUpperCase() !== 'STUDENT') {
          router.push('/');
        }
      }
    }
  }, [user, isLoading, router]);

  const roleName = user ? (typeof user.role === 'object' ? (user.role as any)?.name : user.role) : null;
  if (isLoading || !user || roleName?.toUpperCase() !== 'STUDENT') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-page-bg text-evergreen gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <h2 className="text-xl font-medium animate-pulse">Loading Student Portal...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-page-bg font-sans text-on-surface overflow-hidden">
      {/* Top Navigation (Mobile/Tablet) */}
      <header className="md:hidden flex justify-between items-center px-4 h-16 w-full bg-primary border-b border-outline/20 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="text-on-primary w-5 h-5" />
          </button>
          <Link href="/" className="font-semibold text-[24px] text-on-primary hover:text-white transition-colors">EduCore LMS</Link>
        </div>
        <div className="flex items-center gap-4 text-on-primary">
          <ThemeToggle className="text-on-primary border-on-primary/20 hover:text-primary-fixed" />
          <NotificationBell />
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-evergreen font-bold text-xs border border-outline/20 overflow-hidden">
            {user?.profilePicture ? (
              <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `${BASE_URL}${user.profilePicture}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.firstName ? user.firstName[0].toUpperCase() : 'S'
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Side Navigation */}
      <nav className={`${isMobileMenuOpen ? 'flex absolute inset-y-0 left-0 w-64 shadow-2xl z-50' : 'hidden md:flex relative z-40'} flex-col h-full bg-gradient-to-b from-evergreen to-primary-container shadow-md docked h-screen transition-all duration-300 ${isCollapsed && !isMobileMenuOpen ? 'w-20' : 'w-64'} py-8 shrink-0 print:hidden`}>
        {/* Collapse Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block absolute -right-3 top-8 bg-surface text-evergreen border border-divider rounded-full p-1 shadow-md hover:bg-surface-container transition-colors z-50"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className="px-4 mb-8 flex flex-col items-center shrink-0">
          <div className="relative inline-block mb-3">
            <div className={`rounded-full bg-primary-fixed-dim flex items-center justify-center text-evergreen font-bold border-2 border-white/20 transition-all overflow-hidden ${isCollapsed && !isMobileMenuOpen ? 'w-10 h-10 text-sm' : 'w-16 h-16 text-xl'}`}>
              {user?.profilePicture ? (
                <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `${BASE_URL}${user.profilePicture}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.firstName ? user.firstName[0].toUpperCase() : 'S'
              )}
            </div>
            {!(isCollapsed && !isMobileMenuOpen) && <span className="absolute bottom-0 right-0 w-4 h-4 bg-lime-cream rounded-full border-2 border-evergreen"></span>}
          </div>
          {!(isCollapsed && !isMobileMenuOpen) && (
            <>
              <h2 className="font-semibold text-[20px] text-white text-center">{user.firstName} {user.lastName}</h2>
              <span className="badge-admin-gradient text-white font-medium text-[12px] px-3 py-1 rounded-full mt-2 inline-block text-center whitespace-nowrap">Student Portal</span>
            </>
          )}
        </div>
        <ul className={`flex flex-col gap-1 ${isCollapsed && !isMobileMenuOpen ? 'px-2' : 'px-4'} flex-grow overflow-y-auto`}>
          <li>
            <Link href="/student" title={isCollapsed ? "Dashboard" : undefined} data-testid="nav-dashboard" className={`flex items-center py-3 rounded-lg font-medium transition-all ${isCollapsed ? 'justify-center' : 'gap-3'} ${pathname === '/student' ? `text-primary-fixed font-bold bg-white/10 ${isCollapsed ? 'border-l-4 border-primary-fixed' : 'border-l-4 border-primary-fixed pl-4'}` : `text-white/70 hover:bg-white/5 hover:text-white ${isCollapsed ? '' : 'pl-5'}`}`}>
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link href="/student/courses" title={isCollapsed ? "My Courses" : undefined} data-testid="nav-my-courses" className={`flex items-center py-3 rounded-lg font-medium transition-all ${isCollapsed ? 'justify-center' : 'gap-3'} ${pathname.startsWith('/student/courses') ? `text-primary-fixed font-bold bg-white/10 ${isCollapsed ? 'border-l-4 border-primary-fixed' : 'border-l-4 border-primary-fixed pl-4'}` : `text-white/70 hover:bg-white/5 hover:text-white ${isCollapsed ? '' : 'pl-5'}`}`}>
              <GraduationCap className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">My Courses</span>}
            </Link>
          </li>
          <li>
            <Link href="/student/assignments" title={isCollapsed ? "Assignments" : undefined} data-testid="nav-assignments" className={`flex items-center py-3 rounded-lg font-medium transition-all ${isCollapsed ? 'justify-center' : 'gap-3'} ${pathname.startsWith('/student/assignments') ? `text-primary-fixed font-bold bg-white/10 ${isCollapsed ? 'border-l-4 border-primary-fixed' : 'border-l-4 border-primary-fixed pl-4'}` : `text-white/70 hover:bg-white/5 hover:text-white ${isCollapsed ? '' : 'pl-5'}`}`}>
              <FileText className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Assignments</span>}
            </Link>
          </li>
          <li>
            <Link href="/student/exams" title={isCollapsed ? "Exams" : undefined} data-testid="nav-exams" className={`flex items-center py-3 rounded-lg font-medium transition-all ${isCollapsed ? 'justify-center' : 'gap-3'} ${pathname.startsWith('/student/exams') ? `text-primary-fixed font-bold bg-white/10 ${isCollapsed ? 'border-l-4 border-primary-fixed' : 'border-l-4 border-primary-fixed pl-4'}` : `text-white/70 hover:bg-white/5 hover:text-white ${isCollapsed ? '' : 'pl-5'}`}`}>
              <Edit className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Exams</span>}
            </Link>
          </li>
          <li>
            <Link href="/student/transcript" title={isCollapsed ? "Grades & Transcripts" : undefined} data-testid="nav-grades-transcripts" className={`flex items-center py-3 rounded-lg font-medium transition-all ${isCollapsed ? 'justify-center' : 'gap-3'} ${pathname.startsWith('/student/transcript') ? `text-primary-fixed font-bold bg-white/10 ${isCollapsed ? 'border-l-4 border-primary-fixed' : 'border-l-4 border-primary-fixed pl-4'}` : `text-white/70 hover:bg-white/5 hover:text-white ${isCollapsed ? '' : 'pl-5'}`}`}>
              <Award className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Grades & Transcripts</span>}
            </Link>
          </li>
          <li>
            <Link href="/student/attendance" title={isCollapsed ? "Attendance" : undefined} data-testid="nav-attendance" className={`flex items-center py-3 rounded-lg font-medium transition-all ${isCollapsed ? 'justify-center' : 'gap-3'} ${pathname.startsWith('/student/attendance') ? `text-primary-fixed font-bold bg-white/10 ${isCollapsed ? 'border-l-4 border-primary-fixed' : 'border-l-4 border-primary-fixed pl-4'}` : `text-white/70 hover:bg-white/5 hover:text-white ${isCollapsed ? '' : 'pl-5'}`}`}>
              <Calendar className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Attendance</span>}
            </Link>
          </li>
          <li>
            <Link href="/student/fees" title={isCollapsed ? "Fees & Payments" : undefined} data-testid="nav-fees-payments" className={`flex items-center py-3 rounded-lg font-medium transition-all ${isCollapsed ? 'justify-center' : 'gap-3'} ${pathname.startsWith('/student/fees') ? `text-primary-fixed font-bold bg-white/10 ${isCollapsed ? 'border-l-4 border-primary-fixed' : 'border-l-4 border-primary-fixed pl-4'}` : `text-white/70 hover:bg-white/5 hover:text-white ${isCollapsed ? '' : 'pl-5'}`}`}>
              <CreditCard className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Fees & Payments</span>}
            </Link>
          </li>
          <li>
            <Link href="/student/chat" title={isCollapsed ? "Messages" : undefined} data-testid="nav-messages" className={`flex items-center py-3 rounded-lg font-medium transition-all ${isCollapsed ? 'justify-center' : 'gap-3'} ${pathname.startsWith('/student/chat') ? `text-primary-fixed font-bold bg-white/10 ${isCollapsed ? 'border-l-4 border-primary-fixed' : 'border-l-4 border-primary-fixed pl-4'}` : `text-white/70 hover:bg-white/5 hover:text-white ${isCollapsed ? '' : 'pl-5'}`}`}>
              <MessageSquare className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Messages</span>}
            </Link>
          </li>
          <li>
            <Link href="/student/profile" title={isCollapsed ? "Profile Settings" : undefined} data-testid="nav-profile-settings" className={`flex items-center py-3 rounded-lg font-medium transition-all ${isCollapsed ? 'justify-center' : 'gap-3'} ${pathname.startsWith('/student/profile') ? `text-primary-fixed font-bold bg-white/10 ${isCollapsed ? 'border-l-4 border-primary-fixed' : 'border-l-4 border-primary-fixed pl-4'}` : `text-white/70 hover:bg-white/5 hover:text-white ${isCollapsed ? '' : 'pl-5'}`}`}>
              <Settings className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Profile Settings</span>}
            </Link>
          </li>
        </ul>
        <div className={`mt-auto shrink-0 flex flex-col gap-2 ${isCollapsed && !isMobileMenuOpen ? 'px-2 items-center' : 'px-4'}`}>
          {!(isCollapsed && !isMobileMenuOpen) ? (
            <>
              <div className="flex items-center justify-between mb-2 px-3 border border-white/10 rounded-lg py-2 mx-2 bg-white/5">
                <span className="text-sm font-medium text-white/80">Theme</span>
                <ThemeToggle className="text-white hover:text-primary-fixed" />
              </div>
            </>
          ) : (
            <ThemeToggle className="mb-2 text-white hover:text-primary-fixed" />
          )}
          <button 
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-white/70 hover:bg-white/10 hover:text-white ${isCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!(isCollapsed && !isMobileMenuOpen) && <span>Sign Out</span>}
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
          <span className="font-medium text-[10px] mt-1">Assign.</span>
        </Link>
        <Link href="/student/exams" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname.startsWith('/student/exams') ? 'text-primary font-bold' : 'text-icon-inactive hover:text-primary'}`}>
          <Edit className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Exams</span>
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
