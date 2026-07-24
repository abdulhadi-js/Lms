"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, DollarSign, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { feesApi } from '@/lib/api';

export default function FeesManagement() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [payAmount, setPayAmount] = useState<number | string>('');

  const fetchFees = async () => {
    setLoading(true);
    try {
      const data = await feesApi.list();
      setFees(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load fees');
    } finally {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFees();
  }, []);

  const handlePayClick = (fee: any) => {
    setSelectedFee(fee);
    setPayAmount(fee.amount - (fee.paidAmount || 0));
    setPayModalOpen(true);
  };

  const handlePaySubmit = async () => {
    if (!selectedFee || !payAmount) return;
    try {
      await feesApi.pay(selectedFee.id, Number(payAmount));
      setPayModalOpen(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchFees();
    } catch (err: any) {
      alert(err.message || 'Failed to process payment');
    }
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
            <select 
              className="bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
            </select>
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
                  <th className="py-4 px-6 font-semibold">Student</th>
                  <th className="py-4 px-6 font-semibold">Course</th>
                  <th className="py-4 px-6 font-semibold">Amount</th>
                  <th className="py-4 px-6 font-semibold">Paid Amount</th>
                  <th className="py-4 px-6 font-semibold">Due Date</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredFees.map((fee, i) => (
                  <tr key={fee.id || i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface">{fee.student?.firstName} {fee.student?.lastName}</div>
                    </td>
                    <td className="py-4 px-6 text-body-secondary">{fee.course?.title || 'General'}</td>
                    <td className="py-4 px-6 text-on-surface font-medium">${Number(fee.amount).toFixed(2)}</td>
                    <td className="py-4 px-6 text-body-secondary">${Number(fee.paidAmount || 0).toFixed(2)}</td>
                    <td className="py-4 px-6 text-body-secondary">{new Date(fee.dueDate).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      {fee.status === 'PAID' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">Paid</span>}
                      {fee.status === 'PENDING' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-bg text-warning border border-warning/20">Pending</span>}
                      {fee.status === 'OVERDUE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20">Overdue</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {fee.status !== 'PAID' && (
                        <button 
                          onClick={() => handlePayClick(fee)}
                          className="px-3 py-1.5 bg-primary-container text-white rounded-lg text-xs font-medium hover:bg-primary transition-colors"
                        >
                          Record Payment
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

      {payModalOpen && selectedFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-heading-on-light mb-4">Record Payment</h3>
            <p className="text-sm text-body-secondary mb-4">
              Recording payment for {selectedFee.student?.firstName} {selectedFee.student?.lastName}.
              Outstanding: ${(Number(selectedFee.amount) - Number(selectedFee.paidAmount || 0)).toFixed(2)}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-on-surface mb-1">Amount to Pay ($)</label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setPayModalOpen(false)}
                className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container"
              >
                Cancel
              </button>
              <button 
                onClick={handlePaySubmit}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
              >
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
