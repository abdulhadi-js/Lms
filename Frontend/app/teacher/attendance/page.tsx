"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar as CalendarIcon, Check, X, AlertCircle, Zap, Loader2 } from 'lucide-react';
import { coursesApi, enrollmentsApi, attendanceApi, usersApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function TeacherAttendance() {
  const router = useRouter();
  
  const [mode, setMode] = useState<'SUBJECT' | 'DAILY'>('SUBJECT');
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, { status: string, notes: string }>>({});
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  // Bulk Mode State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [bulkStatus, setBulkStatus] = useState('PRESENT');
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await coursesApi.list();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load courses', err);
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    if (mode === 'SUBJECT' && selectedCourse && date) {
      loadAttendanceData(selectedCourse, date);
    } else if (mode === 'DAILY' && date) {
      loadDailyAttendanceData(date);
    }
  }, [selectedCourse, date, mode]);

  async function loadAttendanceData(courseId: string, targetDate: string) {
    setLoading(true);
    try {
      const [enrollData, existingAttendance] = await Promise.all([
        enrollmentsApi.list(),
        attendanceApi.get(courseId, targetDate).catch(() => [])
      ]);
      
      const courseStudents = enrollData
        .filter((e: any) => e.course?.id === courseId && e.status === 'ACTIVE' && e.student)
        .map((e: any) => e.student);
        
      setStudents(courseStudents);
      
      const newState: Record<string, { status: string, notes: string }> = {};
      courseStudents.forEach((student: any) => {
        const existing = existingAttendance.find((a: any) => a.studentId === student.id);
        newState[student.id] = {
          status: existing ? existing.status : 'PRESENT',
          notes: existing ? (existing.notes || '') : ''
        };
      });
      setAttendanceState(newState);
    } catch (err) {
      console.error('Failed to load attendance', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadDailyAttendanceData(targetDate: string) {
    setLoading(true);
    try {
      const [allStudents, existingAttendance] = await Promise.all([
        usersApi.list('STUDENT'),
        attendanceApi.get('DAILY', targetDate).catch(() => [])
      ]);
      
      const activeStudents = allStudents.filter((s: any) => s.status === 'ACTIVE');
      setStudents(activeStudents);
      
      const newState: Record<string, { status: string, notes: string }> = {};
      activeStudents.forEach((student: any) => {
        const existing = existingAttendance.find((a: any) => a.studentId === student.id);
        newState[student.id] = {
          status: existing ? existing.status : 'PRESENT',
          notes: existing ? (existing.notes || '') : ''
        };
      });
      setAttendanceState(newState);
    } catch (err) {
      console.error('Failed to load daily attendance', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        courseId: mode === 'DAILY' ? 'DAILY' : selectedCourse,
        classDate: new Date(date).toISOString(),
        students: Object.entries(attendanceState).map(([studentId, data]) => ({
          studentId,
          status: data.status,
          notes: data.notes || undefined
        }))
      };
      
      await attendanceApi.mark(payload);
      toast.success('Attendance saved successfully!');
    } catch (err) {
      console.error('Failed to save attendance', err);
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkMark = async () => {
    if (!bulkData.trim()) return toast.error('Please enter GR Numbers');
    setIsBulkSaving(true);
    
    const grNumbers = bulkData.split(/[\n\s,]+/).filter(gr => gr.trim().length > 0);
    
    try {
      await attendanceApi.bulkMark({
        courseId: mode === 'DAILY' ? 'DAILY' : selectedCourse,
        date: new Date(date).toISOString(),
        grNumbers,
        status: bulkStatus
      });
      toast.success(`Successfully marked ${grNumbers.length} students as ${bulkStatus}`);
      setIsBulkModalOpen(false);
      setBulkData('');
      if (mode === 'DAILY') {
        loadDailyAttendanceData(date);
      } else {
        loadAttendanceData(selectedCourse, date);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to bulk mark attendance');
    } finally {
      setIsBulkSaving(false);
    }
  };

  const handleMarkAllPresent = () => {
    const newState = { ...attendanceState };
    Object.keys(newState).forEach(id => {
      newState[id].status = 'PRESENT';
    });
    setAttendanceState(newState);
  };

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    (s.grNumber && s.grNumber.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = { present: 0, absent: 0, late: 0, leave: 0 };
  Object.values(attendanceState).forEach(val => {
    if (val.status === 'PRESENT') stats.present++;
    if (val.status === 'ABSENT') stats.absent++;
    if (val.status === 'LATE') stats.late++;
    if (val.status === 'LEAVE') stats.leave++;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = date === todayStr;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Attendance</h2>
          <p className="text-sm text-body-secondary mt-1">Mark and manage attendance for your classes.</p>
        </div>
        <div className="flex bg-surface-container-low rounded-lg p-1 border border-border-light">
          <button onClick={() => setMode('SUBJECT')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'SUBJECT' ? 'bg-primary text-white shadow' : 'text-body-secondary hover:text-primary'}`}>Per Subject</button>
          <button onClick={() => setMode('DAILY')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'DAILY' ? 'bg-primary text-white shadow' : 'text-body-secondary hover:text-primary'}`}>Daily (School Mode)</button>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => router.push('/teacher/analytics?print=true')} className="flex-1 sm:flex-none px-4 py-2 border border-border-light bg-surface rounded-lg text-sm font-medium hover:bg-surface-container transition-colors print:hidden">
            Generate Report
          </button>
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            disabled={loading || (mode === 'SUBJECT' && courses.length === 0) || !isToday}
            className="flex-1 sm:flex-none px-4 py-2 border border-primary text-primary bg-primary/5 rounded-lg text-sm font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            Smart Bulk Mode
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || students.length === 0 || !isToday}
            className="flex-1 sm:flex-none px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {mode === 'SUBJECT' && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-body-secondary whitespace-nowrap">Class:</span>
                <select 
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="bg-surface border border-border-light rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-48 font-medium"
                  disabled={loading || courses.length === 0}
                >
                  {courses.length === 0 ? (
                    <option value="">No courses available</option>
                  ) : (
                    courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))
                  )}
                </select>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-body-secondary whitespace-nowrap">Date:</span>
              <div className="relative w-full sm:w-auto">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-icon-inactive" />
                <input 
                  type="date" 
                  value={date}
                  max={todayStr}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-surface border border-border-light rounded-lg pl-9 pr-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-full"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-icon-inactive" />
            <input 
              type="text" 
              placeholder="Search student..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
            />
          </div>
        </div>
        
        {!isToday && (
          <div className="bg-warning/10 border-b border-warning/20 p-3 px-5 flex items-center gap-2 text-warning font-medium text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Viewing past records. You can only modify attendance for today's date.</span>
          </div>
        )}

        <div className="p-4 bg-surface-container-lowest border-b border-divider flex justify-between items-center text-sm">
           <div className="flex flex-wrap items-center gap-4 sm:gap-6">
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-success"></span> <span className="text-body-secondary font-medium">Present ({stats.present})</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-error"></span> <span className="text-body-secondary font-medium">Absent ({stats.absent})</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-info"></span> <span className="text-body-secondary font-medium">Leave ({stats.leave})</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-warning"></span> <span className="text-body-secondary font-medium">Late ({stats.late})</span>
             </div>
           </div>
           <div>
             <button 
               onClick={handleMarkAllPresent}
               disabled={students.length === 0 || !isToday}
               className="text-primary font-medium hover:underline disabled:opacity-50 whitespace-nowrap"
             >
               Mark All Present
             </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-body-secondary">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-8 text-center text-body-secondary">No students found.</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                    <th className="py-4 px-6 font-semibold w-12">#</th>
                    <th className="py-4 px-6 font-semibold">Student</th>
                    <th className="py-4 px-6 font-semibold text-center">Status</th>
                    <th className="py-4 px-6 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                    {filteredStudents.map((student, i) => {
                      const state = attendanceState[student.id] || { status: 'PRESENT', notes: '' };
                      
                      return (
                      <tr key={student.id} className="border-b border-border-light hover:bg-surface transition-colors">
                        <td className="py-3 px-6 text-body-secondary">{i + 1}</td>
                        <td className="py-3 px-6">
                          <div className="font-medium text-on-surface">{student.firstName} {student.lastName}</div>
                          <div className="text-xs text-body-secondary">{student.grNumber || student.id.slice(0, 8)}</div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => handleStatusChange(student.id, 'PRESENT')}
                              disabled={!isToday}
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${state.status === 'PRESENT' ? 'bg-success text-white shadow-md' : 'bg-surface-container-high text-icon-inactive hover:bg-border-light'} ${!isToday && state.status !== 'PRESENT' ? 'opacity-30' : ''} disabled:cursor-not-allowed`} title="Present"
                            >
                              P
                            </button>
                            <button 
                              onClick={() => handleStatusChange(student.id, 'ABSENT')}
                              disabled={!isToday}
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${state.status === 'ABSENT' ? 'bg-error text-white shadow-md' : 'bg-surface-container-high text-icon-inactive hover:bg-border-light'} ${!isToday && state.status !== 'ABSENT' ? 'opacity-30' : ''} disabled:cursor-not-allowed`} title="Absent"
                            >
                              A
                            </button>
                            <button 
                              onClick={() => handleStatusChange(student.id, 'LEAVE')}
                              disabled={!isToday}
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${state.status === 'LEAVE' ? 'bg-info text-white shadow-md' : 'bg-surface-container-high text-icon-inactive hover:bg-border-light'} ${!isToday && state.status !== 'LEAVE' ? 'opacity-30' : ''} disabled:cursor-not-allowed`} title="Leave"
                            >
                              L
                            </button>
                            <button 
                              onClick={() => handleStatusChange(student.id, 'LATE')}
                              disabled={!isToday}
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${state.status === 'LATE' ? 'bg-warning text-white shadow-md' : 'bg-surface-container-high text-icon-inactive hover:bg-border-light'} ${!isToday && state.status !== 'LATE' ? 'opacity-30' : ''} disabled:cursor-not-allowed`} title="Late"
                            >
                              LT
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <input 
                            type="text" 
                            placeholder={isToday ? "Add note..." : ""} 
                            value={state.notes}
                            disabled={!isToday}
                            onChange={(e) => handleNotesChange(student.id, e.target.value)}
                            className="w-full bg-transparent border-b border-transparent hover:border-border-light focus:border-primary focus:outline-none py-1 text-sm transition-colors disabled:cursor-not-allowed" 
                          />
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Monthly Summary Grid */}
      <div className="bg-surface rounded-xl border border-divider brand-shadow p-5 mt-6">
        <h3 className="text-lg font-bold text-heading-on-light mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Monthly Attendance Summary
        </h3>
        <div className="grid grid-cols-7 gap-2 max-w-lg mx-auto text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-xs font-bold text-body-secondary">{day}</div>
          ))}
          {Array.from({ length: 30 }).map((_, i) => {
            const statusType = i % 7 > 4 ? 'WEEKEND' : (Math.random() > 0.9 ? 'ABSENT' : Math.random() > 0.8 ? 'LATE' : Math.random() > 0.9 ? 'LEAVE' : 'PRESENT');
            return (
              <div key={i} className="aspect-square flex items-center justify-center bg-surface-container-low rounded-md border border-border-light relative group">
                <div className={`w-3 h-3 rounded-full ${statusType === 'PRESENT' ? 'bg-success' : statusType === 'ABSENT' ? 'bg-error' : statusType === 'LATE' ? 'bg-warning' : statusType === 'LEAVE' ? 'bg-info' : 'bg-surface-container-high'}`}></div>
                <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/80 text-white text-[10px] rounded-md z-10">{i + 1}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Bulk Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Smart Bulk Attendance
              </h3>
              <button onClick={() => setIsBulkModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-primary/10 text-primary-fixed border border-primary/20 rounded-lg p-3 text-sm flex gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Paste a list of GR Numbers or User IDs to rapidly mark an entire batch. Separate them by commas, spaces, or new lines.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Status to Apply</label>
                <select 
                  value={bulkStatus}
                  onChange={e => setBulkStatus(e.target.value)}
                  className="w-full bg-surface border border-border-light rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="LEAVE">LEAVE</option>
                  <option value="LATE">LATE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">GR Numbers (IDs)</label>
                <textarea 
                  value={bulkData}
                  onChange={e => setBulkData(e.target.value)}
                  placeholder="e.g. GR-001, GR-002&#10;GR-003"
                  className="w-full bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[150px] font-mono"
                />
              </div>
            </div>

            <div className="p-4 border-t border-divider bg-surface flex justify-end gap-3">
              <button 
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-body-secondary hover:bg-surface-container rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkMark}
                disabled={isBulkSaving || !bulkData.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isBulkSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Run Bulk Mark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
