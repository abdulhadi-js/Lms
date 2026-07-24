"use client";
import { useState, useEffect } from 'react';
import { TrendingUp, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { reportsApi, coursesApi } from '@/lib/api';

export default function TeacherAnalytics() {
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
        }
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setLoading(false);
      return;
    }
    
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [perfData, attData, riskData] = await Promise.all([
          reportsApi.performance(selectedCourseId),
          reportsApi.attendance(selectedCourseId),
          reportsApi.atRisk(65)
        ]);
        setPerformance(perfData);
        setAttendance(attData);
        
        // Filter at-risk students for the selected course if backend returns all
        const courseAtRisk = riskData.filter((r: any) => r.courseId === selectedCourseId || !r.courseId);
        setAtRisk(courseAtRisk);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedCourseId]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Course Analytics</h2>
          <p className="text-sm text-body-secondary mt-1">Monitor performance and attendance for your classes.</p>
        </div>
        
        {courses.length > 0 && (
          <select 
            className="bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary brand-shadow"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-body-secondary">Loading analytics data...</div>
      ) : !selectedCourseId ? (
        <div className="p-12 text-center text-body-secondary bg-white rounded-xl border border-divider">No courses assigned to display analytics.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-divider brand-shadow flex items-start gap-4">
              <div className="p-3 bg-primary-container/20 text-primary-fixed rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-body-secondary">Average Grade</p>
                <h3 className="text-2xl font-bold text-on-surface mt-1">{performance?.averageGrade?.toFixed(1) || '0.0'}%</h3>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-divider brand-shadow flex items-start gap-4">
              <div className="p-3 bg-success-bg text-success rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-body-secondary">Attendance Rate</p>
                <h3 className="text-2xl font-bold text-on-surface mt-1">{attendance?.overallAttendancePercentage?.toFixed(0) || '0'}%</h3>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-divider brand-shadow flex items-start gap-4">
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
            <div className="bg-white p-6 rounded-xl border border-divider brand-shadow">
              <h3 className="text-lg font-bold text-heading-on-light mb-4">Grade Distribution</h3>
              <div className="h-64 flex flex-col justify-end items-center border-b border-l border-divider relative pb-4 pl-4">
                <div className="w-full flex justify-around items-end h-full z-10 pl-4">
                  {/* Mock bars for distribution */}
                  {[
                    { label: 'A (90-100)', height: 35 },
                    { label: 'B (80-89)', height: 45 },
                    { label: 'C (70-79)', height: 20 },
                    { label: 'D (60-69)', height: 10 },
                    { label: 'F (<60)', height: 5 }
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-10 bg-primary rounded-t-sm transition-all hover:opacity-80" style={{ height: `${bar.height}%` }}></div>
                      <span className="text-xs text-body-secondary">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden flex flex-col">
              <div className="p-5 border-b border-divider bg-surface">
                <h3 className="text-lg font-bold text-heading-on-light">At-Risk Students</h3>
                <p className="text-sm text-body-secondary">Students requiring attention (Grade &lt; 65%).</p>
              </div>
              
              <div className="overflow-y-auto flex-1">
                {atRisk.length === 0 ? (
                  <div className="p-8 text-center text-body-secondary">No at-risk students found for this course.</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                        <th className="py-3 px-4 font-semibold">Student</th>
                        <th className="py-3 px-4 font-semibold">Grade</th>
                        <th className="py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {atRisk.map((student, i) => (
                        <tr key={i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                          <td className="py-3 px-4 font-medium text-on-surface">{student.firstName} {student.lastName}</td>
                          <td className="py-3 px-4 text-error font-medium">{student.averageGrade}%</td>
                          <td className="py-3 px-4">
                            <button className="text-primary hover:underline font-medium text-xs">Message</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
