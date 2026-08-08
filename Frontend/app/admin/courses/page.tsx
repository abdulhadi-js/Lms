"use client";
import { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, LayoutGrid, X, Edit2, Trash2, UserCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { coursesApi, usersApi, academicsApi } from '@/lib/api';

export default function CoursesManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState('ALL');

  // Modals
  const [isCourseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // Forms
  const [courseForm, setCourseForm] = useState({
    title: '',
    code: '',
    description: '',
    credits: 100,
    teacherId: '',
    classId: '',
    sectionId: '',
    classLevel: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesData, teachersData, classesData] = await Promise.all([
        coursesApi.list(),
        usersApi.list('TEACHER'),
        academicsApi.listClasses().catch(() => [])
      ]);
      setCourses(coursesData.data || coursesData || []);
      setTeachers(teachersData.data || teachersData || []);
      setClasses(classesData.data || classesData || []);
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
    if (!courseForm.title.trim()) { toast.error('Subject title is required'); return; }
    if (!courseForm.code.trim()) { toast.error('Subject code is required'); return; }
    try {
      const payload = {
        title: courseForm.title,
        code: courseForm.code,
        description: courseForm.description,
        credits: parseInt(courseForm.credits as any) || 100,
        teacherId: courseForm.teacherId || undefined,
        classId: courseForm.classId || undefined,
        sectionId: courseForm.sectionId || undefined,
        classLevel: courseForm.classLevel || undefined,
      };

      if (editingCourse) {
        await coursesApi.update(editingCourse.id, payload);
        toast.success('Subject updated successfully');
      } else {
        await coursesApi.create(payload);
        toast.success('Subject created successfully');
      }
      setCourseModalOpen(false);
      setEditingCourse(null);
      setCourseForm({ title: '', code: '', description: '', credits: 100, teacherId: '', classId: '', sectionId: '', classLevel: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save subject');
    }
  };

  const handleDeleteCourse = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this subject? This will remove all associated enrollments and data.')) return;
    try {
      await coursesApi.remove(id);
      toast.success('Subject deleted');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete subject');
    }
  };

  // Stats
  const totalSubjects = courses.length;
  const assignedSubjects = courses.filter(c => c.teacher || c.teacherId).length;
  const unassignedSubjects = totalSubjects - assignedSubjects;

  // Filter
  const filteredCourses = classFilter === 'ALL'
    ? courses
    : courses.filter(c => c.classId === classFilter || c.classLevel === classFilter);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Subjects Management</h2>
          <p className="text-sm text-body-secondary mt-1">Manage subjects, assign teachers, and link to school classes.</p>
        </div>
        <button
          onClick={() => {
            setEditingCourse(null);
            setCourseForm({ title: '', code: '', description: '', credits: 100, teacherId: '', classId: '', sectionId: '', classLevel: '' });
            setCourseModalOpen(true);
          }}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Subject
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-divider rounded-xl p-4 flex items-center gap-3 brand-shadow">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-heading-on-light">{totalSubjects}</div>
            <div className="text-xs text-body-secondary">Total Subjects</div>
          </div>
        </div>
        <div className="bg-surface border border-divider rounded-xl p-4 flex items-center gap-3 brand-shadow">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="text-2xl font-bold text-heading-on-light">{assignedSubjects}</div>
            <div className="text-xs text-body-secondary">Teacher Assigned</div>
          </div>
        </div>
        <div className="bg-surface border border-divider rounded-xl p-4 flex items-center gap-3 brand-shadow col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-error" />
          </div>
          <div>
            <div className="text-2xl font-bold text-heading-on-light">{unassignedSubjects}</div>
            <div className="text-xs text-body-secondary">No Teacher Assigned</div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-divider bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-heading-on-light">All Subjects</h3>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{filteredCourses.length}</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-body-secondary whitespace-nowrap">Filter by Class:</span>
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="bg-surface border border-border-light rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary flex-1 sm:w-48"
            >
              <option value="ALL">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
              {/* Fallback static options if no classes from API */}
              {classes.length === 0 && ['Nursery','KG','1','2','3','4','5','6','7','8','9','10','11','12'].map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-body-secondary">Loading subjects...</div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-8 text-center text-body-secondary">
              {classFilter === 'ALL' ? 'No subjects found. Create one to get started.' : 'No subjects found for this class.'}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-body-secondary text-[11px] uppercase tracking-wider border-b border-divider bg-surface-container-lowest">
                  <th className="py-3 px-4 font-semibold">Code</th>
                  <th className="py-3 px-4 font-semibold">Subject</th>
                  <th className="py-3 px-4 font-semibold">Class</th>
                  <th className="py-3 px-4 font-semibold">Teacher Assigned</th>
                  <th className="py-3 px-4 font-semibold text-center">Total Marks</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="border-b border-border-light hover:bg-surface-container-lowest transition-colors group">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-primary">{course.code}</td>
                    <td className="py-3 px-4 font-medium text-on-surface">
                      {course.title}
                      {course.description && <p className="text-xs text-body-secondary mt-0.5 truncate max-w-xs">{course.description}</p>}
                    </td>
                    <td className="py-3 px-4">
                      {course.classLevel || course.class?.name ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                          {course.class?.name || `Class ${course.classLevel}`}
                        </span>
                      ) : (
                        <span className="text-body-secondary italic text-xs">Not linked</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-on-surface">
                      {course.teacher ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success text-xs font-bold uppercase">
                            {course.teacher.firstName?.[0]}{course.teacher.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{course.teacher.firstName} {course.teacher.lastName}</div>
                            <div className="text-xs text-body-secondary">{course.teacher.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-error text-xs font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono text-sm font-semibold">
                        {course.credits || 100}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingCourse(course);
                            setCourseForm({
                              title: course.title,
                              code: course.code || '',
                              description: course.description || '',
                              credits: course.credits || 100,
                              teacherId: course.teacherId || course.teacher?.id || '',
                              classId: course.classId || '',
                              sectionId: course.sectionId || '',
                              classLevel: course.classLevel || ''
                            });
                            setCourseModalOpen(true);
                          }}
                          className="text-body-secondary hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10"
                          title="Edit Subject"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteCourse(e, course.id)}
                          className="text-body-secondary hover:text-error transition-colors p-1.5 rounded-lg hover:bg-error/10"
                          title="Delete Subject"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-divider flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-heading-on-light">{editingCourse ? 'Edit Subject' : 'Create New Subject'}</h3>
                <p className="text-xs text-body-secondary mt-0.5">Link this subject to a class and assign a teacher</p>
              </div>
              <button onClick={() => setCourseModalOpen(false)} className="text-body-secondary hover:text-error transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateOrUpdateCourse} className="p-5 space-y-4">
              {/* Subject Name & Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Subject Title <span className="text-error">*</span></label>
                  <input required type="text" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="e.g. Mathematics, Physics, Urdu"
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Subject Code <span className="text-error">*</span></label>
                  <input required type="text" value={courseForm.code} onChange={e => setCourseForm({ ...courseForm, code: e.target.value })}
                    placeholder="e.g. MATH-9"
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Total Marks</label>
                  <input required type="number" min="1" value={courseForm.credits} onChange={e => setCourseForm({ ...courseForm, credits: parseInt(e.target.value) || 100 })}
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                </div>
              </div>

              {/* Class Assignment */}
              <div className="pt-3 border-t border-divider">
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Assign to Class</label>
                <div className="grid grid-cols-2 gap-3">
                  {classes.length > 0 ? (
                    <div className="col-span-2">
                      <select
                        value={courseForm.classId}
                        onChange={e => setCourseForm({ ...courseForm, classId: e.target.value, sectionId: '', classLevel: '' })}
                        className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary mb-2"
                      >
                        <option value="">-- Select Class (Optional) --</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                      {courseForm.classId && classes.find(c => c.id === courseForm.classId)?.sections?.length > 0 && (
                        <select
                          value={courseForm.sectionId}
                          onChange={e => setCourseForm({ ...courseForm, sectionId: e.target.value })}
                          className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        >
                          <option value="">-- Select Section (Optional) --</option>
                          {classes.find(c => c.id === courseForm.classId)?.sections.map((sec: any) => (
                            <option key={sec.id} value={sec.id}>{sec.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs text-body-secondary mb-1">Class Level</label>
                        <select
                          value={courseForm.classLevel}
                          onChange={e => setCourseForm({ ...courseForm, classLevel: e.target.value })}
                          className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        >
                          <option value="">All Classes</option>
                          {['Nursery','KG','1','2','3','4','5','6','7','8','9','10','11','12'].map(c => (
                            <option key={c} value={c}>Class {c}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Teacher Assignment */}
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">
                  Assign Teacher <span className="font-normal text-error">(Required for Timetable)</span>
                </label>
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
                {teachers.length === 0 && (
                  <p className="text-xs text-warning mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> No teachers found. Add staff with Teacher role first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Description (Optional)</label>
                <textarea value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Syllabus overview, topics covered..."
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-divider">
                <button type="button" onClick={() => setCourseModalOpen(false)} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg hover:bg-surface-container transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm">{editingCourse ? 'Save Changes' : 'Create Subject'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
