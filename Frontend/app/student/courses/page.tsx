"use client";

import { useState, useEffect } from 'react';
import { enrollmentsApi, assignmentsApi, marksApi, authApi } from '@/lib/api';
import Link from 'next/link';
import { BookOpen, GraduationCap, ChevronRight, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function StudentCoursesPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [enrs, assts, me] = await Promise.all([
          enrollmentsApi.list(),
          assignmentsApi.list(),
          authApi.me()
        ]);
        
        let m: any[] = [];
        if (me?.id) {
          try {
            m = await marksApi.getStudentMarks(me.id);
          } catch (e) {
            console.error('Failed to load marks:', e);
          }
        }

        setEnrollments(enrs);
        setAssignments(assts);
        setMarks(m);
        setUser(me);
      } catch (error) {
        console.error('Failed to load courses data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'ACTIVE': return <Clock className="w-4 h-4 text-primary" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'DROPPED': return <XCircle className="w-4 h-4 text-error" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-primary-container/20 text-primary border-primary/20';
      case 'COMPLETED': return 'bg-success-bg/30 text-success border-success/20';
      case 'DROPPED': return 'bg-error-bg/30 text-error border-error/20';
      default: return 'bg-surface-container text-body-secondary border-outline/20';
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-heading-on-light flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
            <GraduationCap className="w-6 h-6" />
          </div>
          My Subjects
        </h1>
        <p className="text-body-secondary mt-2">View and manage all your enrolled subjects for current and past terms.</p>
      </div>

      {/* Courses Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-surface-container-lowest rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {enrollments.map((enrollment, i) => {
            const courseId = enrollment.course?.id;
            const courseAssts = assignments.filter((a: any) => a.courseId === courseId);
            const totalAssts = courseAssts.length;
            let gradedAssts = 0;
            if (totalAssts > 0) {
              courseAssts.forEach(a => {
                if (marks.some((m: any) => m.assignmentId === a.id)) {
                  gradedAssts++;
                }
              });
            }
            
            let progress = totalAssts === 0 ? 0 : Math.round((gradedAssts / totalAssts) * 100);
            progress = Math.min(100, Math.max(0, progress));

            const isCompleted = enrollment.status === 'COMPLETED';
            const isDropped = enrollment.status === 'DROPPED';

            return (
              <div 
                key={enrollment.id || i}
                className={`bg-surface rounded-xl border border-divider brand-shadow p-6 hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col h-full ${
                  isDropped ? 'opacity-70 grayscale-[50%]' : ''
                }`}
              >
                {/* Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary to-lime-cream"></div>
                
                {/* Completed Overlay */}
                {isCompleted && (
                  <div className="absolute -top-3 -right-3 w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success absolute bottom-3 left-3" />
                  </div>
                )}

                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-primary-container bg-primary-container/10 px-2 py-0.5 rounded uppercase tracking-wider">
                      {enrollment.course?.code || 'CODE'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${getStatusColor(enrollment.status)}`}>
                      {getStatusIcon(enrollment.status)}
                      {enrollment.status}
                    </span>
                    {enrollment.course?.credits && (
                      <span className="text-[10px] font-semibold bg-surface-container text-body-secondary px-2 py-0.5 rounded-full border border-divider">
                        {enrollment.course.credits} Total Marks
                      </span>
                    )}
                  </div>

                  {/* Title & Info */}
                  <h3 className="text-xl font-bold text-on-surface line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {enrollment.course?.title || 'Untitled Subject'}
                  </h3>
                  
                  {enrollment.course?.teacher && (
                    <p className="text-sm text-body-secondary mb-4 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-[10px] text-on-surface">
                        {enrollment.course.teacher.name?.charAt(0) || 'T'}
                      </span>
                      {enrollment.course.teacher.name}
                    </p>
                  )}
                </div>

                {/* Progress Bar & Footer */}
                <div className="mt-6 pt-5 border-t border-divider">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Subject Progress</span>
                    <span className="text-sm font-bold text-on-surface">{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden mb-5">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-container to-lime-cream transition-all duration-1000 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <Link 
                    href={`/student/courses/${courseId}`}
                    className="w-full py-2.5 rounded-lg bg-surface-container-lowest border border-divider text-sm font-semibold text-on-surface flex items-center justify-center gap-2 hover:bg-primary hover:text-on-primary hover:border-primary transition-colors"
                  >
                    View Subject
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-icon-inactive mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-heading-on-light mb-2">No Subjects Found</h3>
            <p className="text-body-secondary max-w-md">You are not currently enrolled in any subjects.</p>
          </div>
        </div>
      )}
    </div>
  );
}
