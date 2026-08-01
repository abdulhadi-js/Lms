"use client";

import { Menu, Bell, LayoutDashboard, GraduationCap, FileText, Edit, ClipboardCheck, MessageSquare, BarChart3, LogOut, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/auth-context';
import { BASE_URL } from '@/lib/api';
import { NotificationBell } from '@/components/NotificationBell';
import { useEffect, useState } from 'react';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else {
        const roleName = typeof user.role === 'object' ? (user.role as any)?.name : user.role;
        if (roleName?.toUpperCase() !== 'INSTRUCTOR' && roleName?.toUpperCase() !== 'TEACHER') {
          router.push('/');
        }
      }
    }
  }, [user, isLoading, router]);

  const roleName = user ? (typeof user.role === 'object' ? (user.role as any)?.name : user.role) : null;
  if (isLoading || !user || (roleName?.toUpperCase() !== 'INSTRUCTOR' && roleName?.toUpperCase() !== 'TEACHER')) {
    return <div className="flex h-screen items-center justify-center bg-page-bg text-evergreen">Loading...</div>;
  }
  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/teacher/courses', label: 'My Courses', icon: GraduationCap },
    { href: '/teacher/assignments', label: 'Assignments', icon: FileText },
    { href: '/teacher/gradebook', label: 'Marks & Grading', icon: Edit },
    { href: '/teacher/attendance', label: 'Attendance', icon: ClipboardCheck },
    { href: '/teacher/exams', label: 'CBT Exams', icon: Edit },
    { href: '/teacher/chat', label: 'Chat', icon: MessageSquare },
    { href: '/teacher/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/teacher/profile', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-page-bg font-sans text-on-surface overflow-hidden">
      {/* Top Navigation (Mobile/Tablet) */}
      <header className="md:hidden flex justify-between items-center px-4 h-16 w-full bg-primary border-b border-outline/20 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Menu className="text-on-primary w-5 h-5" />
          <Link href="/" className="font-semibold text-[24px] text-on-primary hover:text-white transition-colors">EduCore LMS</Link>
        </div>
        <div className="flex items-center gap-4 text-on-primary">
          <ThemeToggle className="text-on-primary border-on-primary/20 hover:text-primary-fixed" />
          <Bell className="hover:opacity-80 transition-opacity cursor-pointer w-5 h-5" />
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-evergreen font-bold text-xs border border-outline/20 overflow-hidden">
            {user?.profilePicture ? (
              <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `${BASE_URL}${user.profilePicture}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.firstName ? user.firstName[0].toUpperCase() : 'T'
            )}
          </div>
        </div>
      </header>

      {/* Side Navigation (Desktop) */}
      <nav className={`hidden md:flex flex-col h-full bg-gradient-to-b from-evergreen to-primary-container shadow-md docked left-0 h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} py-8 shrink-0 z-40 relative`}>
        {/* Collapse Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-white text-evergreen border border-divider rounded-full p-1 shadow-md hover:bg-surface-container transition-colors z-50"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className="px-4 mb-8 flex flex-col items-center shrink-0">
          <div className="relative inline-block mb-3">
            <div className={`rounded-full bg-primary-fixed-dim flex items-center justify-center text-evergreen font-bold border-2 border-on-primary/20 transition-all overflow-hidden ${isCollapsed ? 'w-10 h-10 text-sm' : 'w-16 h-16 text-xl'}`}>
              {user?.profilePicture ? (
                <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `${BASE_URL}${user.profilePicture}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.firstName ? user.firstName[0].toUpperCase() : 'T'
              )}
            </div>
            {!isCollapsed && <span className="absolute bottom-0 right-0 w-4 h-4 bg-lime-cream rounded-full border-2 border-evergreen"></span>}
          </div>
          {!isCollapsed && (
            <>
              <Link href="/" className="font-semibold text-[20px] text-on-primary hover:text-white transition-colors text-center block mt-1">EduCore LMS</Link>
              <span className="badge-admin-gradient text-white font-medium text-[12px] px-3 py-1 rounded-full mt-2 inline-block text-center whitespace-nowrap">Teacher Dashboard</span>
            </>
          )}
        </div>
        <ul className={`flex flex-col gap-1 ${isCollapsed ? 'px-2' : 'px-4'} flex-grow overflow-y-auto`}>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                title={isCollapsed ? label : undefined}
                data-testid={`nav-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className={`flex items-center py-3 rounded-lg font-medium transition-all ${isCollapsed ? 'justify-center' : 'gap-3'} ${
                  isActive(href)
                    ? `text-primary-fixed font-bold bg-primary-container/20 ${isCollapsed ? 'border-l-4 border-primary-fixed' : 'border-l-4 border-primary-fixed pl-4'}`
                    : `text-on-primary/70 hover:bg-primary-container/50 hover:text-white ${isCollapsed ? '' : 'pl-5'}`
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
        <div className={`mt-auto shrink-0 flex flex-col gap-2 ${isCollapsed ? 'px-2 items-center' : 'px-6'}`}>
          {!isCollapsed ? (
            <div className="flex items-center justify-between mb-2 px-2 border border-divider rounded-lg p-2 bg-surface-container/50">
              <span className="text-sm font-medium text-on-primary/80">Theme</span>
              <ThemeToggle />
            </div>
          ) : (
            <ThemeToggle className="mb-2" />
          )}

          <button onClick={() => logout()} 
            title={isCollapsed ? "Logout" : undefined}
            className={`flex items-center justify-center text-on-primary/70 font-medium hover:text-white transition-colors ${isCollapsed ? 'w-10 h-10' : 'w-full gap-2 py-2 text-[14px]'}`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-1 overflow-y-auto bg-page-bg relative">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface border-t border-divider flex justify-around items-center h-16 z-50 px-2 pb-safe">
        <Link href="/teacher" className="flex flex-col items-center justify-center w-full h-full text-primary font-bold">
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Home</span>
        </Link>
        <Link href="/teacher/courses" className="flex flex-col items-center justify-center w-full h-full text-icon-inactive hover:text-primary transition-colors">
          <GraduationCap className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Courses</span>
        </Link>
        <Link href="/teacher/assignments" className="flex flex-col items-center justify-center w-full h-full text-icon-inactive hover:text-primary transition-colors">
          <FileText className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Grading</span>
        </Link>
        <Link href="/teacher/attendance" className="flex flex-col items-center justify-center w-full h-full text-icon-inactive hover:text-primary transition-colors">
          <ClipboardCheck className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Attend.</span>
        </Link>
        <Link href="/teacher/exams" className="hidden sm:flex flex-col items-center justify-center w-full h-full text-icon-inactive hover:text-primary transition-colors">
          <Edit className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Exams</span>
        </Link>
        <Link href="/teacher/chat" className="flex flex-col items-center justify-center w-full h-full text-icon-inactive hover:text-primary transition-colors">
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Chat</span>
        </Link>
      </nav>
    </div>
  );
}
