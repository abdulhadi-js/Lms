import { toast } from 'react-hot-toast';
"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, UserMinus } from 'lucide-react';
import { enrollmentsApi, usersApi, coursesApi } from '@/lib/api';

export default function EnrollmentsManagement() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const [dropModalOpen, setDropModalOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState('');
  const [dropReason, setDropReason] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrollData, usersData, coursesData] = await Promise.all([
        enrollmentsApi.list(),
        usersApi.list('STUDENT'),
        coursesApi.list()
      ]);
      setEnrollments(enrollData);
      setStudents(usersData);
      setCourses(coursesData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load enrollments');
    } finally {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleEnrollSubmit = async () => {
    if (!selectedStudent || !selectedCourse) {
      toast("Please select both a student and a course.");
      return;
    }
    try {
      await enrollmentsApi.directEnroll(selectedStudent, selectedCourse);
      setEnrollModalOpen(false);
      setSelectedStudent('');
      setSelectedCourse('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to enroll student');
    }
  };

  const handleDropClick = (id: string) => {
    setSelectedEnrollmentId(id);
    setDropReason('');
    setDropModalOpen(true);
  };

  const handleDropSubmit = async () => {
    if (!selectedEnrollmentId || !dropReason) return;
    try {
      await enrollmentsApi.requestDrop(selectedEnrollmentId, dropReason);
      setDropModalOpen(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to drop enrollment');
    }
  };

  const filteredEnrollments = enrollments.filter(e => statusFilter === 'ALL' || e.status === statusFilter);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Enrollment Management</h2>
          <p className="text-sm text-body-secondary mt-1">Manage student course enrollments and drops.</p>
        </div>
        <button 
          onClick={() => setEnrollModalOpen(true)}
          className="flex items-center gap-2 primary-gradient text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
        >
          <Plus className="h-4 w-4" />
          Direct Enroll
        </button>
      </div>

      <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <select 
              className="bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ENROLLED">Enrolled</option>
              <option value="DROPPED">Dropped</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-8 text-center text-body-secondary">Loading enrollments...</div>
          ) : error ? (
            <div className="p-8 text-center text-error">{error}</div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="p-8 text-center text-body-secondary">No enrollments found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                  <th className="py-4 px-6 font-semibold">Student</th>
                  <th className="py-4 px-6 font-semibold">Course</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Enrolled At</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredEnrollments.map((enr, i) => (
                  <tr key={enr.id || i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface">{enr.student?.firstName} {enr.student?.lastName}</div>
                      <div className="text-xs text-body-secondary">{enr.student?.email}</div>
                    </td>
                    <td className="py-4 px-6 text-on-surface">{enr.course?.title}</td>
                    <td className="py-4 px-6">
                      {enr.status === 'ENROLLED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">Enrolled</span>}
                      {enr.status === 'DROPPED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20">Dropped</span>}
                      {enr.status === 'COMPLETED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-container/20 text-primary border border-primary/20">Completed</span>}
                    </td>
                    <td className="py-4 px-6 text-body-secondary">{new Date(enr.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-right">
                      {enr.status === 'ENROLLED' && (
                        <button 
                          onClick={() => handleDropClick(enr.id)}
                          className="p-1.5 text-error hover:bg-error-bg rounded transition-colors"
                          title="Drop Student"
                        >
                          <UserMinus className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Direct Enroll Modal */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-heading-on-light mb-4">Direct Enroll Student</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Select Student</label>
                <select 
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <option value="">-- Choose a Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.email})</option>
                  ))}
                </select>
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

      {/* Drop Modal */}
      {dropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
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
