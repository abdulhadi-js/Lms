"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BookOpen, Users, Layers, ChevronDown, ChevronUp, Plus, Edit } from 'lucide-react';
import { coursesApi } from '@/lib/api';

export default function CourseDetail() {
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'MODULES' | 'STUDENTS' | 'ASSIGNMENTS'>('MODULES');
  const [showAddModule, setShowAddModule] = useState(false);
  
  // Add Module Form State
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const [courseData, modulesData] = await Promise.all([
        coursesApi.get(courseId),
        coursesApi.getModules(courseId)
      ]);
      setCourse(courseData);
      setModules(modulesData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call as create module isn't in api.ts
    const newMod = {
      id: Math.random().toString(36).substr(2, 9),
      title: newModuleTitle,
      description: newModuleDesc
    };
    setModules([...modules, newMod]);
    setNewModuleTitle('');
    setNewModuleDesc('');
    setShowAddModule(false);
  };

  if (loading) return <div className="p-12 text-center text-body-secondary max-w-[1280px] mx-auto">Loading course details...</div>;
  if (error) return <div className="p-12 text-center text-error max-w-[1280px] mx-auto">{error}</div>;
  if (!course) return null;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-divider brand-shadow p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-primary-container/20 text-primary-fixed rounded-xl">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-heading-on-light">{course.title}</h2>
              <span className="px-2.5 py-1 bg-surface-container text-body-secondary text-xs rounded font-medium border border-border-light">{course.code}</span>
              {course.status === 'ACTIVE' ? (
                <span className="px-2.5 py-1 bg-success-bg text-success text-xs rounded-full font-medium border border-success/20">Active</span>
              ) : (
                <span className="px-2.5 py-1 bg-surface-container text-body-secondary text-xs rounded-full font-medium border border-border-light">{course.status}</span>
              )}
            </div>
            <p className="text-sm text-body-secondary mt-2 max-w-3xl">{course.description || 'No description provided.'}</p>
            
            <div className="flex items-center gap-6 mt-4 text-sm font-medium text-body-secondary">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-icon-inactive" />
                <span>32 Enrolled</span> {/* Mock data */}
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-icon-inactive" />
                <span>{course.credits} Credits</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border-light rounded-lg text-sm font-medium text-body-secondary hover:bg-surface-container transition-colors">
            <Edit className="w-4 h-4" /> Edit Details
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-surface-container-low p-1 rounded-lg w-fit border border-divider">
        {['MODULES', 'STUDENTS', 'ASSIGNMENTS'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-white shadow-sm text-primary' : 'text-body-secondary hover:text-primary'}`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-divider brand-shadow min-h-[400px]">
        
        {activeTab === 'MODULES' && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-heading-on-light">Course Modules</h3>
                <p className="text-sm text-body-secondary">Manage curriculum and content.</p>
              </div>
              <button 
                onClick={() => setShowAddModule(!showAddModule)}
                className="flex items-center gap-2 primary-gradient text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
              >
                <Plus className="h-4 w-4" /> Add Module
              </button>
            </div>

            {showAddModule && (
              <form onSubmit={handleAddModule} className="bg-surface-container-low p-5 rounded-lg border border-divider mb-6 space-y-4 animate-in fade-in zoom-in duration-200">
                <h4 className="font-semibold text-on-surface">Create New Module</h4>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Module Title</label>
                  <input
                    required
                    type="text"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="e.g. Introduction to Variables"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
                  <textarea
                    value={newModuleDesc}
                    onChange={(e) => setNewModuleDesc(e.target.value)}
                    className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[80px]"
                    placeholder="Module objectives and contents..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddModule(false)}
                    className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
                  >
                    Save Module
                  </button>
                </div>
              </form>
            )}

            {modules.length === 0 ? (
              <div className="py-12 text-center text-body-secondary border border-dashed border-border-light rounded-lg">
                No modules found. Click "Add Module" to start building your curriculum.
              </div>
            ) : (
              <div className="space-y-3">
                {modules.map((mod, i) => (
                  <div key={mod.id || i} className="group border border-border-light rounded-lg overflow-hidden transition-colors hover:border-primary/40">
                    <div className="p-4 bg-white flex justify-between items-center cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-surface-container flex items-center justify-center rounded-lg text-base font-bold text-primary-fixed">{i + 1}</div>
                        <div>
                          <h4 className="font-bold text-on-surface text-base group-hover:text-primary transition-colors">{mod.title}</h4>
                          <p className="text-sm text-body-secondary mt-0.5">{mod.description || 'No description provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-sm font-medium text-icon-inactive hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-surface-container">
                          Edit
                        </button>
                        <ChevronDown className="w-5 h-5 text-icon-inactive" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'STUDENTS' && (
          <div className="p-12 text-center text-body-secondary">
            Students list placeholder.
          </div>
        )}

        {activeTab === 'ASSIGNMENTS' && (
          <div className="p-12 text-center text-body-secondary">
            Assignments list placeholder.
          </div>
        )}

      </div>
    </div>
  );
}
