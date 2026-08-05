"use client";
import { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, LayoutGrid, X, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { coursesApi, usersApi } from '@/lib/api';

export default function CoursesManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCourseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // Forms
  const [courseForm, setCourseForm] = useState({ 
    title: '', 
    code: '',
    description: '',
    credits: 3,
    teacherId: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesData, teachersData] = await Promise.all([
        coursesApi.list(),
        usersApi.list('TEACHER') // Also try INSTRUCTOR if TEACHER is empty, but we'll fetch both or just let backend handle it, in the seeder it's TEACHER
      ]);
      setCourses(coursesData.data || coursesData || []);
      
      const teacherRes = teachersData.data || teachersData || [];
      // If we also need INSTRUCTOR, we could fetch it, but usually the system uses TEACHER or INSTRUCTOR.
      setTeachers(teacherRes);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: courseForm.title,
        code: courseForm.code,
        description: courseForm.description,
        credits: parseInt(courseForm.credits as any) || 3,
        teacherId: courseForm.teacherId || undefined,
      };

      if (editingCourse) {
        await coursesApi.update(editingCourse.id, payload);
        toast.success('Course updated successfully');
      } else {
        await coursesApi.create(payload);
        toast.success('Course created successfully');
      }
      setCourseModalOpen(false);
      setEditingCourse(null);
      setCourseForm({ title: '', code: '', description: '', credits: 3, teacherId: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save course');
    }
  };

  const handleDeleteCourse = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this course? This will remove all associated modules, enrollments, and data.')) return;
    try {
      await coursesApi.remove(id);
      toast.success('Course deleted');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete course');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Courses Management</h2>
          <p className="text-sm text-body-secondary mt-1">Manage core courses, assign teachers, and organize curriculum.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setEditingCourse(null);
              setCourseForm({ title: '', code: '', description: '', credits: 3, teacherId: '' });
              setCourseModalOpen(true);
            }}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Course
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
        <div className="p-4 border-b border-divider bg-surface-container-low flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-heading-on-light">All Courses</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-body-secondary">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-body-secondary">No courses found. Create one to get started.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-body-secondary text-[11px] uppercase tracking-wider border-b border-divider bg-surface-container-lowest">
                  <th className="py-3 px-4 font-semibold">Course Code</th>
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Instructor</th>
                  <th className="py-3 px-4 font-semibold">Credits</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {courses.map(course => (
                  <tr key={course.id} className="border-b border-border-light hover:bg-surface-container-lowest transition-colors group">
                    <td className="py-3 px-4 font-mono text-xs font-semibold">{course.code}</td>
                    <td className="py-3 px-4 font-medium text-on-surface">
                      {course.title}
                      {course.description && <p className="text-xs text-body-secondary mt-0.5 truncate max-w-xs">{course.description}</p>}
                    </td>
                    <td className="py-3 px-4 text-on-surface">
                      {course.teacher ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                            {course.teacher.firstName?.[0]}{course.teacher.lastName?.[0]}
                          </div>
                          <span>{course.teacher.firstName} {course.teacher.lastName}</span>
                        </div>
                      ) : (
                        <span className="text-body-secondary italic text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-body-secondary">{course.credits}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingCourse(course);
                            setCourseForm({ 
                              title: course.title, 
                              code: course.code || '', 
                              description: course.description || '', 
                              credits: course.credits || 3,
                              teacherId: course.teacherId || ''
                            });
                            setCourseModalOpen(true);
                          }}
                          className="text-body-secondary hover:text-primary transition-colors p-1"
                          title="Edit Course"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteCourse(e, course.id)}
                          className="text-body-secondary hover:text-error transition-colors p-1"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-divider flex justify-between items-center bg-surface">
              <h3 className="text-lg font-bold text-heading-on-light">{editingCourse ? 'Edit Course' : 'Create New Course'}</h3>
              <button onClick={() => setCourseModalOpen(false)} className="text-body-secondary hover:text-error transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateOrUpdateCourse} className="p-5 space-y-4 bg-surface">
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Course Title</label>
                <input required type="text" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Introduction to Computer Science"
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Course Code</label>
                  <input required type="text" value={courseForm.code} onChange={e => setCourseForm({ ...courseForm, code: e.target.value })}
                    placeholder="e.g. CS101"
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Credits</label>
                  <input required type="number" min="1" value={courseForm.credits} onChange={e => setCourseForm({ ...courseForm, credits: parseInt(e.target.value) || 3 })}
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Assign Teacher (Optional)</label>
                <select 
                  value={courseForm.teacherId} 
                  onChange={e => setCourseForm({ ...courseForm, teacherId: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">-- No Teacher Assigned --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Description (Optional)</label>
                <textarea value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Course overview and objectives..."
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-divider mt-2">
                <button type="button" onClick={() => setCourseModalOpen(false)} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg hover:bg-surface-container transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm">{editingCourse ? 'Save Changes' : 'Create Course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
