"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, PlayCircle, Loader2 } from 'lucide-react';
import { examsApi, enrollmentsApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function StudentExams() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Get all enrolled courses for the student
        const enrollments = await enrollmentsApi.list();
        
        let allExams: any[] = [];
        for (const e of enrollments) {
          if (e.status === 'ENROLLED' && e.course) {
             const res = await examsApi.getExams(e.course.id);
             allExams = [...allExams, ...(res.data || res || [])];
          }
        }
        
        // Filter to only PUBLISHED exams
        const publishedExams = allExams.filter(exam => exam.status === 'PUBLISHED');
        setExams(publishedExams);
      } catch (err) {
        toast.error('Failed to load exams');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getExamStatus = (exam: any) => {
    const now = new Date().getTime();
    const start = new Date(exam.startTime).getTime();
    const end = new Date(exam.endTime).getTime();

    if (now < start) return 'UPCOMING';
    if (now > end) return 'MISSED';
    return 'AVAILABLE';
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-heading-on-light">Online Exams (CBT)</h2>
        <p className="text-sm text-body-secondary mt-1">View and take your scheduled computer-based tests.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.length === 0 ? (
            <div className="col-span-full py-12 text-center text-body-secondary border border-dashed border-divider rounded-xl bg-surface">
              No online exams scheduled at the moment.
            </div>
          ) : exams.map(exam => {
            const status = getExamStatus(exam);
            return (
              <div key={exam.id} className="bg-surface rounded-xl border border-divider brand-shadow p-5 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-on-surface line-clamp-1">{exam.title}</h3>
                  {status === 'UPCOMING' && <span className="px-2 py-1 bg-surface-container-high text-body-secondary text-xs font-bold rounded">UPCOMING</span>}
                  {status === 'AVAILABLE' && <span className="px-2 py-1 bg-success/20 text-success text-xs font-bold rounded animate-pulse">AVAILABLE</span>}
                  {status === 'MISSED' && <span className="px-2 py-1 bg-error/20 text-error text-xs font-bold rounded">CLOSED</span>}
                </div>
                
                <div className="space-y-2 mb-6 text-sm text-body-secondary flex-grow">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-icon-inactive" /> {exam.durationMinutes} Minutes</div>
                  <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-icon-inactive" /> {exam.totalMarks} Total Marks</div>
                  <div className="pt-2 border-t border-divider mt-2 text-xs">
                    <div><strong>Starts:</strong> {new Date(exam.startTime).toLocaleString()}</div>
                    <div><strong>Ends:</strong> {new Date(exam.endTime).toLocaleString()}</div>
                  </div>
                </div>

                <button 
                  onClick={() => router.push(`/student/exams/${exam.id}`)}
                  disabled={status !== 'AVAILABLE'}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all
                    disabled:opacity-50 disabled:bg-surface-container-high disabled:text-icon-inactive
                    bg-primary text-white hover:bg-primary-hover shadow-md
                  "
                >
                  <PlayCircle className="w-4 h-4" /> 
                  {status === 'UPCOMING' ? 'Not Started Yet' : status === 'MISSED' ? 'Exam Ended' : 'Start Exam'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
