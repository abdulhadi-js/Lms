"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, BookOpen, Clock, Users, Edit, Trash2, Settings } from 'lucide-react';
import Link from 'next/link';

export default function CourseManagement() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as Element).closest('.course-actions-dropdown')) return;
      setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Course Management</h2>
          <p className="text-sm text-body-secondary mt-1">Create, organize, and oversee academic programs.</p>
        </div>
        <button className="flex items-center gap-2 primary-gradient text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow">
          <Plus className="h-4 w-4" />
          Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { id: 'CS-101', title: 'Introduction to Computer Science', instructor: 'Dr. Alan Turing', students: 142, status: 'Active', category: 'Computer Science', credits: 4 },
          { id: 'MGT-201', title: 'Principles of Management', instructor: 'Prof. Peter Drucker', students: 85, status: 'Active', category: 'Business Administration', credits: 3 },
          { id: 'ENG-102', title: 'Academic Writing', instructor: 'Dr. Virginia Woolf', students: 110, status: 'Active', category: 'Humanities', credits: 3 },
          { id: 'MATH-205', title: 'Linear Algebra', instructor: 'Dr. Emmy Noether', students: 64, status: 'Upcoming', category: 'Mathematics', credits: 4 },
          { id: 'PHY-101', title: 'Classical Mechanics', instructor: 'Prof. Isaac Newton', students: 95, status: 'Active', category: 'Physics', credits: 4 },
          { id: 'ART-301', title: 'Digital Media Arts', instructor: 'Unassigned', students: 0, status: 'Draft', category: 'Fine Arts', credits: 3 },
        ].map((course, i) => (
          <div key={i} className="bg-white rounded-xl border border-divider brand-shadow overflow-visible flex flex-col group hover:-translate-y-1 transition-transform duration-300">
            <div className="p-5 border-b border-divider flex-1 relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-primary-container bg-primary-container/10 px-2.5 py-1 rounded-md uppercase tracking-wider">{course.id}</span>
                <div className="relative course-actions-dropdown">
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                    className="text-icon-inactive hover:text-primary transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  
                  {openDropdown === i && (
                    <div className="absolute right-0 top-6 w-48 bg-white rounded-lg shadow-xl border border-divider py-1 z-50 animate-in fade-in zoom-in duration-200">
                      <button className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                        <Edit className="w-4 h-4 text-icon-inactive" /> Edit Details
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                        <Settings className="w-4 h-4 text-icon-inactive" /> Manage Syllabus
                      </button>
                      <hr className="my-1 border-divider" />
                      <button className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-bg flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Archive Course
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-bold text-heading-on-light mb-2 leading-tight">{course.title}</h3>
              <p className="text-sm text-body-secondary mb-4">{course.category}</p>
              
              <div className="space-y-2 mt-auto">
                <div className="flex items-center text-sm text-body-secondary">
                  <BookOpen className="h-4 w-4 mr-2 text-icon-inactive" />
                  <span className="font-medium text-on-surface mr-1">Instructor:</span> {course.instructor}
                </div>
                <div className="flex items-center text-sm text-body-secondary">
                  <Users className="h-4 w-4 mr-2 text-icon-inactive" />
                  <span className="font-medium text-on-surface mr-1">{course.students}</span> Enrolled Students
                </div>
                <div className="flex items-center text-sm text-body-secondary">
                  <Clock className="h-4 w-4 mr-2 text-icon-inactive" />
                  <span className="font-medium text-on-surface mr-1">{course.credits}</span> Credit Hours
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-4 flex justify-between items-center rounded-b-xl">
              <div>
                 {course.status === 'Active' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-bg text-success border border-success/20">Active Session</span>}
                 {course.status === 'Upcoming' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-info-bg text-info border border-info/20">Upcoming</span>}
                 {course.status === 'Draft' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-container text-body-secondary border border-border-light">Draft</span>}
              </div>
              <Link href="#" className="text-sm font-semibold text-primary hover:underline">Manage</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
