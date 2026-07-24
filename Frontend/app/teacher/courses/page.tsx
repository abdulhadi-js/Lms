"use client";
import { useState, useEffect } from 'react';
import { BookOpen, Users, Layers, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { coursesApi } from '@/lib/api';

export default function TeacherCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [courseModules, setCourseModules] = useState<Record<string, any[]>>({});
  const [modulesLoading, setModulesLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await coursesApi.list();
        setCourses(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load courses');
      } finally {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false);
      }
    };
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

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">My Courses</h2>
          <p className="text-sm text-body-secondary mt-1">Manage your assigned courses and course content.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-body-secondary">Loading your courses...</div>
      ) : error ? (
        <div className="p-12 text-center text-error">{error}</div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center text-body-secondary bg-white rounded-xl border border-divider">You have not been assigned any courses yet.</div>
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden transition-all">
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
                        <span>24 Enrolled</span> {/* Mock data as it's not in course object */}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-icon-inactive" />
                        <span>{course.credits} Credits</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end">
                  <button className="p-2 text-icon-inactive hover:text-primary transition-colors bg-surface rounded-full">
                    {expandedCourseId === course.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {expandedCourseId === course.id && (
                <div className="border-t border-divider bg-surface-container-lowest p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-on-surface">Course Modules</h4>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border-light rounded-lg text-sm font-medium text-primary hover:bg-surface-container transition-colors shadow-sm">
                      <Plus className="w-4 h-4" /> Add Module
                    </button>
                  </div>
                  
                  {modulesLoading[course.id] ? (
                    <div className="p-4 text-center text-sm text-body-secondary">Loading modules...</div>
                  ) : (
                    <div className="space-y-3">
                      {courseModules[course.id]?.length > 0 ? (
                        courseModules[course.id].map((mod: any, i: number) => (
                          <div key={mod.id || i} className="p-4 bg-white border border-border-light rounded-lg flex justify-between items-center hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-surface-container flex items-center justify-center rounded text-sm font-bold text-body-secondary">{i + 1}</div>
                              <div>
                                <h5 className="font-medium text-on-surface">{mod.title}</h5>
                                <p className="text-xs text-body-secondary">{mod.description || 'Module content description'}</p>
                              </div>
                            </div>
                            <button className="text-sm font-medium text-primary hover:underline">Edit</button>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-sm text-body-secondary bg-white border border-border-light border-dashed rounded-lg">
                          No modules created yet. Click &quot;Add Module&quot; to get started.
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
    </div>
  );
}
