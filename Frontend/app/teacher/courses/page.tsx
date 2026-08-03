"use client";
import { useState, useEffect } from 'react';
import { BookOpen, Users, Layers, ChevronDown, ChevronUp, Plus, Edit, Trash2, X } from 'lucide-react';
import { coursesApi } from '@/lib/api';

export default function TeacherCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [courseModules, setCourseModules] = useState<Record<string, any[]>>({});
  const [modulesLoading, setModulesLoading] = useState<Record<string, boolean>>({});

  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState({ title: '', code: '', description: '', credits: 3 });

  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '' });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await coursesApi.list();
      setCourses(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleCourseExpand = async (courseId: string) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }
    
    setExpandedCourseId(courseId);
    
    if (!courseModules[courseId]) {
      setModulesLoading(prev => ({ ...prev, [courseId]: true }));
      try {
        const modules = await coursesApi.getModules(courseId);
        setCourseModules(prev => ({ ...prev, [courseId]: modules }));
      } catch (err) {
        console.error("Failed to load modules", err);
      } finally {
        setModulesLoading(prev => ({ ...prev, [courseId]: false }));
      }
    }
  };

  // Course CRUD
  const openCourseModal = (course?: any) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({ title: course.title, code: course.code, description: course.description, credits: course.credits });
    } else {
      setEditingCourse(null);
      setCourseForm({ title: '', code: '', description: '', credits: 3 });
    }
    setShowCourseModal(true);
  };

  const saveCourse = async () => {
    try {
      if (editingCourse) {
        await coursesApi.update(editingCourse.id, courseForm);
      } else {
        await coursesApi.create(courseForm);
      }
      setShowCourseModal(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert('Failed to save course');
    }
  };

  const deleteCourse = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await coursesApi.remove(id);
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert('Failed to delete course');
    }
  };

  // Module CRUD
  const openModuleModal = (module?: any) => {
    if (module) {
      setEditingModule(module);
      setModuleForm({ title: module.title, description: module.description });
    } else {
      setEditingModule(null);
      setModuleForm({ title: '', description: '' });
    }
    setShowModuleModal(true);
  };

  const saveModule = async () => {
    if (!expandedCourseId) return;
    try {
      if (editingModule) {
        await coursesApi.updateModule(expandedCourseId, editingModule.id, moduleForm);
      } else {
        await coursesApi.createModule(expandedCourseId, moduleForm);
      }
      setShowModuleModal(false);
      // Reload modules
      const modules = await coursesApi.getModules(expandedCourseId);
      setCourseModules(prev => ({ ...prev, [expandedCourseId]: modules }));
    } catch (err) {
      console.error(err);
      alert('Failed to save module');
    }
  };

  const deleteModule = async (modId: string) => {
    if (!expandedCourseId) return;
    if (!confirm('Are you sure you want to delete this module?')) return;
    try {
      await coursesApi.removeModule(expandedCourseId, modId);
      const modules = await coursesApi.getModules(expandedCourseId);
      setCourseModules(prev => ({ ...prev, [expandedCourseId]: modules }));
    } catch (err) {
      console.error(err);
      alert('Failed to delete module');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">My Courses</h2>
          <p className="text-sm text-body-secondary mt-1">Manage your assigned courses and course content.</p>
        </div>
        <button onClick={() => openCourseModal()} className="flex items-center gap-2 px-4 py-2 primary-gradient text-white rounded-lg text-sm font-semibold hover:shadow-md transition-shadow">
          <Plus className="w-4 h-4" /> Create Course
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={`skeleton-${idx}`} className="bg-surface rounded-xl border border-divider brand-shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
              <div className="flex items-start gap-4 w-full">
                <div className="w-12 h-12 bg-divider rounded-lg mt-1 shrink-0"></div>
                <div className="space-y-3 w-full">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-48 bg-divider rounded"></div>
                    <div className="h-5 w-16 bg-divider rounded"></div>
                  </div>
                  <div className="h-4 w-64 md:w-96 bg-divider rounded"></div>
                  <div className="flex gap-4 mt-3">
                    <div className="h-4 w-32 bg-divider rounded"></div>
                    <div className="h-4 w-24 bg-divider rounded"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end mt-4 md:mt-0">
                <div className="w-8 h-8 bg-divider rounded-full"></div>
                <div className="w-8 h-8 bg-divider rounded-full"></div>
                <div className="w-8 h-8 bg-divider rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-12 text-center text-error">{error}</div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center text-body-secondary bg-surface rounded-xl border border-divider">You have not been assigned any courses yet.</div>
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id} className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden transition-all">
              <div 
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-surface transition-colors"
                onClick={() => toggleCourseExpand(course.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-container/20 text-primary-fixed rounded-lg mt-1">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-heading-on-light">{course.title}</h3>
                      <span className="px-2 py-0.5 bg-surface-container text-body-secondary text-xs rounded font-medium border border-border-light">{course.code}</span>
                    </div>
                    <p className="text-sm text-body-secondary mt-1 max-w-2xl">{course.description || 'No description provided.'}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm font-medium text-body-secondary">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-icon-inactive" />
                        <span>Enrolled Students</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-icon-inactive" />
                        <span>{course.credits} Credits</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={(e) => { e.stopPropagation(); openCourseModal(course); }} className="p-2 text-icon-inactive hover:text-primary transition-colors bg-surface rounded-full">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => deleteCourse(course.id, e)} className="p-2 text-icon-inactive hover:text-error transition-colors bg-surface rounded-full">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-icon-inactive hover:text-primary transition-colors bg-surface rounded-full">
                    {expandedCourseId === course.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {expandedCourseId === course.id && (
                <div className="border-t border-divider bg-surface-container-lowest p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-on-surface">Course Modules</h4>
                    <button onClick={() => openModuleModal()} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border-light rounded-lg text-sm font-medium text-primary hover:bg-surface-container transition-colors shadow-sm">
                      <Plus className="w-4 h-4" /> Add Module
                    </button>
                  </div>
                  
                  {modulesLoading[course.id] ? (
                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, idx) => (
                        <div key={`mod-skel-${idx}`} className="p-4 bg-surface border border-border-light rounded-lg flex justify-between items-center animate-pulse">
                          <div className="flex items-center gap-3 w-full">
                            <div className="w-8 h-8 bg-divider rounded shrink-0"></div>
                            <div className="space-y-2 w-full">
                              <div className="h-4 w-32 bg-divider rounded"></div>
                              <div className="h-3 w-48 bg-divider rounded"></div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-8 h-4 bg-divider rounded"></div>
                            <div className="w-10 h-4 bg-divider rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {courseModules[course.id]?.length > 0 ? (
                        courseModules[course.id].map((mod: any, i: number) => (
                          <div key={mod.id || i} className="p-4 bg-surface border border-border-light rounded-lg flex justify-between items-center hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-surface-container flex items-center justify-center rounded text-sm font-bold text-body-secondary">{i + 1}</div>
                              <div>
                                <h5 className="font-medium text-on-surface">{mod.title}</h5>
                                <p className="text-xs text-body-secondary">{mod.description || 'Module content description'}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => openModuleModal(mod)} className="text-sm font-medium text-primary hover:underline">Edit</button>
                              <button onClick={() => deleteModule(mod.id)} className="text-sm font-medium text-error hover:underline">Delete</button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-sm text-body-secondary bg-surface border border-border-light border-dashed rounded-lg">
                          No modules created yet. Click "Add Module" to get started.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-divider">
              <h3 className="font-bold text-lg">{editingCourse ? 'Edit Course' : 'Create Course'}</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-body-secondary hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-body-secondary mb-1">Course Code</label>
                <input value={courseForm.code} onChange={e => setCourseForm({...courseForm, code: e.target.value})} className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="e.g. CS101" />
              </div>
              <div>
                <label className="block text-sm font-medium text-body-secondary mb-1">Title</label>
                <input value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Course Title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-body-secondary mb-1">Description</label>
                <textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Description" rows={3}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-body-secondary mb-1">Credits</label>
                <input type="number" value={courseForm.credits} onChange={e => setCourseForm({...courseForm, credits: parseInt(e.target.value)})} className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="p-4 border-t border-divider flex justify-end gap-2 bg-surface">
              <button onClick={() => setShowCourseModal(false)} className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container">Cancel</button>
              <button onClick={saveCourse} className="px-4 py-2 primary-gradient text-white rounded-lg text-sm font-semibold hover:shadow-md transition-shadow">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-divider">
              <h3 className="font-bold text-lg">{editingModule ? 'Edit Module' : 'Add Module'}</h3>
              <button onClick={() => setShowModuleModal(false)} className="text-body-secondary hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-body-secondary mb-1">Title</label>
                <input value={moduleForm.title} onChange={e => setModuleForm({...moduleForm, title: e.target.value})} className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Module Title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-body-secondary mb-1">Description</label>
                <textarea value={moduleForm.description} onChange={e => setModuleForm({...moduleForm, description: e.target.value})} className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Description" rows={3}></textarea>
              </div>
            </div>
            <div className="p-4 border-t border-divider flex justify-end gap-2 bg-surface">
              <button onClick={() => setShowModuleModal(false)} className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container">Cancel</button>
              <button onClick={saveModule} className="px-4 py-2 primary-gradient text-white rounded-lg text-sm font-semibold hover:shadow-md transition-shadow">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
