"use client";
import { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, Layers, LayoutGrid, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { academicsApi } from '@/lib/api';

export default function AcademicsManagement() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isClassModalOpen, setClassModalOpen] = useState(false);
  const [isSectionModalOpen, setSectionModalOpen] = useState(false);
  const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);

  // Forms
  const [classForm, setClassForm] = useState({ name: '', level: 1 });
  const [sectionForm, setSectionForm] = useState({ name: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '' });

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await academicsApi.listClasses();
      setClasses(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const loadClassDetails = async (cls: any) => {
    setSelectedClass(cls);
    try {
      const [secData, subData] = await Promise.all([
        academicsApi.listSections(cls.id),
        academicsApi.listSubjects(cls.id)
      ]);
      setSections(secData);
      setSubjects(subData);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load details');
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await academicsApi.createClass(classForm);
      toast.success('Class created');
      setClassModalOpen(false);
      setClassForm({ name: '', level: 1 });
      fetchClasses();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      await academicsApi.createSection(selectedClass.id, sectionForm);
      toast.success('Section added');
      setSectionModalOpen(false);
      setSectionForm({ name: '' });
      loadClassDetails(selectedClass);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      await academicsApi.createSubject(selectedClass.id, subjectForm);
      toast.success('Subject added');
      setSubjectModalOpen(false);
      setSubjectForm({ name: '', code: '' });
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
        <button 
          onClick={() => setClassModalOpen(true)}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Class
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <button
                    key={cls.id}
                    onClick={() => loadClassDetails(cls)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedClass?.id === cls.id 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{cls.name}</span>
                      <span className="text-xs text-body-secondary bg-surface-container px-2 py-0.5 rounded-full border border-divider">
                        Lvl {cls.level}
                      </span>
                    </div>
                  </button>
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
                    onClick={() => setSectionModalOpen(true)}
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
                    onClick={() => setSubjectModalOpen(true)}
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
                        <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                          <th className="py-3 px-4 font-semibold">Subject Name</th>
                          <th className="py-3 px-4 font-semibold">Code</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {subjects.map(sub => (
                          <tr key={sub.id} className="border-b border-border-light last:border-0 hover:bg-surface-container-low transition-colors">
                            <td className="py-3 px-4 font-medium text-on-surface">{sub.name}</td>
                            <td className="py-3 px-4 text-body-secondary font-mono text-xs">{sub.code || '-'}</td>
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
              <h3 className="text-lg font-bold text-heading-on-light">Create New Class</h3>
              <button onClick={() => setClassModalOpen(false)} className="text-body-secondary hover:text-error"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateClass} className="p-6 space-y-4">
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
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg">Create Class</button>
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
              <h3 className="text-lg font-bold text-heading-on-light">Add Section to {selectedClass?.name}</h3>
              <button onClick={() => setSectionModalOpen(false)} className="text-body-secondary hover:text-error"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateSection} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Section Name (e.g. A, Blue)</label>
                <input required type="text" value={sectionForm.name} onChange={e => setSectionForm({ name: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setSectionModalOpen(false)} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg">Add Section</button>
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
              <h3 className="text-lg font-bold text-heading-on-light">Add Subject to {selectedClass?.name}</h3>
              <button onClick={() => setSubjectModalOpen(false)} className="text-body-secondary hover:text-error"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateSubject} className="p-6 space-y-4">
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
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg">Add Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
