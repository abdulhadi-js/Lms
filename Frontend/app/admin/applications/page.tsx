"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, Check, X, MoreVertical } from 'lucide-react';
import { enrollmentsApi } from '@/lib/api';

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await enrollmentsApi.getApplications(statusFilter !== 'ALL' ? statusFilter : undefined);
      setApplications(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this application?')) return;
    try {
      await enrollmentsApi.reviewApplication(id, 'APPROVED');
      fetchApplications();
    } catch (err: any) {
      alert(err.message || 'Failed to approve application');
    }
  };

  const handleRejectClick = (id: string) => {
    setSelectedAppId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedAppId) return;
    try {
      await enrollmentsApi.reviewApplication(selectedAppId, 'REJECTED', rejectReason);
      setRejectModalOpen(false);
      fetchApplications();
    } catch (err: any) {
      alert(err.message || 'Failed to reject application');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Application Review</h2>
          <p className="text-sm text-body-secondary mt-1">Review and manage student course applications.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex space-x-1 bg-surface-container-low p-1 rounded-lg">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${statusFilter === status ? 'bg-white shadow-sm text-primary' : 'text-body-secondary hover:text-primary'}`}
                >
                  {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-8 text-center text-body-secondary">Loading applications...</div>
          ) : error ? (
            <div className="p-8 text-center text-error">{error}</div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-body-secondary">No applications found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                  <th className="py-4 px-6 font-semibold">Applicant</th>
                  <th className="py-4 px-6 font-semibold">Contact Info</th>
                  <th className="py-4 px-6 font-semibold">Desired Course</th>
                  <th className="py-4 px-6 font-semibold">Applied Date</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {applications.map((app, i) => (
                  <tr key={app.id || i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface">{app.firstName} {app.lastName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-body-secondary">{app.email}</div>
                      <div className="text-xs text-body-secondary">{app.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-on-surface">{app.course?.title || app.courseId}</td>
                    <td className="py-4 px-6 text-body-secondary">{new Date(app.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      {app.status === 'APPROVED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">Approved</span>}
                      {app.status === 'PENDING' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-bg text-warning border border-warning/20">Pending</span>}
                      {app.status === 'REJECTED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20">Rejected</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {app.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleApprove(app.id)}
                            className="p-1.5 bg-success-bg text-success hover:bg-success hover:text-white rounded transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleRejectClick(app.id)}
                            className="p-1.5 bg-error-bg text-error hover:bg-error hover:text-white rounded transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
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
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
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
