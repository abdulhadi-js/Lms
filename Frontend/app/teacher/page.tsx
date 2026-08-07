"use client";

import { useState, useEffect } from 'react';
import { Bell, Settings, ArrowRight, Edit, ClipboardCheck, MessageSquare, Upload, MapPin, Users, MoreHorizontal, Download, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { coursesApi, assignmentsApi, timetableApi, BASE_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [assignmentsData, timetableDataResponse] = await Promise.all([
          assignmentsApi.list(),
          timetableApi.list()
        ]);
        
        // Extract teacher's timetable
        const myTimetable = Array.isArray(timetableDataResponse) 
          ? timetableDataResponse.filter((t: any) => t.teacherId === user?.id || t.teacher?.id === user?.id)
          : [];
          
        setTimetable(myTimetable);
        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
        
        // Extract unique subjects from timetable for "Courses"
        const subjectsMap = new Map();
        myTimetable.forEach((t: any) => {
          if (t.subject && !subjectsMap.has(t.subject.id)) {
            subjectsMap.set(t.subject.id, {
              id: t.subject.id,
              title: t.subject.name,
              code: t.subject.code,
              status: 'ACTIVE',
              studentsCount: t.section?.capacity || 20 // Estimate
            });
          }
        });
        
        setCourses(Array.from(subjectsMap.values()));
      } catch (error: any) {
        toast.error('Could not load some dashboard data.');
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalStudents = courses.reduce((acc, course) => acc + (course.studentsCount || 0), 0);
  const activeCourses = courses.filter(c => c.status === 'ACTIVE').length || courses.length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-semibold text-[20px] font-bold text-heading-on-light">
            {getGreeting()},{user?.lastName ? ` Prof. ${user.lastName}` : (user?.firstName ? ` Prof. ${user.firstName}` : '')} 👋
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-icon-inactive hover:bg-surface-container-high transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-icon-inactive hover:bg-surface-container-high transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          {user?.profilePicture ? (
            <img 
              className="w-10 h-10 rounded-full object-cover border border-outline/20" 
              alt="Teacher" 
              src={user.profilePicture.startsWith('http') ? user.profilePicture : `${BASE_URL}${user.profilePicture}`}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-evergreen font-bold text-lg border border-outline/20">
              {user?.firstName ? user.firstName[0].toUpperCase() : 'T'}
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Banner */}
      <div className="rounded-xl bg-gradient-to-br from-[#4f772d] via-[#90a955] to-[#ecf39e] p-6 md:p-8 text-white mb-8 brand-shadow relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-semibold text-[28px] md:text-[22px] font-bold mb-6">Your Teaching Overview — Annual Term 2026</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="font-bold text-[40px] leading-[1.2] mb-1">
                {loading ? <div className="h-10 bg-white/20 rounded animate-pulse w-16 mb-1"></div> : activeCourses}
              </div>
              <div className="font-medium text-[12px] text-white/90">Courses Assigned</div>
            </div>
            <div>
              <div className="font-bold text-[40px] leading-[1.2] mb-1">
                {loading ? <div className="h-10 bg-white/20 rounded animate-pulse w-16 mb-1"></div> : totalStudents}
              </div>
              <div className="font-medium text-[12px] text-white/90">Students Total</div>
            </div>
            <div>
              <div className="font-bold text-[40px] leading-[1.2] mb-1">
                {loading ? <div className="h-10 bg-white/20 rounded animate-pulse w-16 mb-1"></div> : assignments.length}
              </div>
              <div className="font-medium text-[12px] text-white/90">Assignments Active</div>
            </div>
            <div>
              <div className="font-bold text-[40px] leading-[1.2] mb-1">
                {loading ? <div className="h-10 bg-white/20 rounded animate-pulse w-16 mb-1"></div>
                  : assignments.filter((a: any) => !a.gradedAt && new Date(a.dueDate || 0) < new Date()).length
                }
              </div>
              <div className="font-medium text-[12px] text-white/90">Submissions to Review</div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      </div>

      {/* My Courses Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-[20px] md:text-[18px] font-bold text-heading-on-light">My Assigned Courses</h3>
          <Link href="/teacher/courses" className="font-semibold text-[16px] text-success hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden h-48 animate-pulse">
                <div className="h-32 bg-surface-container-high"></div>
                <div className="p-4 bg-surface"></div>
              </div>
            ))
          ) : courses.length > 0 ? (
            courses.slice(0, 3).map((course, i) => (
              <div key={course.id || i} className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
                <div className="h-32 relative bg-surface-container">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundColor: '#2f4f2f' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(19,42,19,0.9)] to-[rgba(19,42,19,0.2)]"></div>
                  <div className="absolute inset-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="bg-lime-cream text-evergreen font-medium text-[12px] px-2 py-1 rounded-full">{course.code}</span>
                      <span className="bg-success text-white font-medium text-[12px] px-2 py-1 rounded-full flex items-center gap-1"><span className="w-2 h-2 bg-surface rounded-full"></span> Active</span>
                    </div>
                    <h4 className="font-semibold text-[16px] text-white font-bold truncate">{course.title}</h4>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center bg-surface border-t border-divider">
                  <Link href={`/teacher/courses/${course.id}`} className="text-primary font-semibold text-[16px] hover:text-success transition-colors flex items-center gap-1">Open Course <ArrowRight className="text-sm w-5 h-5" /></Link>
                  <Link href="/teacher/gradebook" className="text-body-secondary font-semibold text-[16px] hover:text-primary transition-colors">View Gradebook</Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-body-secondary">No courses assigned yet.</div>
          )}
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Pending Actions */}
        <div className="bg-surface rounded-xl border border-divider brand-shadow relative pt-1 overflow-hidden lg:col-span-1">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#90a955] to-[#ecf39e]"></div>
          <div className="p-6">
            <h3 className="font-semibold text-[20px] font-bold text-heading-on-light mb-4">Pending Actions</h3>
            {loading ? (
               <div className="space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-16 bg-surface-container-high rounded-lg animate-pulse"></div>)}
               </div>
            ) : (
              <ul className="space-y-4">
                <li>
                  <Link href="/teacher/assignments" className="flex items-center gap-4 p-3 rounded-lg border border-error-bg bg-error-bg/10 hover:bg-error-bg/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error border border-error/20">
                      <Edit className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[16px] text-on-surface">Assignments</p>
                      <p className="font-normal text-[14px] text-body-secondary text-sm">{assignments.length > 0 ? `${assignments.length} assignments to manage` : 'No assignments currently'}</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/teacher/courses" className="flex items-center gap-4 p-3 rounded-lg border border-warning-bg bg-warning-bg/10 hover:bg-warning-bg/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning border border-warning/20">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[16px] text-on-surface">Active Courses</p>
                      <p className="font-normal text-[14px] text-body-secondary text-sm">{activeCourses > 0 ? `${activeCourses} courses running` : 'No active courses'}</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/teacher/attendance" className="flex items-center gap-4 p-3 rounded-lg border border-success-bg bg-success-bg/30 hover:bg-success-bg/60 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[16px] text-on-surface">Student Check-in</p>
                      <p className="font-normal text-[14px] text-body-secondary text-sm">{totalStudents > 0 ? `${totalStudents} students to monitor` : 'No students enrolled yet'}</p>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-surface rounded-xl border border-divider brand-shadow lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 bg-surface-container-low border-b border-divider flex justify-between items-center">
            <h3 className="font-semibold text-[20px] font-bold text-heading-on-light">Today&apos;s Schedule</h3>
            <span className="font-medium text-[12px] text-body-secondary">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="p-6 flex-1">
            {loading ? (
              <div className="space-y-4">
                 {[1,2].map(i => <div key={i} className="h-16 bg-surface-container-high rounded-lg animate-pulse"></div>)}
              </div>
            ) : timetable.length > 0 ? (
              <div className="relative border-l-2 border-surface-container-highest ml-3 space-y-8 pb-4">
                {timetable.map((session, index) => (
                  <div key={session.id || index} className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 border border-white"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <div className="w-24 font-semibold text-[16px] text-on-surface">{session.startTime}</div>
                      <div className="flex-1 bg-surface rounded-lg p-3 border border-divider hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-[16px] font-medium text-on-surface">{session.subject?.name || `Subject ID: ${session.subjectId}`} - {session.section?.name}</h4>
                            <p className="font-normal text-[14px] text-body-secondary text-sm flex items-center gap-1 mt-1"><MapPin className="w-5 h-5" /> Room {session.room}</p>
                          </div>
                          <span className="text-body-secondary font-medium text-[12px]">{session.endTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-body-secondary py-8">
                <MapPin className="w-12 h-12 mb-2 opacity-20" />
                <p>No classes scheduled for today.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-surface rounded-xl border border-divider shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-[20px] font-bold text-on-surface">Recent Activity</h3>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-container rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-surface-container rounded animate-pulse w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.slice(0, 3).map((a: any, i: number) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <Edit className="w-4 h-4" />
                </div>
                <div className="flex-1 border-b border-divider pb-4">
                  <p className="text-sm text-on-surface">
                    Assignment <span className="font-semibold">{a.title}</span> is active
                    {a.course?.title && <span className="text-body-secondary"> in {a.course.title}</span>}.
                  </p>
                  <span className="text-xs text-body-secondary">
                    Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date set'}
                  </span>
                </div>
              </div>
            ))}
            {courses.slice(0, 2).map((c: any, i: number) => (
              <div key={`c-${i}`} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0 mt-1">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 border-b border-divider pb-4 last:border-0">
                  <p className="text-sm text-on-surface">
                    You are teaching <span className="font-semibold">{c.title}</span>
                    {c.code && <span className="text-body-secondary"> ({c.code})</span>}.
                  </p>
                  <span className="text-xs text-body-secondary">
                    {c.status === 'ACTIVE' ? 'Active this term' : c.status}
                  </span>
                </div>
              </div>
            ))}
            {assignments.length === 0 && courses.length === 0 && (
              <div className="text-center py-8 text-body-secondary">
                <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No recent activity yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
