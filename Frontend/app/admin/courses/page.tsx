"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, BookOpen, Clock, Users, Edit, Trash2, Settings, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { coursesApi, usersApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function CourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: '', code: '', title: '', description: '', teacherId: '', credits: 3, schedule: [] as {day: string, time: string}[], room: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [coursesData, teachersData] = await Promise.all([
        coursesApi.list(),
        usersApi.list('INSTRUCTOR')
      ]);
      setCourses(coursesData.data || coursesData || []);
      setTeachers(teachersData.data || teachersData || []);
    } catch (error) {
      toast.error('Failed to load courses or teachers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as Element).closest('.course-actions-dropdown')) return;
      setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleOpenModal = (course?: any) => {
    if (course) {
      setIsEditMode(true);
      setFormData({
        id: course.id,
        code: course.code || '',
        title: course.title || '',
        description: course.description || '',
        teacherId: course.teacher?.id || course.teacherId || '',
        credits: course.credits || 3,
        schedule: course.schedule || [],
        room: course.room || '',
      });
    } else {
      setIsEditMode(false);
      setFormData({ id: '', code: '', title: '', description: '', teacherId: '', credits: 3, schedule: [], room: '' });
    }
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (formData.schedule.length === 0) {
      toast.error('Please select at least one day and time for the schedule');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        code: formData.code,
        title: formData.title,
        description: formData.description,
        teacherId: formData.teacherId || null,
        credits: Number(formData.credits),
        schedule: formData.schedule,
        room: formData.room
      };

      if (isEditMode) {
        await coursesApi.update(formData.id, payload);
        toast.success('Course updated successfully');
      } else {
        await coursesApi.create(payload);
        toast.success('Course created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await coursesApi.remove(id);
      toast.success('Course deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    }
    setOpenDropdown(null);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Course Management</h2>
          <p className="text-sm text-body-secondary mt-1">Create, organize, and oversee academic programs.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 primary-gradient text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-body-secondary">No courses found. Create one to get started.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-surface rounded-xl border border-divider brand-shadow overflow-visible flex flex-col group hover:-translate-y-1 transition-transform duration-300">
              <div className="p-5 border-b border-divider flex-1 relative">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-primary-container bg-primary-container/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {course.code}
                  </span>
                  <div className="relative course-actions-dropdown">
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === course.id ? null : course.id)}
                      className="text-icon-inactive hover:text-primary transition-colors"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    
                    {openDropdown === course.id && (
                      <div className="absolute right-0 top-6 w-48 bg-surface rounded-lg shadow-xl border border-divider py-1 z-50 animate-in fade-in zoom-in duration-200">
                        <button 
                          onClick={() => handleOpenModal(course)}
                          className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4 text-icon-inactive" /> Edit Details
                        </button>
                        <hr className="my-1 border-divider" />
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-bg flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Course
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-heading-on-light mb-2 leading-tight">{course.title}</h3>
                <p className="text-sm text-body-secondary mb-4 line-clamp-2">{course.description || 'No description provided.'}</p>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center text-sm text-body-secondary">
                    <BookOpen className="h-4 w-4 mr-2 text-icon-inactive" />
                    <span className="font-medium text-on-surface mr-1">Instructor:</span> 
                    {course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : 'Unassigned'}
                  </div>
                  <div className="flex items-center text-sm text-body-secondary">
                    <Users className="h-4 w-4 mr-2 text-icon-inactive" />
                    <span className="font-medium text-on-surface mr-1">{course.enrollments?.length || 0}</span> Enrolled Students
                  </div>
                  <div className="flex items-center text-sm text-body-secondary">
                    <Clock className="h-4 w-4 mr-2 text-icon-inactive" />
                    <span className="font-medium text-on-surface mr-1">{course.credits || 3}</span> Credit Hours
                  </div>
                  {(course.schedule?.length > 0 || course.room) && (
                    <div className="flex items-start text-sm text-body-secondary pt-2 border-t border-divider">
                      <span className="font-medium text-on-surface mr-1">Schedule:</span> 
                      <div className="flex flex-col">
                        {course.schedule?.map((slot: any) => (
                           <span key={slot.day}>{slot.day} ({slot.time})</span>
                        ))}
                        {course.room && <span>Room: {course.room}</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-surface-container-lowest p-4 flex justify-between items-center rounded-b-xl">
                <div>
                   {course.status === 'ACTIVE' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-bg text-success border border-success/20">Active Session</span>}
                   {course.status === 'ARCHIVED' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-container text-body-secondary border border-border-light">Archived</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light">
                {isEditMode ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors">
                <Trash2 className="h-5 w-5 hidden" /> {/* Placeholder for visual balance */}
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Course Code</label>
                <input 
                  type="text" 
                  required
                  value={formData.code} 
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  placeholder="e.g. CS-101" 
                  className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Course Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Introduction to Computer Science" 
                  className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3} 
                  className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Assign Teacher</label>
                  <select 
                    required
                    value={formData.teacherId} 
                    onChange={e => setFormData({...formData, teacherId: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Credits</label>
                  <input 
                    type="number" 
                    required
                    min="1" max="6"
                    value={formData.credits} 
                    onChange={e => setFormData({...formData, credits: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-on-surface">Weekly Schedule</label>
                <div className="border border-divider rounded-lg divide-y divide-divider bg-surface-container-lowest">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                    const selected = formData.schedule.find(s => s.day === day);
                    return (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3">
                        <label className="flex items-center space-x-3 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            checked={!!selected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, schedule: [...formData.schedule, { day, time: '08:00 AM - 09:30 AM' }] });
                              } else {
                                setFormData({ ...formData, schedule: formData.schedule.filter(s => s.day !== day) });
                              }
                            }}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className={`text-sm font-medium ${selected ? 'text-on-surface' : 'text-body-secondary'}`}>{day}</span>
                        </label>
                        
                        {selected && (
                          <select
                            value={selected.time}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                schedule: formData.schedule.map(s => s.day === day ? { ...s, time: e.target.value } : s)
                              });
                            }}
                            className="px-3 py-1.5 text-sm border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-[200px]"
                          >
                            <option value="08:00 AM - 09:30 AM">08:00 AM - 09:30 AM</option>
                            <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                            <option value="12:00 PM - 01:30 PM">12:00 PM - 01:30 PM</option>
                            <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                            <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM</option>
                            <option value="06:00 PM - 07:30 PM">06:00 PM - 07:30 PM</option>
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Room</label>
                <input 
                  type="text" 
                  required
                  value={formData.room} 
                  onChange={e => setFormData({...formData, room: e.target.value})}
                  placeholder="e.g. Room 101" 
                  className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-divider shrink-0">
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
                  {isEditMode ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
