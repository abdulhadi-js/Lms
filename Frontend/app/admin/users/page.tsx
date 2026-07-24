"use client";
import { useState, useRef, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, Shield, UserX, UserCheck, Edit, Trash2 } from 'lucide-react';

export default function UserManagement() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as Element).closest('.actions-dropdown')) return;
      setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Student Management</h2>
          <p className="text-sm text-body-secondary mt-1">Manage enrollments, statuses, and student records.</p>
        </div>
        <button className="flex items-center gap-2 primary-gradient text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow">
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-icon-inactive" />
              <input type="text" placeholder="Search by name, ID, or email..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-border-light bg-white rounded-lg text-sm font-medium text-body-secondary hover:text-primary transition-colors">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select className="bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                <th className="py-4 px-6 font-semibold">Student</th>
                <th className="py-4 px-6 font-semibold">ID / Contact</th>
                <th className="py-4 px-6 font-semibold">Program</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Enrolled</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: 'Sarah Ahmed', email: 'sarah.ahmed@student.edu', id: 'STD-2026-042', prog: 'BSc Computer Science', status: 'Active', date: '10 Aug 2026' },
                { name: 'Mohammad Hassan', email: 'm.hassan@student.edu', id: 'STD-2026-089', prog: 'MBA Regular', status: 'Pending Review', date: '09 Oct 2026' },
                { name: 'Fatima Ali', email: 'fatima.a@student.edu', id: 'STD-2025-112', prog: 'BSc Computer Science', status: 'Active', date: '15 Sep 2025' },
                { name: 'Zain Malik', email: 'zain.malik@student.edu', id: 'STD-2026-015', prog: 'BA English Literature', status: 'Inactive', date: '02 Feb 2026' },
                { name: 'Ayesha Khan', email: 'ayesha.k@student.edu', id: 'STD-2026-103', prog: 'BSc Mathematics', status: 'Active', date: '22 Aug 2026' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors group relative">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container font-bold text-sm">
                        {row.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">{row.name}</div>
                        <div className="text-xs text-body-secondary">{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-on-surface font-medium">{row.id}</div>
                  </td>
                  <td className="py-4 px-6 text-body-secondary">{row.prog}</td>
                  <td className="py-4 px-6">
                    {row.status === 'Active' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20"><UserCheck className="w-3 h-3 mr-1" /> Active</span>}
                    {row.status === 'Pending Review' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-bg text-warning border border-warning/20">Pending Review</span>}
                    {row.status === 'Inactive' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20"><UserX className="w-3 h-3 mr-1" /> Inactive</span>}
                  </td>
                  <td className="py-4 px-6 text-body-secondary">{row.date}</td>
                  <td className="py-4 px-6 text-right relative actions-dropdown">
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                      className="text-icon-inactive hover:text-primary transition-colors p-1.5 rounded-md hover:bg-surface-container"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    
                    {openDropdown === i && (
                      <div className="absolute right-6 top-10 w-48 bg-white rounded-lg shadow-lg border border-divider py-1 z-50 animate-in fade-in zoom-in duration-200">
                        <button className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                          <Edit className="w-4 h-4 text-icon-inactive" /> Edit Details
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                          <Shield className="w-4 h-4 text-icon-inactive" /> Reset Password
                        </button>
                        <hr className="my-1 border-divider" />
                        <button className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-bg flex items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Deactivate Student
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-divider flex items-center justify-between bg-surface-container-lowest text-sm">
          <div className="text-body-secondary">
            Showing <span className="font-medium text-on-surface">1</span> to <span className="font-medium text-on-surface">5</span> of <span className="font-medium text-on-surface">1,248</span> students
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-border-light rounded-md text-body-secondary hover:bg-surface-container disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 bg-primary-container text-white rounded-md font-medium">1</button>
            <button className="px-3 py-1.5 border border-border-light rounded-md text-body-secondary hover:bg-surface-container">2</button>
            <button className="px-3 py-1.5 border border-border-light rounded-md text-body-secondary hover:bg-surface-container">3</button>
            <span className="px-2 py-1.5 text-body-secondary">...</span>
            <button className="px-3 py-1.5 border border-border-light rounded-md text-body-secondary hover:bg-surface-container">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
