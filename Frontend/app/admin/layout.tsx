"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { LayoutDashboard, BookOpen, Users, BarChart3, Settings, LogOut, Bell, Menu, Calendar } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'ADMIN') {
    return <div className="flex h-screen items-center justify-center bg-page-bg text-evergreen">Loading...</div>;
  }
  
  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname?.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Course Catalog', path: '/admin/courses', icon: BookOpen },
    { name: 'Users & Roles', path: '/admin/users', icon: Users },
    { name: 'Timetable', path: '/admin/timetable', icon: Calendar },
    { name: 'Enrollments', path: '/admin/enrollments', icon: Users },
    { name: 'Applications', path: '/admin/applications', icon: BookOpen },
    { name: 'Fees', path: '/admin/fees', icon: BarChart3 },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-page-bg font-sans text-on-surface overflow-hidden">
      {/* Top Navigation (Mobile/Tablet) */}
      <header className="md:hidden flex justify-between items-center px-4 h-16 w-full bg-primary border-b border-outline/20 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Menu className="w-6 h-6 text-on-primary" />
          <span className="font-semibold text-[24px] text-on-primary">EduCore LMS</span>
        </div>
        <div className="flex items-center gap-4 text-on-primary">
          <Bell className="w-5 h-5 hover:opacity-80 transition-opacity cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-evergreen font-bold text-xs border border-outline/20">
            JD
          </div>
        </div>
      </header>

      {/* Side Navigation (Desktop) */}
      <nav className="hidden md:flex flex-col h-full bg-gradient-to-b from-evergreen to-primary-container shadow-md docked left-0 h-screen w-64 py-8 shrink-0 z-40">
        <div className="px-6 mb-8 text-center flex flex-col items-center">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 rounded-full bg-primary-fixed-dim flex items-center justify-center text-evergreen font-bold text-xl border-2 border-on-primary/20">
              JD
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-lime-cream rounded-full border-2 border-evergreen"></span>
          </div>
          <h2 className="font-semibold text-[20px] text-on-primary">EduCore LMS</h2>
          <span className="badge-admin-gradient text-white font-medium text-[12px] px-3 py-1 rounded-full mt-2 inline-block">Admin Dashboard</span>
        </div>
        <ul className="flex flex-col gap-1 px-4 flex-grow overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <Link 
                  href={link.path} 
                  className={`flex items-center gap-3 py-3 rounded-lg font-medium transition-colors ${
                    active 
                      ? 'text-primary-fixed font-bold border-l-4 border-primary-fixed pl-4 bg-primary-container/20' 
                      : 'text-on-primary/70 pl-5 hover:bg-primary-container/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="#" className="flex items-center gap-3 py-3 rounded-lg text-on-primary/70 font-medium pl-5 hover:bg-primary-container/50 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
        <div className="px-6 mt-auto shrink-0">
          <button className="w-full bg-lime-cream text-evergreen font-semibold text-[16px] py-2 rounded-lg hover:bg-white transition-colors mb-2 brand-button">Generate Report</button>
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
        {navLinks.slice(0, 3).map(link => {
          const active = isActive(link.path);
          const Icon = link.icon;
          return (
            <Link key={link.path} href={link.path} className={`flex flex-col items-center justify-center w-full h-full ${active ? 'text-primary font-bold' : 'text-icon-inactive hover:text-primary transition-colors'}`}>
              <Icon className="w-5 h-5" />
              <span className="font-medium text-[10px] mt-1">{link.name.split(' ')[0]}</span>
            </Link>
          );
        })}
        <Link href="#" className="flex flex-col items-center justify-center w-full h-full text-icon-inactive hover:text-primary transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-[10px] mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
