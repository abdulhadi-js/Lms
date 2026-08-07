"use client";
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Search, Plus, AlertCircle, TrendingUp, MoreVertical, Edit, Trash2, CreditCard } from 'lucide-react';
import { feesApi, usersApi, coursesApi } from '@/lib/api';

export default function FeesManagement() {
  const [fees, setFees] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [auditReasonModalOpen, setAuditReasonModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{type: 'delete' | 'update', id?: string, payload?: any} | null>(null);
  const [auditReason, setAuditReason] = useState('');
  
  // Create / Edit Fee Form State
  const [formData, setFormData] = useState({
    id: '',
    studentId: '',
    courseId: '',
    amount: '',
    description: '',
    dueDate: '',
    status: 'PENDING',
    discount: '0'
  });

  const [bulkFormData, setBulkFormData] = useState({
    courseId: '',
    amount: '',
    dueDate: '',
    title: 'TUITION'
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
        status: 'PENDING',
        discount: '0',
        feeType: 'TUITION'
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
        status: 'PENDING',
        discount: '0',
        feeType: 'TUITION'
      });
    }
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      studentId: formData.studentId,
      amount: Number(formData.amount),
      description: formData.description,
      status: formData.status,
      discount: Number(formData.discount),
      feeType: formData.feeType
    };
    if (formData.courseId) payload.courseId = formData.courseId;
    if (formData.dueDate) payload.dueDate = new Date(formData.dueDate).toISOString();

    if (isEditMode) {
      if (payload.discount > 0) {
        setPendingAction({ type: 'update', id: formData.id, payload });
        setIsModalOpen(false);
        setAuditReasonModalOpen(true);
        return;
      }
      try {
        await feesApi.update(formData.id, payload);
        toast.success('Fee record updated');
        setIsModalOpen(false);
        fetchData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to save fee record');
      }
    } else {
      try {
        await feesApi.create(payload);
        toast.success('New fee created');
        setIsModalOpen(false);
        fetchData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to create fee');
      }
    }
  };

  const handleAuditSubmit = async () => {
    if (!auditReason) return toast.error('Audit Reason is required');
    try {
      if (pendingAction?.type === 'update' && pendingAction.id) {
        await feesApi.update(pendingAction.id, { ...pendingAction.payload, reason: auditReason });
        toast.success('Fee record updated successfully');
      } else if (pendingAction?.type === 'delete' && pendingAction.id) {
        await feesApi.remove(pendingAction.id, auditReason);
        toast.success('Fee record deleted completely');
      }
      setAuditReasonModalOpen(false);
      setPendingAction(null);
      setAuditReason('');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await feesApi.bulkGenerate({
        courseId: bulkFormData.courseId,
        amount: Number(bulkFormData.amount),
        dueDate: new Date(bulkFormData.dueDate).toISOString(),
        title: bulkFormData.title,
        feeType: bulkFormData.title
      });
      toast.success('Bulk fees generated successfully!');
      setBulkModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate bulk fees');
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

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this fee record? This will be logged.')) return;
    setPendingAction({ type: 'delete', id });
    setAuditReasonModalOpen(true);
    setOpenDropdown(null);
  };

  const filteredFees = fees.filter(f => {
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    const searchString = `${f.student?.firstName} ${f.student?.lastName}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const totalCollected = fees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0);
  const totalOutstanding = fees.reduce((acc, f) => acc + (f.status !== 'PAID' ? (Number(f.amount) - (Number(f.paidAmount) || 0)) : 0), 0);
  const overdueCount = fees.filter(f => f.status === 'OVERDUE').length;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Fee Management</h2>
          <p className="text-sm text-body-secondary mt-1">Manage student fee challans, monthly tuition, and outstanding balances.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setBulkModalOpen(true)}
            className="flex items-center gap-2 bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors"
          >
            Bulk Generate
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 primary-gradient text-white px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
          >
            <Plus className="h-4 w-4" />
            Create Fee Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-surface p-5 rounded-xl border border-divider brand-shadow flex items-start gap-4">
          <div className="p-3 bg-primary-container/20 text-primary-fixed rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-body-secondary">Total Collected</p>
            <h3 className="text-2xl font-bold text-on-surface mt-1">Rs. {totalCollected.toLocaleString('en-PK')}</h3>
          </div>
        </div>
        <div className="bg-surface p-5 rounded-xl border border-divider brand-shadow flex items-start gap-4">
          <div className="p-3 bg-warning-bg text-warning rounded-lg">
            <span className="text-xs font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">Rs</span>
          </div>
          <div>
            <p className="text-sm font-medium text-body-secondary">Total Outstanding</p>
            <h3 className="text-2xl font-bold text-on-surface mt-1">Rs. {totalOutstanding.toLocaleString('en-PK')}</h3>
          </div>
        </div>
        <div className="bg-surface p-5 rounded-xl border border-divider brand-shadow flex items-start gap-4">
          <div className="p-3 bg-error-bg text-error rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-body-secondary">Overdue Accounts</p>
            <h3 className="text-2xl font-bold text-on-surface mt-1">{overdueCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex space-x-1 bg-surface-container-low p-1 rounded-lg">
              {['ALL', 'PENDING', 'PAID', 'OVERDUE'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${statusFilter === status ? 'bg-surface shadow-sm text-primary' : 'text-body-secondary hover:text-primary'}`}
                >
                  {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full md:w-64 relative">
            <Search className="w-4 h-4 text-body-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by student name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-body-secondary">Loading fees...</div>
          ) : error ? (
            <div className="p-8 text-center text-error">{error}</div>
          ) : filteredFees.length === 0 ? (
            <div className="p-8 text-center text-body-secondary">No fee records found.</div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredFees.map((fee, i) => (
                  <div key={fee.id || i} className="bg-surface p-4 rounded-xl border border-divider shadow-sm relative">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-on-surface">{fee.student?.firstName} {fee.student?.lastName}</div>
                        {fee.course && <div className="text-xs text-body-secondary">{fee.course?.title}</div>}
                        {fee.feeType && (
                          <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            fee.feeType === 'TUITION' ? 'bg-success/10 text-success' :
                            fee.feeType === 'EXAM' ? 'bg-purple-500/10 text-purple-600' :
                            fee.feeType === 'TRANSPORT' ? 'bg-blue-500/10 text-blue-600' :
                            'bg-gray-500/10 text-gray-600'
                          }`}>
                            {fee.feeType}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === fee.id ? null : fee.id)}
                        className="text-icon-inactive hover:text-primary p-1 rounded-md"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {openDropdown === fee.id && (
                        <div className="absolute right-4 top-12 w-48 bg-surface rounded-lg shadow-xl border border-divider py-1 z-50">
                          {fee.status !== 'PAID' && (
                            <button 
                              onClick={() => { handlePayClick(fee); setOpenDropdown(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary-container/20 flex items-center gap-2 font-medium"
                            >
                              <CreditCard className="w-4 h-4" /> Record Payment
                            </button>
                          )}
                          {fee.status === 'PAID' && (
                            <button 
                              onClick={() => { window.print(); setOpenDropdown(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary-container/20 flex items-center gap-2 font-medium"
                            >
                              <CreditCard className="w-4 h-4" /> Print Receipt
                            </button>
                          )}
                          {fee.status !== 'PAID' && (
                            <button 
                              onClick={() => { toast.success('Installments config loaded'); setOpenDropdown(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                            >
                              <span className="text-xs font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">Rs</span> Setup Installments
                            </button>
                          )}
                          <button 
                            onClick={() => { handleOpenModal(fee); setOpenDropdown(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4 text-icon-inactive" /> Edit Fee
                          </button>
                          <hr className="my-1 border-divider" />
                          <button 
                            onClick={() => { handleDelete(fee.id); setOpenDropdown(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-bg flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Record
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-body-secondary">Description:</div>
                      <div className="text-right truncate">{fee.description || 'General Fee'}</div>

                      <div className="text-body-secondary">Amount:</div>
                      <div className="text-right">
                        <div className="font-bold text-on-surface">Rs. {Number(fee.amount).toLocaleString('en-PK')}</div>
                        {fee.paidAmount > 0 && <div className="text-xs text-success">Paid: Rs. {Number(fee.paidAmount).toLocaleString('en-PK')}</div>}
                      </div>
                      
                      <div className="text-body-secondary">Status:</div>
                      <div className="flex justify-end">
                        {fee.status === 'PAID' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">Paid</span>}
                        {fee.status === 'PENDING' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-bg text-warning border border-warning/20">Pending</span>}
                        {fee.status === 'OVERDUE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20">Overdue</span>}
                        {fee.status === 'REFUNDED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-surface-container-high text-body-secondary border border-border-light">Refunded</span>}
                      </div>
                      
                      <div className="text-body-secondary">Due Date:</div>
                      <div className="text-right">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <table className="hidden md:table w-full text-left border-collapse">
              <thead>
                <tr className="text-body-secondary text-[11px] uppercase tracking-wider border-b border-divider">
                  <th className="py-3 px-4 font-semibold">Student / Class</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredFees.map((fee, i) => (
                  <tr key={fee.id || i} className="border-b border-border-light  hover:bg-surface transition-colors relative">
                    <td className="py-3 px-4">
                      <div className="font-medium text-on-surface">{fee.student?.firstName} {fee.student?.lastName}</div>
                      {fee.course && <div className="text-xs text-body-secondary">{fee.course?.title}</div>}
                      {fee.feeType && (
                        <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          fee.feeType === 'TUITION' ? 'bg-success/10 text-success' :
                          fee.feeType === 'EXAM' ? 'bg-purple-500/10 text-purple-600' :
                          fee.feeType === 'TRANSPORT' ? 'bg-blue-500/10 text-blue-600' :
                          'bg-gray-500/10 text-gray-600'
                        }`}>
                          {fee.feeType}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-on-surface">{fee.description || 'General Fee'}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface">Rs. {Number(fee.amount).toLocaleString('en-PK')}</div>
                      {fee.paidAmount > 0 && <div className="text-xs text-success">Paid: Rs. {Number(fee.paidAmount).toLocaleString('en-PK')}</div>}
                    </td>
                    <td className="py-3 px-4">
                      {fee.status === 'PAID' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">Paid</span>}
                      {fee.status === 'PENDING' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-bg text-warning border border-warning/20">Pending</span>}
                      {fee.status === 'OVERDUE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20">Overdue</span>}
                      {fee.status === 'REFUNDED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-surface-container-high text-body-secondary border border-border-light">Refunded</span>}
                    </td>
                    <td className="py-3 px-4 text-body-secondary">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-3 px-4 text-right relative actions-dropdown">
                      <button
                        onClick={(e) => {
                          if (openDropdown === fee.id) {
                            setOpenDropdown(null);
                            setDropdownPos(null);
                          } else {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            // B14 FIX: fixed positioning so dropdown escapes overflow-x-auto clipping
                            setDropdownPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                            setOpenDropdown(fee.id);
                          }
                        }}
                        className="text-icon-inactive hover:text-primary transition-colors p-1.5 rounded-md hover:bg-surface-container"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {openDropdown === fee.id && dropdownPos && (
                        <div
                          style={{ position: 'fixed', top: dropdownPos.top, right: dropdownPos.right }}
                          className="w-48 bg-surface rounded-lg shadow-xl border border-divider py-1 z-[9999]"
                        >
                          {fee.status !== 'PAID' && (
                            <button
                              onClick={() => handlePayClick(fee)}
                              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary-container/20 flex items-center gap-2 font-medium"
                            >
                              <CreditCard className="w-4 h-4" /> Record Payment
                            </button>
                          )}
                          {fee.status === 'PAID' && (
                            <button
                              onClick={() => { window.print(); setOpenDropdown(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary-container/20 flex items-center gap-2 font-medium"
                            >
                              <CreditCard className="w-4 h-4" /> Print Receipt
                            </button>
                          )}
                          {fee.status !== 'PAID' && (
                            <button
                              onClick={() => { toast.success('Installments config loaded'); setOpenDropdown(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                            >
                              <span className="text-xs font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">Rs</span> Setup Installments
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
            </>
          )}
        </div>
      </div>

      {/* Create / Edit Fee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light">
                {isEditMode ? 'Edit Fee Record' : 'Create New Invoice'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Select Student</label>
                <input 
                  type="text" 
                  placeholder="Filter students..." 
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full mb-2 border border-border-light rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <select 
                  required
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                >
                  <option value="">-- Choose a Student --</option>
                  {students.filter(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(studentSearch.toLowerCase())).map(s => (
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
                  <label className="block text-sm font-medium text-on-surface mb-1">Fee Type</label>
                  <select 
                    required
                    className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.feeType}
                    onChange={(e) => setFormData({...formData, feeType: e.target.value})}
                  >
                    <option value="TUITION">TUITION — Monthly Tuition Fee</option>
                    <option value="ADMISSION">ADMISSION — Admission Fee</option>
                    <option value="EXAM">EXAM — Exam / Board Fee</option>
                    <option value="TRANSPORT">TRANSPORT — Transport Fee</option>
                    <option value="SPORTS">SPORTS — Sports Fund</option>
                    <option value="LAB">LAB — Lab Charges</option>
                    <option value="LIBRARY">LIBRARY — Library Fee</option>
                    <option value="OTHER">OTHER — Other Charges</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Amount (Rs.)</label>
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
                  <label className="block text-sm font-medium text-on-surface mb-1">Discount (Rs.)</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  />
                </div>
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
          <div className="bg-surface rounded-xl shadow-xl p-5 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-heading-on-light mb-4">Record Payment</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Payment Amount (Rs.)</label>
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

      {/* Bulk Generate Modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light">Bulk Generate Fees</h3>
              <button onClick={() => setBulkModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors">
                &times;
              </button>
            </div>
            <form onSubmit={handleBulkSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Target Course</label>
                <select 
                  required
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={bulkFormData.courseId}
                  onChange={(e) => setBulkFormData({...bulkFormData, courseId: e.target.value})}
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Base Amount (Rs.)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={bulkFormData.amount}
                    onChange={(e) => setBulkFormData({...bulkFormData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Due Date</label>
                  <input 
                    type="date"
                    required
                    className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={bulkFormData.dueDate}
                    onChange={(e) => setBulkFormData({...bulkFormData, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Fee Type</label>
                <select 
                  required
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={bulkFormData.title}
                  onChange={(e) => setBulkFormData({...bulkFormData, title: e.target.value})}
                >
                  <option value="TUITION">TUITION — Monthly Tuition Fee</option>
                  <option value="ADMISSION">ADMISSION — Admission Fee</option>
                  <option value="EXAM">EXAM — Exam / Board Fee</option>
                  <option value="TRANSPORT">TRANSPORT — Transport Fee</option>
                  <option value="SPORTS">SPORTS — Sports Fund</option>
                  <option value="LAB">LAB — Lab Charges</option>
                  <option value="LIBRARY">LIBRARY — Library Fee</option>
                  <option value="OTHER">OTHER — Other Charges</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-divider">
                <button type="button" onClick={() => setBulkModalOpen(false)} className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">Generate Monthly Challan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {auditReasonModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-xl shadow-2xl p-5 w-full max-w-sm animate-in zoom-in-95 duration-200 border-2 border-error/50">
            <h3 className="text-xl font-bold text-heading-on-light mb-2 text-error flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Requires Audit Log
            </h3>
            <p className="text-sm text-body-secondary mb-4">
              You are performing an action (Discount or Deletion) that requires an official explanation for accounting purposes.
            </p>
            <textarea
              className="w-full border border-border-light rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-error resize-none h-24 mb-4 bg-error-bg/10 text-on-surface"
              placeholder="State your reason clearly..."
              value={auditReason}
              onChange={(e) => setAuditReason(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setAuditReasonModalOpen(false); setPendingAction(null); }} className="px-4 py-2 text-sm text-body-secondary font-semibold hover:bg-surface-container rounded-lg">Cancel</button>
              <button onClick={handleAuditSubmit} className="px-4 py-2 text-sm bg-error text-white font-semibold rounded-lg hover:bg-error/90">Confirm Action</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
