"use client";
import { useState, useEffect } from 'react';
import { Download, Users, TrendingUp, AlertTriangle, BookOpen, Clock } from 'lucide-react';
import { reportsApi } from '@/lib/api';

export default function ReportsAnalytics() {
  const [overview, setOverview] = useState<any>(null);
  const [atRisk, setAtRisk] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [ovData, riskData, perfData, attData] = await Promise.all([
          reportsApi.overview(),
          reportsApi.atRisk(60), // threshold 60
          reportsApi.performance(),
          reportsApi.attendance()
        ]);
        setOverview(ovData);
        setAtRisk(riskData);
        setPerformance(perfData);
        setAttendance(attData);
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Reports & Analytics</h2>
          <p className="text-sm text-body-secondary mt-1">Comprehensive insights into system performance and student progress.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container transition-colors brand-shadow">
          <Download className="w-4 h-4" />
          Export Full Report
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-body-secondary">Loading analytics data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-divider brand-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-body-secondary">Total Students</p>
                  <h3 className="text-2xl font-bold text-on-surface mt-2">{overview?.totalStudents || 0}</h3>
                </div>
                <div className="p-3 bg-primary-container/20 text-primary-fixed rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-divider brand-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-body-secondary">Active Courses</p>
                  <h3 className="text-2xl font-bold text-on-surface mt-2">{overview?.totalCourses || 0}</h3>
                </div>
                <div className="p-3 bg-primary-container/20 text-primary-fixed rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-divider brand-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-body-secondary">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-on-surface mt-2">${overview?.totalRevenue?.toFixed(2) || '0.00'}</h3>
                </div>
                <div className="p-3 bg-success-bg text-success rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-divider brand-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-body-secondary">At-Risk Students</p>
                  <h3 className="text-2xl font-bold text-on-surface mt-2">{atRisk.length}</h3>
                </div>
                <div className="p-3 bg-error-bg text-error rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-divider brand-shadow">
              <h3 className="text-lg font-bold text-heading-on-light mb-4">Performance Overview</h3>
              <div className="h-64 flex flex-col justify-end items-center border-b border-l border-divider relative pb-4 pl-4">
                <div className="absolute left-0 bottom-0 top-0 w-full flex flex-col justify-between text-xs text-body-secondary pr-4 pb-4">
                  <span className="text-right border-b border-divider/50 w-full relative -left-4 pb-1">100%</span>
                  <span className="text-right border-b border-divider/50 w-full relative -left-4 pb-1">75%</span>
                  <span className="text-right border-b border-divider/50 w-full relative -left-4 pb-1">50%</span>
                  <span className="text-right border-b border-divider/50 w-full relative -left-4 pb-1">25%</span>
                  <span className="text-right w-full relative -left-4">0%</span>
                </div>
                <div className="w-full flex justify-around items-end h-full z-10 pl-8">
                  {/* Placeholder bars */}
                  {[65, 78, 85, 92, 70].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-12 bg-primary rounded-t-sm transition-all hover:opacity-80" style={{ height: `${h}%` }}></div>
                      <span className="text-xs text-body-secondary">Week {i+1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-body-secondary mt-4 text-center">Average Course Grade: {performance?.averageGrade?.toFixed(1) || '0'}%</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-divider brand-shadow flex flex-col">
              <h3 className="text-lg font-bold text-heading-on-light mb-4">Attendance Stats</h3>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-[16px] border-primary-container mb-4">
                  <div className="absolute inset-0 rounded-full border-[16px] border-primary border-t-transparent border-l-transparent transform rotate-45"></div>
                  <div className="text-3xl font-bold text-on-surface">{attendance?.overallAttendancePercentage?.toFixed(0) || '0'}%</div>
                </div>
                <p className="text-sm text-body-secondary">Overall Attendance Rate</p>
                <div className="mt-6 w-full space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-body-secondary flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div> Present</span>
                    <span className="font-medium">{attendance?.totalPresent || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-body-secondary flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-error"></div> Absent</span>
                    <span className="font-medium">{attendance?.totalAbsent || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
            <div className="p-5 border-b border-divider bg-surface">
              <h3 className="text-lg font-bold text-heading-on-light">At-Risk Students</h3>
              <p className="text-sm text-body-secondary">Students with low attendance or poor grades requiring attention.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                    <th className="py-4 px-6 font-semibold">Student</th>
                    <th className="py-4 px-6 font-semibold">Course</th>
                    <th className="py-4 px-6 font-semibold">Average Grade</th>
                    <th className="py-4 px-6 font-semibold">Attendance</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {atRisk.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-body-secondary">No at-risk students found.</td>
                    </tr>
                  ) : (
                    atRisk.map((student, i) => (
                      <tr key={i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                        <td className="py-4 px-6 font-medium text-on-surface">{student.firstName} {student.lastName}</td>
                        <td className="py-4 px-6 text-body-secondary">{student.courseTitle || 'N/A'}</td>
                        <td className="py-4 px-6">
                          <span className={`font-medium ${student.averageGrade < 50 ? 'text-error' : 'text-warning'}`}>{student.averageGrade}%</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-warning">{student.attendancePercentage || 'N/A'}%</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button className="px-3 py-1.5 border border-border-light rounded-lg text-xs font-medium hover:bg-surface-container">
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
