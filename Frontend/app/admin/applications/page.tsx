"use client";
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Search, Check, X, CalendarClock, ReceiptText, UserPlus } from 'lucide-react';
import { enrollmentsApi, academicsApi } from '@/lib/api';

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const [data, classesData] = await Promise.all([
        enrollmentsApi.getApplications(statusFilter !== 'ALL' ? statusFilter : undefined),
        academicsApi.listClasses().catch(() => ({ data: [] }))
      ]);
      setApplications(data);
      setClasses(classesData.data || classesData || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load applications');
    } finally {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApplications();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string, notes?: string) => {
    try {
      await enrollmentsApi.reviewApplication(id, status, notes);
      toast.success(`Application marked as ${status.replace(/_/g, ' ')}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchApplications();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update application');
    }
  };

  const handleRejectClick = (id: string) => {
    setSelectedAppId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedAppId) return;
    await updateStatus(selectedAppId, 'REJECTED', rejectReason);
    setRejectModalOpen(false);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Admissions Review</h2>
          <p className="text-sm text-body-secondary mt-1">Manage school admission applications and enrollment workflow.</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col xl:flex-row gap-4 justify-between items-center bg-surface overflow-x-auto">
          <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
            <div className="flex space-x-1 bg-surface-container-low p-1 rounded-lg shrink-0">
              {['ALL', 'PENDING', 'TEST_SCHEDULED', 'APPROVED_WAITING_FEE', 'ENROLLED', 'REJECTED'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${statusFilter === status ? 'bg-surface shadow-sm text-primary' : 'text-body-secondary hover:text-primary'}`}
                >
                  {status === 'ALL' ? 'All' : status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full xl:w-64 relative shrink-0">
            <Search className="w-4 h-4 text-body-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search applicants..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-body-secondary">Loading applications...</div>
          ) : error ? (
            <div className="p-8 text-center text-error">{error}</div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-body-secondary">No applications found.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                  <th className="py-4 px-6 font-semibold">Student & Guardian</th>
                  <th className="py-4 px-6 font-semibold">Contact Info</th>
                  <th className="py-4 px-6 font-semibold">Desired Class</th>
                  <th className="py-4 px-6 font-semibold">Applied Date</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {applications
                  .filter(app => {
                    if (!searchQuery) return true;
                    const searchString = `${app.studentFirstName} ${app.studentLastName} ${app.fatherName} ${app.fatherCnic}`.toLowerCase();
                    return searchString.includes(searchQuery.toLowerCase());
                  })
                  .map((app, i) => (
                  <tr key={app.id || i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface">{app.studentFirstName} {app.studentLastName}</div>
                      <div className="text-xs text-body-secondary">D/O, S/O: {app.fatherName}</div>
                      <div className="text-xs text-body-secondary mt-1 tracking-widest text-primary/70">{app.fatherCnic}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-body-secondary font-medium">{app.phone}</div>
                      {app.email && <div className="text-xs text-body-secondary">{app.email}</div>}
                    </td>
                    <td className="py-4 px-6 text-on-surface">
                      <div className="font-medium">{classes.find(c => c.id === app.desiredClassId)?.name || 'Class Not Found'}</div>
                      {app.previousSchool && <div className="text-xs text-body-secondary mt-1">Prev: {app.previousSchool}</div>}
                    </td>
                    <td className="py-4 px-6 text-body-secondary">{new Date(app.createdAt || '2024-01-01').toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      {app.status === 'ENROLLED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">Enrolled</span>}
                      {app.status === 'APPROVED_WAITING_FEE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">Fee Pending</span>}
                      {app.status === 'TEST_SCHEDULED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-info-bg text-info border border-info/20">Test Scheduled</span>}
                      {app.status === 'PENDING' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-bg text-warning border border-warning/20">Pending</span>}
                      {app.status === 'REJECTED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20">Rejected</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.status === 'PENDING' && (
                          <button onClick={() => updateStatus(app.id, 'TEST_SCHEDULED')} className="p-1.5 bg-info-bg text-info hover:bg-info hover:text-white rounded transition-colors" title="Schedule Test">
                            <CalendarClock className="w-4 h-4" />
                          </button>
                        )}
                        {app.status === 'TEST_SCHEDULED' && (
                          <button onClick={() => updateStatus(app.id, 'APPROVED_WAITING_FEE')} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded transition-colors" title="Issue Fee Voucher">
                            <ReceiptText className="w-4 h-4" />
                          </button>
                        )}
                        {app.status === 'APPROVED_WAITING_FEE' && (
                          <button onClick={() => {
                            if(confirm('This will provision a student account and enroll them. Confirm?')) {
                              updateStatus(app.id, 'ENROLLED');
                            }
                          }} className="p-1.5 bg-success-bg text-success hover:bg-success hover:text-white rounded transition-colors" title="Mark Paid & Enroll">
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}
                        {['PENDING', 'TEST_SCHEDULED'].includes(app.status) && (
                          <button onClick={() => handleRejectClick(app.id)} className="p-1.5 bg-error-bg text-error hover:bg-error hover:text-white rounded transition-colors" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-heading-on-light mb-4">Reject Application</h3>
            <p className="text-sm text-body-secondary mb-4">Please provide a reason for rejecting this application.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-border-light rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[100px] mb-4"
              placeholder="Reason for rejection..."
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container"
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error/90"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
