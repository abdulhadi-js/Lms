"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { LayoutDashboard, BookOpen, Users, BarChart3, Settings, LogOut, Bell, Menu, Calendar, ChevronLeft, ChevronRight, X, Building2, ShieldCheck, LibraryBig } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { BASE_URL } from '@/lib/api';
import { NotificationBell } from '@/components/NotificationBell';
import { useUIStore } from '@/lib/store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else {
        const roleName = typeof user.role === 'object' ? (user.role as any)?.name : user.role;
        if (roleName?.toUpperCase() !== 'ADMIN' && roleName?.toUpperCase() !== 'PRINCIPAL' && !user.isSuperAdmin) {
          router.push('/');
        }
      }
    }
  }, [user, isLoading, router]);

  const roleName = user ? (typeof user.role === 'object' ? (user.role as any)?.name : user.role) : null;
  if (isLoading || !user || (roleName?.toUpperCase() !== 'ADMIN' && roleName?.toUpperCase() !== 'PRINCIPAL' && !user.isSuperAdmin)) {
    return <div className="flex h-screen items-center justify-center bg-page-bg text-evergreen">Loading...</div>;
  }
  
  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname?.startsWith(path)) return true;
    return false;
  };

  const LINK_SECTIONS = [
    {
      section: 'Core Management',
      links: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, moduleId: 'DASHBOARD' },
        { name: 'Campuses', path: '/admin/campuses', icon: Building2, moduleId: 'CAMPUSES' },
        { name: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck, moduleId: 'ROLES' },
      ]
    },
    {
      section: 'Academics',
      links: [
        { name: 'Academics', path: '/admin/academics', icon: BookOpen, moduleId: 'ACADEMICS' },
        { name: 'Streams & Groups', path: '/admin/academic-groups', icon: LibraryBig, moduleId: 'ACADEMICS' },
        { name: 'Timetable', path: '/admin/timetable', icon: Calendar, moduleId: 'ACADEMICS' },
      ]
    },
    {
      section: 'People',
      links: [
        { name: 'Enrollments', path: '/admin/enrollments', icon: Users, moduleId: 'USERS_STUDENTS' },
        { name: 'Applications', path: '/admin/applications', icon: BookOpen, moduleId: 'USERS_STUDENTS' },
        { name: 'Families & Siblings', path: '/admin/families', icon: Users, moduleId: 'USERS_STUDENTS' },
        { name: 'Staff HR', path: '/admin/users', icon: Users, moduleId: 'USERS_STAFF' },
        { name: 'Departments', path: '/admin/departments', icon: Building2, moduleId: 'USERS_STAFF' },
      ]
    },
    {
      section: 'Finance & Comms',
      links: [
        { name: 'Fees', path: '/admin/fees', icon: BarChart3, moduleId: 'FEES' },
        { name: 'Accounts (Ledger)', path: '/admin/accounts', icon: BarChart3, moduleId: 'ACCOUNTS' },
        { name: 'Messaging', path: '/admin/messaging', icon: Bell, moduleId: 'MESSAGING' },
        { name: 'Reports', path: '/admin/reports', icon: BarChart3, moduleId: 'REPORTS' },
      ]
    },
    {
      section: 'Settings',
      links: [
        { name: 'Profile Settings', path: '/admin/profile', icon: Settings, moduleId: null },
      ]
    }
  ];

  const allowedSections = LINK_SECTIONS.map(section => ({
    section: section.section,
    links: user.isSuperAdmin 
      ? section.links 
      : section.links.filter(link => 
          !link.moduleId || 
          user.matrix?.some((m: any) => m.moduleId === link.moduleId && m.canView)
        )
  })).filter(section => section.links.length > 0);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-page-bg font-sans text-on-surface overflow-hidden">
      {/* Top Navigation (Mobile/Tablet) */}
      <header className="md:hidden flex justify-between items-center px-4 h-16 w-full bg-surface border-b border-divider sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-on-surface" />
          </button>
          <Link href="/" className="font-semibold text-[24px] text-on-surface hover:text-primary transition-colors">EduCore LMS</Link>
        </div>
        <div className="flex items-center gap-4 text-on-surface">
          <ThemeToggle />
          <NotificationBell />
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-evergreen font-bold text-xs border border-outline/20 overflow-hidden">
            {user?.profilePicture ? (
              <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `${BASE_URL}${user.profilePicture}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              `${user?.firstName?.[0] || 'A'}${user?.lastName?.[0] || 'D'}`
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
      <nav className={`${isMobileMenuOpen ? 'flex absolute inset-y-0 left-0 w-64 shadow-2xl z-50' : 'hidden md:flex relative z-40'} flex-col h-full bg-surface border-r border-divider docked h-screen transition-all duration-300 ${isSidebarCollapsed && !isMobileMenuOpen ? 'w-20' : 'w-64'} py-4 shrink-0 print:hidden`}>
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-8 bg-surface text-on-surface border border-divider rounded-full p-1 shadow-md hover:bg-surface-container transition-colors z-50 hidden md:block"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        {isMobileMenuOpen && (
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden absolute right-4 top-4 p-1.5 text-body-secondary hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="px-4 mb-4 flex flex-col items-center shrink-0">
          <div className="relative inline-block mb-2">
            <div className={`rounded-full bg-primary-fixed-dim flex items-center justify-center text-evergreen font-bold border-2 border-on-primary/20 transition-all overflow-hidden ${isSidebarCollapsed && !isMobileMenuOpen ? 'w-10 h-10 text-sm' : 'w-16 h-16 text-xl'}`}>
              {user?.profilePicture ? (
                <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `${BASE_URL}${user.profilePicture}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                `${user?.firstName?.[0] || 'A'}${user?.lastName?.[0] || 'D'}`
              )}
            </div>
            {(!isSidebarCollapsed || isMobileMenuOpen) && <span className="absolute bottom-0 right-0 w-4 h-4 bg-lime-cream rounded-full border-2 border-evergreen"></span>}
          </div>
          {(!isSidebarCollapsed || isMobileMenuOpen) && (
            <>
              <Link href="/" className="font-semibold text-[20px] text-on-surface text-center mt-1 hover:text-primary transition-colors block">EduCore LMS</Link>
              <span className="bg-primary/10 text-primary font-medium text-[12px] px-3 py-1 rounded-full mt-1 inline-block text-center whitespace-nowrap">Admin Dashboard</span>
            </>
          )}
        </div>
        
        <ul className={`flex flex-col gap-1.5 ${isSidebarCollapsed && !isMobileMenuOpen ? 'px-2' : 'px-3'} flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mt-2`}>
          {allowedSections.map((sectionGroup) => (
            <div key={sectionGroup.section} className="flex flex-col gap-1">
              {(!isSidebarCollapsed || isMobileMenuOpen) && (
                <div className="text-[10px] font-bold text-icon-inactive uppercase tracking-wider px-3 mb-1">
                  {sectionGroup.section}
                </div>
              )}
              {sectionGroup.links.map((link) => {
                const active = isActive(link.path);
                return (
                  <li key={link.path}>
                    <Link 
                      href={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`nav-${link.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${active ? 'bg-primary-container text-on-primary-container' : 'text-body-secondary hover:bg-surface-container hover:text-on-surface'} ${isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}`}
                      title={isSidebarCollapsed && !isMobileMenuOpen ? link.name : undefined}
                    >
                      <link.icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary' : 'text-icon-inactive group-hover:text-primary'}`} />
                      {(!isSidebarCollapsed || isMobileMenuOpen) && <span className="font-medium whitespace-nowrap">{link.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </div>
          ))}
        </ul>

        <div className={`mt-2 shrink-0 flex flex-col gap-2 ${isSidebarCollapsed && !isMobileMenuOpen ? 'px-2 items-center' : 'px-4'}`}>
          {(!isSidebarCollapsed || isMobileMenuOpen) ? (
            <>
              <div className="flex items-center justify-between mb-2 px-3 border border-divider rounded-lg py-2 mx-2 bg-surface-container/30">
                <span className="text-sm font-medium text-on-surface">Theme</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between mb-2 px-3 border border-divider rounded-lg py-2 mx-2 bg-surface-container/30">
                <span className="text-sm font-medium text-on-surface">Notifications</span>
                <NotificationBell />
              </div>
            </>
          ) : (
            <>
              <ThemeToggle className="mb-2" />
              <div className="flex justify-center mb-2"><NotificationBell /></div>
            </>
          )}

          <button onClick={() => {
            if (pathname === '/admin/reports') window.print();
            else router.push('/admin/reports?print=true');
          }} 
          title={isSidebarCollapsed && !isMobileMenuOpen ? "Generate Report" : undefined}
          className={`mx-2 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary/90 transition-colors print:hidden flex items-center justify-center ${isSidebarCollapsed && !isMobileMenuOpen ? 'w-10 h-10 p-0 mx-0' : 'py-2 text-[14px]'}`}>
            {isSidebarCollapsed && !isMobileMenuOpen ? <BarChart3 className="w-5 h-5" /> : 'Generate Report'}
          </button>
          
          <button 
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-body-secondary hover:bg-error-bg hover:text-error ${isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}`}
            title={isSidebarCollapsed && !isMobileMenuOpen ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(!isSidebarCollapsed || isMobileMenuOpen) && <span className="font-medium whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-1 overflow-y-auto bg-page-bg relative flex flex-col">
        {children}
      </main>
    </div>
  );
}
