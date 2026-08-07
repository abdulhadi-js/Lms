"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, Users, TrendingUp, AlertTriangle, BookOpen, Clock, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { reportsApi, feesApi } from '@/lib/api';
import Link from 'next/link';

export default function ReportsAnalytics() {
  const searchParams = useSearchParams();
  const [overview, setOverview] = useState<any>(null);
  const [atRisk, setAtRisk] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [ovData, riskData, perfData, attData, feesData] = await Promise.all([
          reportsApi.overview(),
          reportsApi.atRisk(undefined, 60),
          reportsApi.performance(),
          reportsApi.attendance(),
          feesApi.list()
        ]);
        setOverview(ovData);
        setAtRisk(riskData);
        setFees(feesData.data || feesData || []);
        
        const perfArray = Array.isArray(perfData) ? perfData : [];
        setPerformanceData(perfArray);
        
        const attArray = Array.isArray(attData) ? attData : [];
        const totalP = attArray.reduce((acc: number, curr: any) => acc + (curr.totalPresent || 0), 0);
        const totalA = attArray.reduce((acc: number, curr: any) => acc + (curr.totalAbsent || 0), 0);
        const totalClasses = totalP + totalA;
        setAttendance({
          overallAttendancePercentage: totalClasses > 0 ? (totalP / totalClasses) * 100 : 0,
          totalPresent: totalP,
          totalAbsent: totalA
        });

        if (searchParams.get('print') === 'true') {
          setTimeout(() => { window.print(); }, 500);
        }
      } catch (error) {
        console.error('Failed to load reports', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [searchParams]);

  const avgGrade = performanceData.length > 0
    ? performanceData.reduce((acc, curr) => acc + Number(curr.averagePercentage || 0), 0) / performanceData.length
    : 0;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Reports & Analytics</h2>
          <p className="text-sm text-body-secondary mt-1">Comprehensive insights into system performance and student progress.</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Link href="/admin/reports/pnl" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
            <span className="text-xs font-bold">Rs.</span>
            P&L Closing
          </Link>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container transition-colors brand-shadow">
            <Download className="w-4 h-4" />
            Export Full Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-body-secondary">Loading analytics data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-surface p-5 rounded-xl border border-divider brand-shadow">
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
            
            <div className="bg-surface p-5 rounded-xl border border-divider brand-shadow">
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

            <div className="bg-surface p-5 rounded-xl border border-divider brand-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-body-secondary">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-on-surface mt-2">Rs. {Number(overview?.totalFeesCollected || 0).toLocaleString('en-PK')}</h3>
                </div>
                <div className="p-3 bg-success-bg text-success rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-divider brand-shadow">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-surface p-5 rounded-xl border border-divider brand-shadow">
              <h3 className="text-lg font-bold text-heading-on-light mb-1">Performance Overview</h3>
              <p className="text-xs text-body-secondary mb-4">Average grade percentage per course</p>
              {performanceData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-body-secondary text-sm">No performance data available yet.</div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData.slice(0, 8)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--divider)" />
                      <XAxis dataKey={(course) => course.courseTitle || course.courseId?.slice(0, 6) || 'Course'} tick={{fontSize: 12, fill: 'var(--body-secondary)'}} tickLine={false} axisLine={false} />
                      <YAxis tick={{fontSize: 12, fill: 'var(--body-secondary)'}} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip cursor={{fill: 'var(--surface-container-low)'}} contentStyle={{backgroundColor: 'var(--surface)', borderColor: 'var(--border-light)', borderRadius: '8px', color: 'var(--on-surface)'}} />
                      <Bar dataKey="averagePercentage" name="Average Grade" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <p className="text-sm text-body-secondary mt-4 text-center">Average Course Grade: {avgGrade.toFixed(1)}%</p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-divider brand-shadow flex flex-col">
              <h3 className="text-lg font-bold text-heading-on-light mb-4">Attendance Stats</h3>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 -mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Present', value: attendance?.totalPresent || 0 },
                          { name: 'Absent', value: attendance?.totalAbsent || 0 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="var(--primary)" />
                        <Cell fill="var(--error)" />
                      </Pie>
                      <Tooltip contentStyle={{backgroundColor: 'var(--surface)', borderColor: 'var(--border-light)', borderRadius: '8px', color: 'var(--on-surface)'}} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-on-surface">{attendance?.overallAttendancePercentage?.toFixed(0) || '0'}%</span>
                  </div>
                </div>
                <p className="text-sm text-body-secondary mt-2">Overall Attendance Rate</p>
                <div className="mt-4 w-full space-y-3">
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

          <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
            <div className="p-5 border-b border-divider bg-surface">
              <h3 className="text-lg font-bold text-heading-on-light">At-Risk Students</h3>
              <p className="text-sm text-body-secondary">Students with low attendance or poor grades requiring attention.</p>
            </div>
            
            <div className="overflow-x-auto">
              {/* Mobile Card View */}
              <div className="md:hidden p-4 space-y-4">
                {atRisk.length === 0 ? (
                  <div className="text-center text-body-secondary py-4">No at-risk students found.</div>
                ) : (
                  atRisk.map((student, i) => (
                    <div key={i} className="bg-surface p-4 rounded-xl border border-divider shadow-sm relative">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-bold text-on-surface">{student.studentId}</div>
                        <button className="px-3 py-1.5 border border-border-light rounded-lg text-xs font-medium hover:bg-surface-container">
                          View Profile
                        </button>
                      </div>
                      <div className="text-sm text-body-secondary mb-3">{student.riskReason || 'N/A'}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm pt-3 border-t border-divider">
                        <div className="text-body-secondary">Average Grade:</div>
                        <div className={`text-right font-medium ${student.avgMark < 50 ? 'text-error' : 'text-warning'}`}>
                          {student.avgMark ? Number(student.avgMark).toFixed(1) + '%' : 'N/A'}
                        </div>
                        <div className="text-body-secondary">Attendance:</div>
                        <div className="text-right font-medium text-warning">
                          {student.avgAttendance ? Number(student.avgAttendance).toFixed(1) + '%' : 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <table className="hidden md:table w-full text-left border-collapse">
                <thead>
                  <tr className="text-body-secondary text-[11px] uppercase tracking-wider border-b border-divider">
                    <th className="py-3 px-4 font-semibold">Student</th>
                    <th className="py-3 px-4 font-semibold">Course</th>
                    <th className="py-3 px-4 font-semibold">Average Grade</th>
                    <th className="py-3 px-4 font-semibold">Attendance</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {atRisk.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-body-secondary">No at-risk students found.</td>
                    </tr>
                  ) : (
                    atRisk.map((student, i) => (
                      <tr key={i} className="border-b border-border-light  hover:bg-surface transition-colors">
                        <td className="py-3 px-4 font-medium text-on-surface text-xs">{student.studentId}</td>
                        <td className="py-3 px-4 text-body-secondary">{student.riskReason || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${student.avgMark < 50 ? 'text-error' : 'text-warning'}`}>{student.avgMark ? Number(student.avgMark).toFixed(1) + '%' : 'N/A'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-warning">{student.avgAttendance ? Number(student.avgAttendance).toFixed(1) + '%' : 'N/A'}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
              <div className="p-5 border-b border-divider bg-surface flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-heading-on-light">Monthly Fee Defaulter List</h3>
                  <p className="text-sm text-body-secondary">Students with outstanding fee dues for the current month.</p>
                </div>
                <button onClick={() => window.print()} className="border border-border-light bg-surface px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-surface-container flex items-center gap-2">
                  <Download className="w-3 h-3" /> Print Defaulter List
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-body-secondary text-[11px] uppercase tracking-wider border-b border-divider">
                      <th className="py-3 px-4 font-semibold">Student Name</th>
                      <th className="py-3 px-4 font-semibold">Fee Type</th>
                      <th className="py-3 px-4 font-semibold">Amount Due (Rs.)</th>
                      <th className="py-3 px-4 font-semibold">Due Date</th>
                      <th className="py-3 px-4 font-semibold text-right">Days Overdue</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {(() => {
                      const defaulters = fees.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE');
                      if (defaulters.length === 0) return <tr><td colSpan={5} className="py-8 text-center text-body-secondary">No outstanding fees found.</td></tr>;
                      return defaulters.map((f, i) => {
                        const dueDate = new Date(f.dueDate);
                        const daysOverdue = Math.max(0, Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
                        return (
                          <tr key={i} className="border-b border-border-light hover:bg-surface-container/10 transition-colors">
                            <td className="py-3 px-4 font-medium text-on-surface text-xs">{f.student?.firstName} {f.student?.lastName}</td>
                            <td className="py-3 px-4 text-body-secondary">{f.feeType}</td>
                            <td className="py-3 px-4 font-bold text-error">Rs. {Number(f.amount || 0).toLocaleString('en-PK')}</td>
                            <td className="py-3 px-4 text-body-secondary">{new Date(f.dueDate).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-right font-medium text-error">{daysOverdue} days</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-divider brand-shadow flex flex-col">
              <h3 className="text-lg font-bold text-heading-on-light mb-4">Fee Collection by Type</h3>
              <div className="flex-1 space-y-4">
                {(() => {
                  const grouped = fees.reduce((acc, f) => {
                    const type = f.feeType || 'OTHER';
                    if (!acc[type]) acc[type] = { collected: 0, total: 0 };
                    acc[type].total += Number(f.amount || 0);
                    if (f.status === 'PAID') acc[type].collected += Number(f.amount || 0);
                    return acc;
                  }, {} as Record<string, {collected: number, total: number}>);
                  
                  const entries = Object.entries(grouped);
                  if (entries.length === 0) return <div className="text-sm text-body-secondary py-4">No fee data available.</div>;

                  return entries.map(([type, data]) => {
                    const percent = data.total > 0 ? (data.collected / data.total) * 100 : 0;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-on-surface">{type}</span>
                          <span className="text-body-secondary">Rs. {Number(data.collected).toLocaleString('en-PK')} / Rs. {Number(data.total).toLocaleString('en-PK')}</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
