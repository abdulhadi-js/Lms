"use client";
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Search, Plus, UserMinus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { enrollmentsApi, usersApi, coursesApi } from '@/lib/api';
import Link from 'next/link';

export default function EnrollmentsManagement() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [grFilter, setGrFilter] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null);

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  const [dropModalOpen, setDropModalOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState('');
  const [dropReason, setDropReason] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');

  const [rolloverModalOpen, setRolloverModalOpen] = useState(false);
  const [rolloverFromCourse, setRolloverFromCourse] = useState('');
  const [rolloverToCourse, setRolloverToCourse] = useState('');
  const [isRollingOver, setIsRollingOver] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrollData, usersData, coursesData] = await Promise.all([
        enrollmentsApi.list(page, limit),
        usersApi.list('STUDENT'),
        coursesApi.list()
      ]);
      if (enrollData && typeof enrollData === 'object' && !Array.isArray(enrollData) && enrollData.data) {
        setEnrollments(enrollData.data);
        setTotal(enrollData.total || 0);
      } else {
        setEnrollments(enrollData || []);
        setTotal(enrollData?.length || 0);
      }
      setStudents(usersData.data || usersData || []);
      setCourses(coursesData.data || coursesData || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as Element).closest('.actions-dropdown')) return;
      setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleEnrollSubmit = async () => {
    if (selectedStudents.length === 0 || !selectedCourse) {
      toast.error("Please select at least one student and a course.");
      return;
    }
    try {
      await enrollmentsApi.bulkEnroll(selectedCourse, selectedStudents);
      setEnrollModalOpen(false);
      setSelectedStudents([]);
      setSelectedCourse('');
      toast.success(`${selectedStudents.length} student(s) enrolled successfully`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to enroll students');
    }
  };

  const handleDropClick = (id: string) => {
    setSelectedEnrollmentId(id);
    setDropReason('');
    setDropModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDropSubmit = async () => {
    if (!selectedEnrollmentId || !dropReason) return;
    try {
      await enrollmentsApi.requestDrop(selectedEnrollmentId, dropReason);
      setDropModalOpen(false);
      toast.success('Enrollment dropped successfully');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to drop enrollment');
    }
  };

  const handleEditClick = (enr: any) => {
    setSelectedEnrollmentId(enr.id);
    setEditStatus(enr.status);
    setEditModalOpen(true);
    setOpenDropdown(null);
  };

  const handleEditSubmit = async () => {
    if (!selectedEnrollmentId || !editStatus) return;
    try {
      await enrollmentsApi.update(selectedEnrollmentId, { status: editStatus });
      setEditModalOpen(false);
      toast.success('Enrollment status updated');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleRolloverSubmit = async () => {
    if (!rolloverFromCourse || !rolloverToCourse) {
      toast.error('Please select both origin and destination courses');
      return;
    }
    if (rolloverFromCourse === rolloverToCourse) {
      toast.error('Origin and destination courses must be different');
      return;
    }
    setIsRollingOver(true);
    try {
      const res = await enrollmentsApi.rollover({
        fromCourseId: rolloverFromCourse,
        toCourseId: rolloverToCourse
      });
      toast.success(res.message || `Successfully rolled over ${res.count} students`);
      setRolloverModalOpen(false);
      setRolloverFromCourse('');
      setRolloverToCourse('');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to perform session rollover');
    } finally {
      setIsRollingOver(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this enrollment record?')) return;
    try {
      await enrollmentsApi.remove(id);
      toast.success('Enrollment deleted completely');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete enrollment');
    }
    setOpenDropdown(null);
  };

  const filteredEnrollments = enrollments.filter(e => {
    const matchesStatus = statusFilter === 'ALL' || (e.status || '').toUpperCase() === statusFilter.toUpperCase();
    // B16 FIX: search by student name, email, course title, and course code
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      `${e.student?.firstName || ''} ${e.student?.lastName || ''}`.toLowerCase().includes(q) ||
      (e.student?.email || '').toLowerCase().includes(q) ||
      (e.course?.title || '').toLowerCase().includes(q) ||
      (e.course?.code || '').toLowerCase().includes(q) ||
      (e.student?.id || '').toLowerCase().includes(q);
      
    const matchesClass = !classFilter || (e.course?.title || '').toLowerCase().includes(classFilter.toLowerCase()) || (e.course?.code || '').toLowerCase().includes(classFilter.toLowerCase());
    const matchesGender = !genderFilter || (e.student?.gender || '').toLowerCase() === genderFilter.toLowerCase();
    const matchesGr = !grFilter || (e.student?.grNumber || '').toLowerCase().includes(grFilter.toLowerCase());
    
    return matchesStatus && matchesSearch && matchesClass && matchesGender && matchesGr;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Enrollment Management</h2>
          <p className="text-sm text-body-secondary mt-1">Manage student course enrollments and drops.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/enrollments/new" className="flex items-center gap-2 primary-gradient text-white px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow">
            <Plus className="h-4 w-4" />
            New Admission
          </Link>
          <button 
            onClick={() => setRolloverModalOpen(true)}
            className="flex items-center gap-2 bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors hidden md:flex"
          >
            Session Rollover
          </button>
          <button 
            onClick={() => setEnrollModalOpen(true)}
            className="flex items-center gap-2 border border-border-light bg-surface text-on-surface px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors"
          >
            Direct Enroll
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <select 
              className="bg-surface border border-border-light rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DROPPED">Dropped</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className="w-full md:w-64 relative">
            <Search className="w-4 h-4 text-body-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name, email, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 bg-surface-container-lowest">
          <input 
            type="text" 
            placeholder="Filter by Class / Course..."
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <select 
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Any Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input 
            type="text" 
            placeholder="Filter by GR Number..."
            value={grFilter}
            onChange={(e) => setGrFilter(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-body-secondary">Loading enrollments...</div>
          ) : error ? (
            <div className="p-8 text-center text-error">{error}</div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="p-8 text-center text-body-secondary">No enrollments found.</div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredEnrollments.map((enr, i) => (
                  <div key={enr.id || i} className="bg-surface p-4 rounded-xl border border-divider shadow-sm relative">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-on-surface">{enr.student?.firstName} {enr.student?.lastName}</div>
                        <div className="text-xs text-body-secondary">{enr.student?.email}</div>
                      </div>
                      
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === enr.id ? null : enr.id)}
                        className="text-icon-inactive hover:text-primary p-1 rounded-md"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {openDropdown === enr.id && (
                        <div className="absolute right-4 top-12 w-48 bg-surface rounded-lg shadow-xl border border-divider py-1 z-50">
                          {enr.status === 'ACTIVE' && (
                            <button 
                              onClick={() => { handleDropClick(enr.id); setOpenDropdown(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-warning hover:bg-warning-bg flex items-center gap-2"
                            >
                              <UserMinus className="w-4 h-4" /> Drop Student
                            </button>
                          )}
                          <button 
                            onClick={() => { handleEditClick(enr); setOpenDropdown(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4 text-icon-inactive" /> Edit Status
                          </button>
                          <hr className="my-1 border-divider" />
                          <button 
                            onClick={() => { handleDelete(enr.id); setOpenDropdown(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-bg flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Record
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-body-secondary">Course:</div>
                      <div className="font-medium text-right truncate" title={enr.course?.title}>
                        {enr.course?.title} <span className="text-xs text-body-secondary">({enr.course?.code})</span>
                      </div>
                      
                      <div className="text-body-secondary">Status:</div>
                      <div className="flex justify-end">
                        {enr.status === 'ACTIVE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">Active</span>}
                        {enr.status === 'DROPPED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20">Dropped</span>}
                        {enr.status === 'COMPLETED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-container/20 text-primary border border-primary/20">Completed</span>}
                      </div>
                      
                      <div className="text-body-secondary">Active At:</div>
                      <div className="text-right">{new Date(enr.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <table className="hidden md:table w-full text-left border-collapse">
              <thead>
                <tr className="text-body-secondary text-[11px] uppercase tracking-wider border-b border-divider">
                  <th className="py-3 px-4 font-semibold">Student</th>
                  <th className="py-3 px-4 font-semibold">Course</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Active At</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredEnrollments.map((enr, i) => (
                  <tr key={enr.id || i} className="border-b border-border-light  hover:bg-surface transition-colors relative">
                    <td className="py-3 px-4">
                      <Link href={`/admin/users/${enr.student?.id}`} className="font-medium text-on-surface hover:text-primary hover:underline block">
                        {enr.student?.firstName} {enr.student?.lastName}
                      </Link>
                      <div className="text-xs text-body-secondary">{enr.student?.email}</div>
                    </td>
                    <td className="py-3 px-4 text-on-surface">{enr.course?.title} <span className="text-xs text-body-secondary ml-1">({enr.course?.code})</span></td>
                    <td className="py-3 px-4">
                      {enr.status === 'ACTIVE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">Active</span>}
                      {enr.status === 'DROPPED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20">Dropped</span>}
                      {enr.status === 'COMPLETED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-container/20 text-primary border border-primary/20">Completed</span>}
                    </td>
                    <td className="py-3 px-4 text-body-secondary">{new Date(enr.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right relative actions-dropdown">
                      <button
                        onClick={(e) => {
                          if (openDropdown === enr.id) {
                            setOpenDropdown(null);
                            setDropdownPos(null);
                          } else {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            // B14/B15 FIX: use fixed positioning so dropdown escapes overflow-x-auto clipping
                            setDropdownPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                            setOpenDropdown(enr.id);
                          }
                        }}
                        className="text-icon-inactive hover:text-primary transition-colors p-1.5 rounded-md hover:bg-surface-container"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {openDropdown === enr.id && dropdownPos && (
                        <div
                          style={{ position: 'fixed', top: dropdownPos.top, right: dropdownPos.right }}
                          className="w-48 bg-surface rounded-lg shadow-xl border border-divider py-1 z-[9999]"
                        >
                          {enr.status === 'ACTIVE' && (
                            <button 
                              onClick={() => handleDropClick(enr.id)}
                              className="w-full text-left px-4 py-2 text-sm text-warning hover:bg-warning-bg flex items-center gap-2"
                            >
                              <UserMinus className="w-4 h-4" /> Drop Student
                            </button>
                          )}
                          <button 
                            onClick={() => handleEditClick(enr)}
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4 text-icon-inactive" /> Edit Status
                          </button>
                          <hr className="my-1 border-divider" />
                          <button 
                            onClick={() => handleDelete(enr.id)}
                            className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-bg flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Record
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {total > limit && (
              <div className="p-4 border-t border-divider flex items-center justify-between text-sm text-body-secondary">
                <div>
                  Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} enrollments
                </div>
                <div className="flex gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 rounded-md border border-divider hover:bg-surface-container disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={page * limit >= total}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 rounded-md border border-divider hover:bg-surface-container disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            </>
          )}
        </div>
      </div>

      {/* Direct Enroll Modal */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-xl shadow-xl p-5 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-heading-on-light mb-4">Direct Enroll Student</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-on-surface">Select Students</label>
                  <span className="text-xs text-primary font-semibold">{selectedStudents.length} selected</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Filter students..." 
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full mb-2 border border-border-light rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="max-h-48 overflow-y-auto border border-border-light rounded-lg p-2 space-y-1">
                  {students.filter(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(studentSearch.toLowerCase())).map(s => (
                    <label key={s.id} className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg cursor-pointer border border-transparent hover:border-border-light transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-border-light text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        checked={selectedStudents.includes(s.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, s.id]);
                          } else {
                            setSelectedStudents(selectedStudents.filter(id => id !== s.id));
                          }
                        }}
                      />
                      <span className="text-sm font-medium text-on-surface flex-1">{s.firstName} {s.lastName} <span className="text-body-secondary font-normal text-xs ml-1">({s.email})</span></span>
                    </label>
                  ))}
                  {students.filter(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(studentSearch.toLowerCase())).length === 0 && (
                    <div className="text-sm text-body-secondary p-4 text-center">No students found.</div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Select Course</label>
                <select 
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">-- Choose a Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setEnrollModalOpen(false)}
                className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container"
              >
                Cancel
              </button>
              <button 
                onClick={handleEnrollSubmit}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
              >
                Enroll Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Rollover Modal */}
      {rolloverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-xl shadow-xl p-5 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-heading-on-light mb-2">Session Rollover</h3>
            <p className="text-sm text-body-secondary mb-6">Promote active students from a previous academic session to a new course. Existing enrollments will be marked as Completed.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">From Course (Origin)</label>
                <select 
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={rolloverFromCourse}
                  onChange={(e) => setRolloverFromCourse(e.target.value)}
                >
                  <option value="">-- Choose Origin Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">To Course (Destination)</label>
                <select 
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={rolloverToCourse}
                  onChange={(e) => setRolloverToCourse(e.target.value)}
                >
                  <option value="">-- Choose Destination Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setRolloverModalOpen(false)}
                disabled={isRollingOver}
                className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container"
              >
                Cancel
              </button>
              <button 
                onClick={handleRolloverSubmit}
                disabled={isRollingOver}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-70 flex items-center gap-2"
              >
                {isRollingOver ? 'Processing...' : 'Execute Rollover'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-xl shadow-xl p-5 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-heading-on-light mb-4">Edit Enrollment Status</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-on-surface mb-1">Status</label>
              <select 
                className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="DROPPED">DROPPED</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drop Modal */}
      {dropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-xl shadow-xl p-5 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-heading-on-light mb-4">Drop Enrollment</h3>
            <p className="text-sm text-body-secondary mb-4">Provide a reason for dropping this student.</p>
            
            <textarea
              value={dropReason}
              onChange={(e) => setDropReason(e.target.value)}
              className="w-full border border-border-light rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[100px] mb-4"
              placeholder="Reason for drop..."
            />
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDropModalOpen(false)}
                className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container"
              >
                Cancel
              </button>
              <button 
                onClick={handleDropSubmit}
                className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error/90"
              >
                Confirm Drop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
