"use client";
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Search, Plus, DollarSign, AlertCircle, TrendingUp, MoreVertical, Edit, Trash2, CreditCard } from 'lucide-react';
import { feesApi, usersApi, coursesApi } from '@/lib/api';

export default function FeesManagement() {
  const [fees, setFees] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Create / Edit Fee Form State
  const [formData, setFormData] = useState({
    id: '',
    studentId: '',
    courseId: '',
    amount: '',
    description: '',
    dueDate: '',
    status: 'PENDING'
  });

  // Pay Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState('');
  const [payAmount, setPayAmount] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feesData, usersData, coursesData] = await Promise.all([
        feesApi.list(),
        usersApi.list('STUDENT'),
        coursesApi.list()
      ]);
      setFees(feesData.data || feesData || []);
      setStudents(usersData.data || usersData || []);
      setCourses(coursesData.data || coursesData || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load fees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as Element).closest('.actions-dropdown')) return;
      setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleOpenModal = (fee?: any) => {
    if (fee) {
      setIsEditMode(true);
      setFormData({
        id: fee.id,
        studentId: fee.studentId || '',
        courseId: fee.courseId || '',
        amount: fee.amount || '',
        description: fee.description || '',
        dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '',
        status: fee.status || 'PENDING'
      });
    } else {
      setIsEditMode(false);
      setFormData({
        id: '',
        studentId: '',
        courseId: '',
        amount: '',
        description: '',
        dueDate: '',
        status: 'PENDING'
      });
    }
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        studentId: formData.studentId,
        courseId: formData.courseId || null,
        amount: Number(formData.amount),
        description: formData.description,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        status: formData.status
      };

      if (isEditMode) {
        await feesApi.update(formData.id, payload);
        toast.success('Fee record updated');
      } else {
        await feesApi.create(payload);
        toast.success('New fee created');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save fee record');
    }
  };

  const handlePayClick = (fee: any) => {
    setSelectedFeeId(fee.id);
    const amt = Number(fee.amount) - (Number(fee.paidAmount) || 0);
    setPayAmount(amt > 0 ? amt.toString() : '0');
    setPayModalOpen(true);
    setOpenDropdown(null);
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeId || !payAmount) return;
    try {
      await feesApi.pay(selectedFeeId, Number(payAmount));
      setPayModalOpen(false);
      toast.success('Payment recorded successfully');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to process payment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this fee record?')) return;
    try {
      await feesApi.remove(id);
      toast.success('Fee record deleted completely');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete fee record');
    }
    setOpenDropdown(null);
  };

  const filteredFees = fees.filter(f => statusFilter === 'ALL' || f.status === statusFilter);
  const totalCollected = fees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0);
  const totalOutstanding = fees.reduce((acc, f) => acc + (f.status !== 'PAID' ? (Number(f.amount) - (Number(f.paidAmount) || 0)) : 0), 0);
  const overdueCount = fees.filter(f => f.status === 'OVERDUE').length;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Fee Management</h2>
          <p className="text-sm text-body-secondary mt-1">Track and manage student payments and outstanding balances.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 primary-gradient text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
        >
          <Plus className="h-4 w-4" />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-divider brand-shadow flex items-start gap-4">
          <div className="p-3 bg-primary-container/20 text-primary-fixed rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-body-secondary">Total Collected</p>
            <h3 className="text-2xl font-bold text-on-surface mt-1">${totalCollected.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-divider brand-shadow flex items-start gap-4">
          <div className="p-3 bg-warning-bg text-warning rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-body-secondary">Total Outstanding</p>
            <h3 className="text-2xl font-bold text-on-surface mt-1">${totalOutstanding.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-divider brand-shadow flex items-start gap-4">
          <div className="p-3 bg-error-bg text-error rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-body-secondary">Overdue Accounts</p>
            <h3 className="text-2xl font-bold text-on-surface mt-1">{overdueCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex space-x-1 bg-surface-container-low p-1 rounded-lg">
              {['ALL', 'PENDING', 'PAID', 'OVERDUE'].map(status => (
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
            <div className="p-8 text-center text-body-secondary">Loading fees...</div>
          ) : error ? (
            <div className="p-8 text-center text-error">{error}</div>
          ) : filteredFees.length === 0 ? (
            <div className="p-8 text-center text-body-secondary">No fee records found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                  <th className="py-4 px-6 font-semibold">Student / Course</th>
                  <th className="py-4 px-6 font-semibold">Description</th>
                  <th className="py-4 px-6 font-semibold">Amount</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Due Date</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredFees.map((fee, i) => (
                  <tr key={fee.id || i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors relative">
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface">{fee.student?.firstName} {fee.student?.lastName}</div>
                      {fee.course && <div className="text-xs text-body-secondary">{fee.course?.title}</div>}
                    </td>
                    <td className="py-4 px-6 text-on-surface">{fee.description || 'General Fee'}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-on-surface">${Number(fee.amount).toFixed(2)}</div>
                      {fee.paidAmount > 0 && <div className="text-xs text-success">Paid: ${Number(fee.paidAmount).toFixed(2)}</div>}
                    </td>
                    <td className="py-4 px-6">
                      {fee.status === 'PAID' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">Paid</span>}
                      {fee.status === 'PENDING' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-bg text-warning border border-warning/20">Pending</span>}
                      {fee.status === 'OVERDUE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20">Overdue</span>}
                      {fee.status === 'REFUNDED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-surface-container-high text-body-secondary border border-border-light">Refunded</span>}
                    </td>
                    <td className="py-4 px-6 text-body-secondary">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-4 px-6 text-right relative actions-dropdown">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === fee.id ? null : fee.id)}
                        className="text-icon-inactive hover:text-primary transition-colors p-1.5 rounded-md hover:bg-surface-container"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {openDropdown === fee.id && (
                        <div className="absolute right-6 top-10 w-48 bg-white rounded-lg shadow-xl border border-divider py-1 z-50 animate-in fade-in zoom-in duration-200">
                          {fee.status !== 'PAID' && (
                            <button 
                              onClick={() => handlePayClick(fee)}
                              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary-container/20 flex items-center gap-2 font-medium"
                            >
                              <CreditCard className="w-4 h-4" /> Record Payment
                            </button>
                          )}
                          <button 
                            onClick={() => handleOpenModal(fee)}
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4 text-icon-inactive" /> Edit Record
                          </button>
                          <hr className="my-1 border-divider" />
                          <button 
                            onClick={() => handleDelete(fee.id)}
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
          )}
        </div>
      </div>

      {/* Create / Edit Fee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light">
                {isEditMode ? 'Edit Fee Record' : 'Create New Invoice'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Select Student</label>
                <select 
                  required
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                >
                  <option value="">-- Choose a Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Related Course (Optional)</label>
                <select 
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                >
                  <option value="">-- None --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Amount ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Due Date</label>
                  <input 
                    type="date"
                    required
                    className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
                <input 
                  type="text"
                  placeholder="e.g. Tuition Fee - Fall Semester"
                  required
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Status</label>
                  <select 
                    className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="OVERDUE">OVERDUE</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-divider">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
                >
                  {isEditMode ? 'Save Changes' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-heading-on-light mb-4">Record Payment</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Payment Amount ($)</label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setPayModalOpen(false)}
                className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container"
              >
                Cancel
              </button>
              <button 
                onClick={handlePaySubmit}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" /> Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
