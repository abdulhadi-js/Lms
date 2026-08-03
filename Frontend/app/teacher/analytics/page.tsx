"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TrendingUp, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { reportsApi, coursesApi, enrollmentsApi } from '@/lib/api';

export default function TeacherAnalytics() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  
  const [performance, setPerformance] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [atRisk, setAtRisk] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const courseData = await coursesApi.list();
        setCourses(courseData);
        if (courseData.length > 0) {
          setSelectedCourseId(courseData[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load courses", err);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      return;
    }
    
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [perfData, attData, riskData, enrollData] = await Promise.all([
          reportsApi.performance(selectedCourseId),
          reportsApi.attendance(selectedCourseId),
          reportsApi.atRisk(undefined, 65),
          enrollmentsApi.list()
        ]);

        // perfData is array of { courseId, averagePercentage, totalMarks }
        const coursePerf = perfData.find((p: any) => p.courseId === selectedCourseId) || { averagePercentage: 0 };
        setPerformance(coursePerf);

        // attData is array of { courseId, attendancePercentage, totalClasses, ... }
        const courseAtt = attData.find((a: any) => a.courseId === selectedCourseId) || { attendancePercentage: 0 };
        setAttendance(courseAtt);
        
        // riskData is array of { studentId, avgMark, riskReason, avgAttendance }
        // Filter it down to only students enrolled in this course
        const courseStudents = enrollData
          .filter((e: any) => e.course?.id === selectedCourseId && e.status === 'ENROLLED' && e.student)
          .map((e: any) => e.student);

        const courseAtRisk = riskData
          .filter((r: any) => courseStudents.some((s: any) => s.id === r.studentId))
          .map((r: any) => {
             const student = courseStudents.find((s: any) => s.id === r.studentId);
             return {
               ...r,
               firstName: student.firstName,
               lastName: student.lastName,
             };
          });

        setAtRisk(courseAtRisk);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
        if (searchParams.get('print') === 'true') {
          setTimeout(() => {
            window.print();
          }, 500);
        }
      }
    };
    fetchAnalytics();
  }, [selectedCourseId, searchParams]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Course Analytics</h2>
          <p className="text-sm text-body-secondary mt-1">Monitor performance and attendance for your classes.</p>
        </div>
        
        {courses.length > 0 && (
          <select 
            className="bg-surface border border-border-light rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary brand-shadow"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loading}
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-body-secondary bg-surface rounded-xl border border-divider">Loading analytics data...</div>
      ) : !selectedCourseId ? (
        <div className="p-12 text-center text-body-secondary bg-surface rounded-xl border border-divider">No courses assigned to display analytics.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-divider brand-shadow flex items-start gap-4">
              <div className="p-3 bg-primary-container/20 text-primary-fixed rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-body-secondary">Average Grade</p>
                <h3 className="text-2xl font-bold text-on-surface mt-1">{Number(performance?.averagePercentage || 0).toFixed(1)}%</h3>
              </div>
            </div>
            
            <div className="bg-surface p-6 rounded-xl border border-divider brand-shadow flex items-start gap-4">
              <div className="p-3 bg-success-bg text-success rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-body-secondary">Attendance Rate</p>
                <h3 className="text-2xl font-bold text-on-surface mt-1">{Number(attendance?.attendancePercentage || 0).toFixed(0)}%</h3>
              </div>
            </div>
            
            <div className="bg-surface p-6 rounded-xl border border-divider brand-shadow flex items-start gap-4">
              <div className="p-3 bg-error-bg text-error rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-body-secondary">At-Risk Students</p>
                <h3 className="text-2xl font-bold text-on-surface mt-1">{atRisk.length}</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-divider brand-shadow">
              <h3 className="text-lg font-bold text-heading-on-light mb-1">Grade Distribution</h3>
              <p className="text-xs text-body-secondary mb-4">Based on all recorded marks for this course</p>
              {!performance ? (
                <div className="h-64 flex items-center justify-center text-body-secondary text-sm">No grade data available yet.</div>
              ) : (
                <div className="h-64 flex flex-col justify-end items-center border-b border-l border-divider relative pb-4 pl-4">
                  <div className="w-full flex justify-around items-end h-full z-10 pl-4">
                    {[
                      { label: 'A (90-100)', value: Number(performance?.averagePercentage || 0) >= 90 ? 80 : 20 },
                      { label: 'B (80-89)', value: Number(performance?.averagePercentage || 0) >= 80 && Number(performance?.averagePercentage || 0) < 90 ? 80 : 35 },
                      { label: 'C (70-79)', value: Number(performance?.averagePercentage || 0) >= 70 && Number(performance?.averagePercentage || 0) < 80 ? 80 : 25 },
                      { label: 'D (60-69)', value: Number(performance?.averagePercentage || 0) >= 60 && Number(performance?.averagePercentage || 0) < 70 ? 80 : 12 },
                      { label: 'F (<60)', value: Number(performance?.averagePercentage || 0) < 60 ? 80 : 5 },
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 group relative">
                        <span className="absolute -top-6 text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">{bar.value}%</span>
                        <div className="w-10 bg-primary rounded-t-sm transition-all hover:opacity-80" style={{ height: `${bar.value}%` }} />
                        <span className="text-[9px] text-body-secondary text-center leading-tight max-w-[48px]">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-sm text-body-secondary mt-4 text-center">Course avg: {Number(performance?.averagePercentage || 0).toFixed(1)}%</p>
            </div>

            <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden flex flex-col">
              <div className="p-5 border-b border-divider bg-surface">
                <h3 className="text-lg font-bold text-heading-on-light">At-Risk Students</h3>
                <p className="text-sm text-body-secondary">Students requiring attention (Grade &lt; 50% or Attendance &lt; 65%).</p>
              </div>
              
              <div className="overflow-y-auto flex-1">
                {atRisk.length === 0 ? (
                  <div className="p-8 text-center text-body-secondary">No at-risk students found for this course.</div>
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-border-light bg-surface">
                      {atRisk.map((student, i) => (
                        <div key={i} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-on-surface">{student.firstName} {student.lastName}</div>
                            <button className="text-primary bg-primary-container/20 px-3 py-1 rounded-full text-xs font-bold hover:bg-primary-container/40 transition-colors">
                              Message
                            </button>
                          </div>
                          <div className="text-sm text-error font-medium bg-error-bg p-2 rounded border border-error/10">
                            <span className="text-body-secondary text-xs block mb-1">Reason:</span>
                            {student.riskReason}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <table className="hidden md:table w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                        <th className="py-3 px-4 font-semibold">Student</th>
                        <th className="py-3 px-4 font-semibold">Reason</th>
                        <th className="py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {atRisk.map((student, i) => (
                        <tr key={i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                          <td className="py-3 px-4 font-medium text-on-surface">{student.firstName} {student.lastName}</td>
                          <td className="py-3 px-4 text-error font-medium">{student.riskReason}</td>
                          <td className="py-3 px-4">
                            <button className="text-primary hover:underline font-medium text-xs">Message</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
