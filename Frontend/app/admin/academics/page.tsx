"use client";
import { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, LayoutGrid, X, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { academicsApi } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

export default function AcademicsManagement() {
  const searchParams = useSearchParams();
  const campusIdFilter = searchParams.get('campusId');
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isClassModalOpen, setClassModalOpen] = useState(false);
  const [isSectionModalOpen, setSectionModalOpen] = useState(false);
  const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);

  // Edit Modes
  const [editingClass, setEditingClass] = useState<any>(null);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [editingSubject, setEditingSubject] = useState<any>(null);

  // Forms
  const [classForm, setClassForm] = useState({ name: '', level: 1 });
  const [sectionForm, setSectionForm] = useState({ name: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '' });

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await academicsApi.listClasses();
      const filtered = campusIdFilter ? data.filter((c: any) => c.campusId === campusIdFilter || c.campus?.id === campusIdFilter) : data;
      setClasses(filtered);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const loadClassDetails = async (cls: any) => {
    setSelectedClass(cls);
    try {
      const classData = await academicsApi.getClass(cls.id);
      setSections(classData.sections || []);
      setSubjects(classData.subjects || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load details');
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [campusIdFilter]);

  const handleCreateOrUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await academicsApi.updateClass(editingClass.id, classForm);
        toast.success('Class updated');
      } else {
        await academicsApi.createClass(classForm);
        toast.success('Class created');
      }
      setClassModalOpen(false);
      setEditingClass(null);
      setClassForm({ name: '', level: 1 });
      fetchClasses();
      if (selectedClass?.id === editingClass?.id) {
        setSelectedClass(null); // Force reload
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteClass = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this class? This will also remove sections and subjects within it.')) return;
    try {
      await academicsApi.removeClass(id);
      toast.success('Class deleted');
      if (selectedClass?.id === id) setSelectedClass(null);
      fetchClasses();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCreateOrUpdateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      if (editingSection) {
        await academicsApi.updateSection(editingSection.id, sectionForm);
        toast.success('Section updated');
      } else {
        await academicsApi.createSection({ ...sectionForm, classId: selectedClass.id });
        toast.success('Section added');
      }
      setSectionModalOpen(false);
      setEditingSection(null);
      setSectionForm({ name: '' });
      loadClassDetails(selectedClass);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Delete this section?')) return;
    try {
      await academicsApi.removeSection(id);
      toast.success('Section deleted');
      loadClassDetails(selectedClass);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCreateOrUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      if (editingSubject) {
        await academicsApi.updateSubject(editingSubject.id, subjectForm);
        toast.success('Subject updated');
      } else {
        await academicsApi.createSubject({ ...subjectForm, classId: selectedClass.id });
        toast.success('Subject added');
      }
      setSubjectModalOpen(false);
      setEditingSubject(null);
      setSubjectForm({ name: '', code: '' });
      loadClassDetails(selectedClass);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Delete this subject?')) return;
    try {
      await academicsApi.removeSubject(id);
      toast.success('Subject deleted');
      loadClassDetails(selectedClass);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Academics Management</h2>
          <p className="text-sm text-body-secondary mt-1">Manage school classes, sections, and subjects structure.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              toast.success('Session promotion started...');
            }}
            className="bg-surface text-primary border border-primary px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-primary/10 flex items-center gap-2"
          >
            Session Rollover / Promote
          </button>
          <button 
            onClick={() => {
              setEditingClass(null);
              setClassForm({ name: '', level: 1 });
              setClassModalOpen(true);
            }}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Class
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Classes List */}
        <div className="lg:col-span-1 bg-surface rounded-xl border border-divider shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-divider bg-surface-container-low flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-heading-on-light">Academic Classes</h3>
          </div>
          <div className="p-2 overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-body-secondary text-sm">Loading...</div>
            ) : classes.length === 0 ? (
              <div className="p-4 text-center text-body-secondary text-sm">No classes found.</div>
            ) : (
              <div className="space-y-1">
                {classes.map(cls => (
                  <div
                    key={cls.id}
                    onClick={() => loadClassDetails(cls)}
                    className={`w-full group cursor-pointer text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                      selectedClass?.id === cls.id 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <div>
                      <span>{cls.name}</span>
                      <span className="text-xs text-body-secondary bg-surface-container px-2 py-0.5 rounded-full border border-divider ml-2">
                        Lvl {cls.level}
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingClass(cls);
                          setClassForm({ name: cls.name, level: cls.level });
                          setClassModalOpen(true);
                        }}
                        className="text-body-secondary hover:text-primary transition-colors p-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClass(e, cls.id)}
                        className="text-body-secondary hover:text-error transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Class Details */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedClass ? (
            <div className="bg-surface rounded-xl border border-divider shadow-sm h-[600px] flex flex-col items-center justify-center text-body-secondary">
              <LayoutGrid className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a class to view its sections and subjects</p>
            </div>
          ) : (
            <>
              {/* Sections Panel */}
              <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
                <div className="p-4 border-b border-divider bg-surface-container-lowest flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-info" />
                    <h3 className="font-bold text-heading-on-light">Sections for {selectedClass.name}</h3>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingSection(null);
                      setSectionForm({ name: '' });
                      setSectionModalOpen(true);
                    }}
                    className="text-xs font-semibold text-primary hover:bg-primary/10 px-2.5 py-1.5 rounded transition-colors"
                  >
                    + Add Section
                  </button>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sections.length === 0 ? (
                    <div className="col-span-full text-sm text-body-secondary italic">No sections defined yet.</div>
                  ) : (
                    sections.map(sec => (
                      <div key={sec.id} className="bg-surface-container-low border border-divider rounded-lg p-3 flex justify-between items-center group">
                        <span className="font-medium text-sm text-on-surface">Section {sec.name}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingSection(sec);
                              setSectionForm({ name: sec.name });
                              setSectionModalOpen(true);
                            }}
                            className="text-body-secondary hover:text-primary transition-colors p-1"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteSection(sec.id)}
                            className="text-body-secondary hover:text-error transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Subjects Panel */}
              <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
                <div className="p-4 border-b border-divider bg-surface-container-lowest flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-success" />
                    <h3 className="font-bold text-heading-on-light">Subjects for {selectedClass.name}</h3>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingSubject(null);
                      setSubjectForm({ name: '', code: '' });
                      setSubjectModalOpen(true);
                    }}
                    className="text-xs font-semibold text-primary hover:bg-primary/10 px-2.5 py-1.5 rounded transition-colors"
                  >
                    + Add Subject
                  </button>
                </div>
                <div className="p-0">
                  {subjects.length === 0 ? (
                    <div className="p-4 text-sm text-body-secondary italic">No subjects defined yet.</div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-body-secondary text-[11px] uppercase tracking-wider border-b border-divider">
                          <th className="py-3 px-4 font-semibold">Subject Name</th>
                          <th className="py-3 px-4 font-semibold">Code</th>
                          <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {subjects.map(sub => (
                          <tr key={sub.id} className="border-b border-border-light last:border-0 hover:bg-surface-container-low transition-colors group">
                            <td className="py-3 px-4 font-medium text-on-surface">{sub.name}</td>
                            <td className="py-3 px-4 text-body-secondary font-mono text-xs">{sub.code || '-'}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => {
                                    setEditingSubject(sub);
                                    setSubjectForm({ name: sub.name, code: sub.code || '' });
                                    setSubjectModalOpen(true);
                                  }}
                                  className="text-body-secondary hover:text-primary transition-colors p-1"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteSubject(sub.id)}
                                  className="text-body-secondary hover:text-error transition-colors p-1"
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
            </>
          )}
        </div>
      </div>

      {/* Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-divider flex justify-between items-center">
              <h3 className="text-lg font-bold text-heading-on-light">{editingClass ? 'Edit Class' : 'Create New Class'}</h3>
              <button onClick={() => setClassModalOpen(false)} className="text-body-secondary hover:text-error"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateOrUpdateClass} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Class Name (e.g. Class 6)</label>
                <input required type="text" value={classForm.name} onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Academic Level (for sorting)</label>
                <input required type="number" min="0" value={classForm.level} onChange={e => setClassForm({ ...classForm, level: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setClassModalOpen(false)} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg">{editingClass ? 'Save Changes' : 'Create Class'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section Modal */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-divider flex justify-between items-center">
              <h3 className="text-lg font-bold text-heading-on-light">{editingSection ? 'Edit Section' : `Add Section to ${selectedClass?.name}`}</h3>
              <button onClick={() => setSectionModalOpen(false)} className="text-body-secondary hover:text-error"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateOrUpdateSection} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Section Name (e.g. A, Blue)</label>
                <input required type="text" value={sectionForm.name} onChange={e => setSectionForm({ name: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setSectionModalOpen(false)} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg">{editingSection ? 'Save Changes' : 'Add Section'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-divider flex justify-between items-center">
              <h3 className="text-lg font-bold text-heading-on-light">{editingSubject ? 'Edit Subject' : `Add Subject to ${selectedClass?.name}`}</h3>
              <button onClick={() => setSubjectModalOpen(false)} className="text-body-secondary hover:text-error"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateOrUpdateSubject} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Subject Name (e.g. Mathematics)</label>
                <input required type="text" value={subjectForm.name} onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Subject Code (Optional)</label>
                <input type="text" value={subjectForm.code} onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setSubjectModalOpen(false)} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg">{editingSubject ? 'Save Changes' : 'Add Subject'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
