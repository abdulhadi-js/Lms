"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, Users, Loader2 } from 'lucide-react';
import { timetableApi, coursesApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function AdminTimetable() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    courseId: '',
    dayOfWeek: 'MON',
    startTime: '',
    endTime: '',
    room: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [scheduleData, courseData] = await Promise.all([
        timetableApi.list(),
        coursesApi.list()
      ]);
      setSchedules(scheduleData.data || scheduleData || []);
      setCourses(courseData.data || courseData || []);
    } catch (error) {
      toast.error('Failed to load timetable data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (slot?: any) => {
    if (slot) {
      setIsEditMode(true);
      setFormData({
        id: slot.id,
        courseId: slot.course?.id || slot.courseId || '',
        dayOfWeek: slot.dayOfWeek || 'MON',
        startTime: slot.startTime || '',
        endTime: slot.endTime || '',
        room: slot.room || ''
      });
    } else {
      setIsEditMode(false);
      setFormData({ id: '', courseId: '', dayOfWeek: 'MON', startTime: '', endTime: '', room: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        courseId: formData.courseId,
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room
      };

      if (isEditMode) {
        await timetableApi.update(formData.id, payload);
        toast.success('Schedule updated successfully');
      } else {
        await timetableApi.create(payload);
        toast.success('Schedule created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule slot?')) return;
    try {
      await timetableApi.remove(id);
      toast.success('Schedule slot deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete schedule slot');
    }
  };

  const dayMap: Record<string, string> = {
    'MON': 'Mon', 'TUE': 'Tue', 'WED': 'Wed', 'THU': 'Thu', 'FRI': 'Fri', 'SAT': 'Sat', 'SUN': 'Sun'
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Timetable Scheduling</h2>
          <p className="text-sm text-body-secondary mt-1">Manage class schedules and allocate resources.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 primary-gradient text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
        >
          <Plus className="h-4 w-4" />
          Add Schedule
        </button>
      </div>

      <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2 text-on-surface font-bold text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Weekly Master Schedule</span>
          </div>
          <div className="flex gap-2">
            <select className="border border-border-light bg-white rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none focus:border-primary">
              <option>All Courses</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : schedules.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-body-secondary">
              <Calendar className="w-12 h-12 mb-2 opacity-20" />
              <p>No timetable schedules found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary text-white text-sm tracking-wide">
                  <th className="p-4 font-semibold">Course & Instructor</th>
                  <th className="p-4 font-semibold">Timing</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Day</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {schedules.map((slot, index) => (
                  <tr key={slot.id} className={`border-b border-border-light hover:bg-surface-container-low transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-surface-container-lowest'}`}>
                    <td className="p-4">
                      <div className="font-bold text-on-surface">{slot.course?.title || 'Unknown Course'} <span className="text-xs font-normal text-body-secondary">({slot.course?.code})</span></div>
                      <div className="text-sm text-body-secondary flex items-center gap-1 mt-1">
                        <Users className="w-4 h-4" /> {slot.course?.teacher ? `${slot.course.teacher.firstName} ${slot.course.teacher.lastName}` : 'Unassigned'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <Clock className="w-4 h-4" /> {slot.startTime} - {slot.endTime}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-body-secondary">
                        <MapPin className="w-4 h-4" /> {slot.room}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary-container/20 text-primary-fixed border border-primary-fixed/20">
                        {dayMap[slot.dayOfWeek] || slot.dayOfWeek}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModal(slot)}
                        className="p-1.5 text-info hover:bg-info/10 rounded transition-colors"
                        title="Edit Schedule"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(slot.id)}
                        className="p-1.5 text-error hover:bg-error-bg rounded transition-colors"
                        title="Delete Schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Timetable Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light">
                {isEditMode ? 'Edit Schedule Slot' : 'Add Schedule Slot'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors">
                <Trash2 className="h-5 w-5 hidden" />
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Select Course</label>
                <select 
                  required
                  value={formData.courseId} 
                  onChange={e => setFormData({...formData, courseId: e.target.value})}
                  className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Day of Week</label>
                  <select 
                    required
                    value={formData.dayOfWeek} 
                    onChange={e => setFormData({...formData, dayOfWeek: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="MON">Monday</option>
                    <option value="TUE">Tuesday</option>
                    <option value="WED">Wednesday</option>
                    <option value="THU">Thursday</option>
                    <option value="FRI">Friday</option>
                    <option value="SAT">Saturday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Room/Location</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Room 201"
                    value={formData.room} 
                    onChange={e => setFormData({...formData, room: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Start Time</label>
                  <input 
                    type="time" 
                    required
                    value={formData.startTime} 
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">End Time</label>
                  <input 
                    type="time" 
                    required
                    value={formData.endTime} 
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-divider">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-body-secondary hover:bg-surface-container-low rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-white primary-gradient rounded-lg hover:shadow-md transition-shadow disabled:opacity-70 flex items-center"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isEditMode ? 'Save Changes' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
