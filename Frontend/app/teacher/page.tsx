"use client";

import { useState, useEffect } from 'react';
import { Bell, Settings, ArrowRight, Edit, ClipboardCheck, MessageSquare, Upload, MapPin, Users, MoreHorizontal, Download } from 'lucide-react';
import Link from 'next/link';
import { coursesApi, assignmentsApi } from '@/lib/api';

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesData, assignmentsData] = await Promise.all([
          coursesApi.list(),
          assignmentsApi.list()
        ]);
        setCourses(coursesData);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalStudents = courses.reduce((acc, course) => acc + (course.studentsCount || 0), 0);
  const activeCourses = courses.filter(c => c.status === 'ACTIVE').length || courses.length;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-semibold text-[20px] font-bold text-evergreen">Good Morning, Prof. Ali Raza 👋</h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-icon-inactive hover:bg-surface-container-high transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-icon-inactive hover:bg-surface-container-high transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <img 
            className="w-10 h-10 rounded-full object-cover border border-outline/20" 
            alt="Teacher" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO7dmwjn-l4_7xWNcToQXUvJ-GsbAuvf0HCd9PFcvsfHBl-rhqbLXU8PRw2mlbuhQvKVzMksCQ4IPW9lH_xAaEiT0Scw_OqVyd5tZvBr61eP53u9mduSYzlhv_BRauJ2v6TKYqaAwdWtfrNq3ZGjXOLNyr4CaobhpcsAQnzc228BvCqQ6iIFuMlGHrOSkErKZ_eP0p0uBXrrZ3ZMOAx_xgiEQZoKsSsJ4sWm4B_aveQz7Y11UBhdag"
          />
        </div>
      </div>

      {/* Dashboard Banner */}
      <div className="rounded-xl bg-gradient-to-br from-[#4f772d] via-[#90a955] to-[#ecf39e] p-6 md:p-8 text-white mb-8 brand-shadow relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-semibold text-[28px] md:text-[22px] font-bold mb-6">Your Teaching Overview — Semester 1, 2026</h2>
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
                {loading ? <div className="h-10 bg-white/20 rounded animate-pulse w-16 mb-1"></div> : '12'}
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
          <h3 className="font-semibold text-[20px] md:text-[18px] font-bold text-evergreen">My Assigned Courses</h3>
          <Link href="/teacher/courses" className="font-semibold text-[16px] text-success hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden h-48 animate-pulse">
                <div className="h-32 bg-surface-container-high"></div>
                <div className="p-4 bg-white"></div>
              </div>
            ))
          ) : courses.length > 0 ? (
            courses.slice(0, 3).map((course, i) => (
              <div key={course.id || i} className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden group">
                <div className="h-32 relative bg-surface-container">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundColor: '#2f4f2f' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(19,42,19,0.9)] to-[rgba(19,42,19,0.2)]"></div>
                  <div className="absolute inset-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="bg-lime-cream text-evergreen font-medium text-[12px] px-2 py-1 rounded-full">{course.code}</span>
                      <span className="bg-success text-white font-medium text-[12px] px-2 py-1 rounded-full flex items-center gap-1"><span className="w-2 h-2 bg-white rounded-full"></span> Active</span>
                    </div>
                    <h4 className="font-semibold text-[16px] text-white font-bold truncate">{course.title}</h4>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center bg-white border-t border-divider">
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
        <div className="bg-white rounded-xl border border-divider brand-shadow relative pt-1 overflow-hidden lg:col-span-1">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#90a955] to-[#ecf39e]"></div>
          <div className="p-6">
            <h3 className="font-semibold text-[20px] font-bold text-evergreen mb-4">Pending Actions</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 p-3 rounded-lg border border-error-bg bg-error-bg/10 hover:bg-error-bg/30 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error border border-error/20">
                  <Edit className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[16px] text-on-surface">Grading Due</p>
                  <p className="font-normal text-[14px] text-body-secondary text-sm">CS101 Midterm (12 pending)</p>
                </div>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg border border-warning-bg bg-warning-bg/10 hover:bg-warning-bg/30 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning border border-warning/20">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[16px] text-on-surface">Attendance Missing</p>
                  <p className="font-normal text-[14px] text-body-secondary text-sm">CS201 Lecture (Yesterday)</p>
                </div>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg border border-success-bg bg-success-bg/30 hover:bg-success-bg/60 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[16px] text-on-surface">Unread Messages</p>
                  <p className="font-normal text-[14px] text-body-secondary text-sm">3 student inquiries</p>
                </div>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg border border-info-bg bg-info-bg/30 hover:bg-info-bg/60 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center text-info border border-info/20">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[16px] text-on-surface">Materials Upload</p>
                  <p className="font-normal text-[14px] text-body-secondary text-sm">SE305 Week 4 Slides</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl border border-divider brand-shadow lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 bg-surface-container-low border-b border-divider flex justify-between items-center">
            <h3 className="font-semibold text-[20px] font-bold text-evergreen">Today&apos;s Schedule</h3>
            <span className="font-medium text-[12px] text-body-secondary">Monday, Oct 12</span>
          </div>
          <div className="p-6 flex-1">
            <div className="relative border-l-2 border-surface-container-highest ml-3 space-y-8 pb-4">
              {/* Past Event */}
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-surface-container-highest rounded-full -left-[7px] top-1.5 border border-white"></div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 opacity-60">
                  <div className="w-24 font-semibold text-[16px] text-body-secondary">9:00 AM</div>
                  <div className="flex-1 bg-surface rounded-lg p-3 border border-divider">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-[16px] font-medium text-on-surface">CS101 Lecture</h4>
                        <p className="font-normal text-[14px] text-body-secondary text-sm flex items-center gap-1 mt-1"><MapPin className="w-5 h-5" /> Room 201</p>
                      </div>
                      <span className="bg-surface-container text-body-secondary font-medium text-[10px] px-2 py-1 rounded">Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Event */}
              <div className="relative pl-6">
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1.5 border-2 border-white shadow-[0_0_0_4px_rgba(26,63,23,0.1)]"></div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div className="w-24 font-semibold text-[16px] text-primary font-bold">11:00 AM</div>
                  <div className="flex-1 bg-success-bg/30 rounded-lg p-3 border border-success border-l-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-[16px] font-bold text-primary">CS201 Lab Session</h4>
                        <p className="font-normal text-[14px] text-primary/80 text-sm flex items-center gap-1 mt-1"><MapPin className="w-5 h-5" /> Room 305</p>
                      </div>
                      <span className="bg-success text-white font-medium text-[10px] px-2 py-1 rounded animate-pulse">Now</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Future Event */}
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-surface-container-high rounded-full -left-[7px] top-1.5 border border-white"></div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div className="w-24 font-semibold text-[16px] text-on-surface">2:00 PM</div>
                  <div className="flex-1 bg-surface rounded-lg p-3 border border-divider hover:border-outline-variant transition-colors cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-[16px] font-medium text-on-surface">Office Hours</h4>
                        <p className="font-normal text-[14px] text-body-secondary text-sm flex items-center gap-1 mt-1"><MapPin className="w-5 h-5" /> Faculty Office 4B</p>
                      </div>
                      <span className="text-info font-medium text-[14px]"><Users className="w-5 h-5" /> 2 Bookings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-xl border border-divider brand-shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-[20px] font-bold text-evergreen">Recent Activity Feed</h3>
          <button className="text-body-secondary hover:text-primary transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center text-info shrink-0 mt-1">
              <Download className="w-5 h-5" />
            </div>
            <div className="flex-1 border-b border-divider pb-4">
              <p className="font-normal text-[14px] text-on-surface"><span className="font-semibold text-[16px] font-semibold">12 new submissions</span> received for CS101 Assignment 2.</p>
              <span className="font-medium text-[12px] text-body-secondary">10 mins ago</span>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0 mt-1">
              <Edit className="w-5 h-5" />
            </div>
            <div className="flex-1 border-b border-divider pb-4">
              <p className="font-normal text-[14px] text-on-surface">You published grades for <span className="font-semibold text-[16px] font-semibold">SE305 Midterm Project</span>.</p>
              <span className="font-medium text-[12px] text-body-secondary">2 hours ago</span>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning shrink-0 mt-1">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-normal text-[14px] text-on-surface">Attendance recorded for <span className="font-semibold text-[16px] font-semibold">CS201 Lecture</span>.</p>
              <span className="font-medium text-[12px] text-body-secondary">Yesterday, 4:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
