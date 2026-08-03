"use client";
import React, { useState, useEffect } from 'react';
import { Calendar as LucideCalendar, Plus, Edit, Trash2, Clock, MapPin, Users, Loader2 } from 'lucide-react';
import { timetableApi, coursesApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

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

  const parseTimeStr = (timeStr: string) => {
    const [time, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return [hours, minutes];
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const courseData = await coursesApi.list();
      const coursesList = courseData.data || courseData || [];
      setCourses(coursesList);
      
      const newSchedules: any[] = [];
      coursesList.forEach((course: any) => {
        if (course.schedule && Array.isArray(course.schedule)) {
          course.schedule.forEach((s: any, idx: number) => {
            const parts = s.time.split('-');
            if (parts.length === 2) {
              const startStr = parts[0].trim();
              const endStr = parts[1].trim();
              newSchedules.push({
                id: `${course.id}-${idx}`,
                course: course,
                dayOfWeek: s.day.substring(0, 3).toUpperCase(),
                startTimeStr: startStr,
                endTimeStr: endStr,
                room: course.room || 'TBD',
              });
            }
          });
        }
      });
      setSchedules(newSchedules);
    } catch (error) {
      toast.error('Failed to load courses data');
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

  const calendarEvents = React.useMemo(() => {
    const dayOffsetMap: Record<string, number> = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); 
    
    return schedules.map(slot => {
      const dayOffset = dayOffsetMap[slot.dayOfWeek] ?? 1;
      const targetDate = new Date(currentWeekStart);
      targetDate.setDate(targetDate.getDate() + dayOffset);
      
      const [startHour, startMin] = parseTimeStr(slot.startTimeStr);
      const [endHour, endMin] = parseTimeStr(slot.endTimeStr);
      
      const start = new Date(targetDate);
      start.setHours(startHour, startMin, 0, 0);
      
      const end = new Date(targetDate);
      end.setHours(endHour, endMin, 0, 0);
      
      return {
        title: `${slot.course?.code || 'Course'} - ${slot.room}`,
        start,
        end,
        resource: slot
      };
    });
  }, [schedules]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Timetable Scheduling</h2>
          <p className="text-sm text-body-secondary mt-1">Manage class schedules and allocate resources.</p>
        </div>
        <a 
          href="/admin/courses"
          className="flex items-center gap-2 primary-gradient text-white px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
        >
          <Edit className="h-4 w-4" />
          Manage Courses
        </a>
      </div>

      <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2 text-on-surface font-bold text-lg">
            <LucideCalendar className="w-5 h-5 text-primary" />
            <span>Weekly Master Schedule</span>
          </div>
          <div className="flex gap-2">
            <select className="border border-border-light bg-surface rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none focus:border-primary">
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
              <LucideCalendar className="w-12 h-12 mb-2 opacity-20" />
              <p>No timetable schedules found.</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {schedules.map((slot) => (
                  <div key={slot.id} className="bg-surface p-4 rounded-xl border border-divider shadow-sm relative">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-on-surface">{slot.course?.title || 'Unknown Course'} <span className="text-xs font-normal text-body-secondary">({slot.course?.code})</span></div>
                        <div className="text-sm text-body-secondary flex items-center gap-1 mt-1">
                          <Users className="w-4 h-4" /> {slot.course?.teacher ? `${slot.course.teacher.firstName} ${slot.course.teacher.lastName}` : 'Unassigned'}
                        </div>
                      </div>

                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3 pt-3 border-t border-divider">
                      <div className="text-body-secondary flex items-center gap-1"><Clock className="w-4 h-4" /> Timing:</div>
                      <div className="text-right text-primary font-medium">{slot.startTimeStr} - {slot.endTimeStr}</div>
                      
                      <div className="text-body-secondary flex items-center gap-1"><MapPin className="w-4 h-4" /> Room:</div>
                      <div className="text-right">{slot.room}</div>
                      
                      <div className="text-body-secondary">Day:</div>
                      <div className="text-right">
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary-container/20 text-primary-fixed border border-primary-fixed/20">
                          {dayMap[slot.dayOfWeek] || slot.dayOfWeek}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Calendar View */}
              <div className="hidden md:block h-[600px] p-4">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  defaultView="work_week"
                  views={['work_week', 'day', 'agenda']}
                  min={new Date(0, 0, 0, 8, 0, 0)} // 8 AM
                  max={new Date(0, 0, 0, 20, 0, 0)} // 8 PM
                  onSelectEvent={(event: any) => handleOpenModal(event.resource)}
                  components={{
                    event: (props: any) => {
                      const slot = props.event.resource;
                      return (
                        <div className="p-1 h-full flex flex-col justify-between text-xs overflow-hidden">
                          <div className="font-semibold truncate">{slot.course?.title || slot.course?.code}</div>
                          <div className="flex justify-between items-end mt-1">
                            <span>{slot.room}</span>
                          </div>
                        </div>
                      )
                    }
                  }}
                  eventPropGetter={() => ({
                    style: { backgroundColor: 'var(--primary)', borderColor: 'var(--primary-fixed)', borderRadius: '6px' }
                  })}
                />
              </div>
            </>
          )}
        </div>
      </div>


    </div>
  );
}
