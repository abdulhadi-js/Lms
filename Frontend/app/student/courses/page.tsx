"use client";

import { useState, useEffect } from 'react';
import { enrollmentsApi } from '@/lib/api';
import Link from 'next/link';
import { BookOpen, GraduationCap, ChevronRight, CheckCircle, Clock } from 'lucide-react';

export default function StudentCoursesPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await enrollmentsApi.list();
        setEnrollments(data);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'ENROLLED': return <Clock className="w-4 h-4 text-primary" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-success" />;
      default: return <Clock className="w-4 h-4 text-body-secondary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ENROLLED': return 'bg-primary-container/20 text-primary border-primary/20';
      case 'COMPLETED': return 'bg-success-bg/30 text-success border-success/20';
      case 'DROPPED': return 'bg-error-bg/30 text-error border-error/20';
      default: return 'bg-surface-container text-body-secondary border-outline/20';
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-heading-on-light flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
            <GraduationCap className="w-6 h-6" />
          </div>
          My Courses
        </h1>
        <p className="text-body-secondary mt-2">View and manage all your enrolled courses for current and past semesters.</p>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider bg-surface">
          <h2 className="text-lg font-semibold text-heading-on-light">All Enrollments</h2>
        </div>
        
        {loading ? (
          <div className="p-6 space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-surface-container-lowest rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : enrollments.length > 0 ? (
          <div className="divide-y divide-divider">
            {enrollments.map((enrollment, i) => (
              <Link 
                href={`/student/courses/${enrollment.course?.id}`} 
                key={enrollment.id || i}
                className="flex items-center p-6 hover:bg-surface-container-lowest transition-colors group block"
              >
                <div className="w-14 h-14 rounded-lg bg-surface-container-low flex flex-shrink-0 items-center justify-center text-primary mr-5 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-primary-container bg-primary-container/10 px-2 py-0.5 rounded uppercase tracking-wider">
                      {enrollment.course?.code || 'CODE'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${getStatusColor(enrollment.status)}`}>
                      {getStatusIcon(enrollment.status)}
                      {enrollment.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                    {enrollment.course?.title || 'Untitled Course'}
                  </h3>
                  <p className="text-sm text-body-secondary truncate mt-0.5">
                    {enrollment.course?.department || 'Department'} • Credits: {enrollment.course?.credits || 3}
                  </p>
                </div>
                
                <div className="ml-4 text-icon-inactive group-hover:text-primary transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-icon-inactive mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-heading-on-light mb-2">No Courses Found</h3>
            <p className="text-body-secondary max-w-md">You are not currently enrolled in any courses. Browse the course catalog to enroll in upcoming classes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
