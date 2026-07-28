"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { feesApi } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  code: string;
}

interface Fee {
  id: string;
  amount: number;
  paidAmount: number;
  description: string;
  dueDate: string;
  status: string;
  paidAt: string | null;
  course: Course | null;
}

export default function MyFees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Payment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const data = await feesApi.list();
      setFees(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load fees data');
    } finally {
      setLoading(false);
    }
  };

  const handlePayClick = (fee: Fee) => {
    const outstanding = Number(fee.amount) - (Number(fee.paidAmount) || 0);
    setSelectedFee(fee);
    setPaymentAmount(outstanding.toString());
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedFee) return;

    // B9 FIX: JS-level guard — HTML max attr alone is not enough
    const outstanding = Number(selectedFee.amount) - (Number(selectedFee.paidAmount) || 0);
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid payment amount.');
      return;
    }
    if (amount > outstanding) {
      toast.error(`Amount cannot exceed the outstanding balance of PKR ${outstanding.toLocaleString()}.`);
      return;
    }

    try {
      setProcessing(true);
      await feesApi.pay(selectedFee.id, amount);
      setIsModalOpen(false);
      // B8 FIX: replace alert() with toast
      toast.success(`Payment of PKR ${amount.toLocaleString()} processed successfully!`);
      await fetchFees();
    } catch (err: any) {
      toast.error(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-8 px-4 md:px-8 space-y-8 max-w-[1280px] mx-auto w-full pb-24 animate-pulse">
        <div className="h-10 bg-surface-container-high rounded w-64 mb-8"></div>
        <div className="h-64 bg-surface-container-high rounded-xl w-full mb-8"></div>
        <div className="h-64 bg-surface-container-high rounded-xl w-full mb-8"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-error text-center mt-10 bg-error-bg rounded-lg max-w-lg mx-auto">Error: {error}</div>;
  }

  // Calculate totals
  let totalAmount = 0;
  let totalPaid = 0;
  
  fees.forEach(fee => {
    totalAmount += Number(fee.amount);
    totalPaid += Number(fee.paidAmount) || 0;
  });
  
  const totalOutstanding = totalAmount - totalPaid;
  const paidPercentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 100;
  
  // Find closest due date for outstanding fees
  const outstandingFees = fees.filter(f => (Number(f.amount) - (Number(f.paidAmount) || 0)) > 0);
  const nextDueDate = outstandingFees.length > 0 
    ? new Date(Math.min(...outstandingFees.map(f => new Date(f.dueDate).getTime())))
    : null;

  return (
    <div className="pt-8 px-4 md:px-8 space-y-8 max-w-[1280px] mx-auto w-full pb-24">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-[28px] font-bold text-evergreen">My Fees & Payments</h1>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Fee Status Overview Card (Full Width in grid) */}
        <div className="lg:col-span-12 bg-surface rounded-xl border border-border-light shadow-[0_4px_12px_rgba(19,42,19,0.08)] overflow-hidden relative">
          <div className="h-1 w-full bg-gradient-to-r from-success to-primary-container absolute top-0 left-0"></div>
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
            {/* Left Section (40%) */}
            <div className="w-full md:w-[40%] flex flex-col space-y-4">
              <div>
                <span className="text-[12px] font-medium text-body-secondary uppercase tracking-wider block mb-1">Current Balance</span>
                <div className="text-[48px] font-bold flex items-baseline gap-2 text-error">
                  <span className="text-2xl font-semibold">PKR</span> {totalOutstanding.toLocaleString()}
                </div>
              </div>
              {nextDueDate && (
                <div className="flex items-center text-warning text-[12px] font-medium gap-2 bg-warning-bg px-3 py-1.5 rounded w-max">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                  Due Date: {nextDueDate.toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Right Section (60%) */}
            <div className="w-full md:w-[60%] flex flex-col sm:flex-row items-center justify-center gap-8 md:border-l border-divider md:pl-8">
              <div className="relative flex justify-center items-center">
                <div 
                  className="w-[150px] h-[150px] rounded-full shadow-inner" 
                  style={{ background: `conic-gradient(#31572c 0% ${paidPercentage}%, #f5e2e0 ${paidPercentage}% 100%)` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-surface w-24 h-24 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-[20px] text-primary font-bold">{paidPercentage}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 w-full max-w-[200px]">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded bg-primary-container mt-1 shrink-0"></div>
                  <div>
                    <div className="text-[12px] font-medium text-body-secondary">Paid Amount</div>
                    <div className="text-[16px] font-semibold text-success">PKR {totalPaid.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded bg-error-bg mt-1 shrink-0 border border-error/20"></div>
                  <div>
                    <div className="text-[12px] font-medium text-body-secondary">Outstanding</div>
                    <div className="text-[16px] font-semibold text-error">PKR {totalOutstanding.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Breakdown Table */}
        <div className="lg:col-span-12 bg-surface rounded-xl border border-border-light shadow-[0_4px_12px_rgba(19,42,19,0.08)] overflow-hidden relative">
          <div className="h-1 w-full bg-gradient-to-r from-success to-primary-container absolute top-0 left-0"></div>
          <div className="p-6">
            <h2 className="text-[16px] font-bold text-evergreen mb-4">Fee Structure Details</h2>
            <div className="overflow-x-auto rounded-lg border border-divider">
              
              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-border-light bg-surface">
                {fees.length > 0 ? fees.map(fee => {
                  const isPaid = fee.status === 'PAID';
                  const outstanding = Number(fee.amount) - (Number(fee.paidAmount) || 0);
                  return (
                    <div key={fee.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-on-surface">{fee.description || 'General Fee'}</div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isPaid ? 'bg-success-bg text-success border-success/20' : 'bg-error-bg text-error border-error/20'}`}>
                          {fee.status}
                        </span>
                      </div>
                      
                      {fee.course && <div className="text-sm text-body-secondary mb-3">{fee.course.code} - {fee.course.title}</div>}
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div className="text-body-secondary">Amount:</div>
                        <div className="text-right font-medium">PKR {Number(fee.amount).toLocaleString()}</div>
                        
                        <div className="text-body-secondary">Paid:</div>
                        <div className="text-right">PKR {(Number(fee.paidAmount) || 0).toLocaleString()}</div>
                        
                        <div className="text-body-secondary">Due Date:</div>
                        <div className="text-right">{new Date(fee.dueDate).toLocaleDateString()}</div>
                      </div>
                      
                      {!isPaid && (
                        <div className="pt-2">
                          <button 
                            onClick={() => handlePayClick(fee)}
                            className="w-full text-sm bg-primary-container text-on-primary px-3 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
                          >
                            Pay Outstanding: PKR {outstanding.toLocaleString()}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }) : (
                  <div className="p-8 text-center text-body-secondary italic">No fee records found.</div>
                )}
                
                {fees.length > 0 && (
                  <div className="p-4 bg-lime-cream font-bold text-evergreen">
                    <div className="flex justify-between mb-1">
                      <span>Total Fees:</span>
                      <span>PKR {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Total Paid:</span>
                      <span>PKR {totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-primary-container/30 pt-1 mt-1">
                      <span>Total Outstanding:</span>
                      <span className="text-error">PKR {totalOutstanding.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <table className="hidden md:table w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary-container text-on-primary">
                    <th className="p-4 text-[12px] uppercase tracking-wider font-semibold">Description</th>
                    <th className="p-4 text-[12px] uppercase tracking-wider font-semibold">Course</th>
                    <th className="p-4 text-[12px] uppercase tracking-wider font-semibold">Due Date</th>
                    <th className="p-4 text-[12px] uppercase tracking-wider font-semibold">Amount</th>
                    <th className="p-4 text-[12px] uppercase tracking-wider font-semibold">Paid</th>
                    <th className="p-4 text-[12px] uppercase tracking-wider font-semibold">Status</th>
                    <th className="p-4 text-[12px] uppercase tracking-wider font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider text-[14px]">
                  {fees.length > 0 ? fees.map(fee => {
                    const isPaid = fee.status === 'PAID';
                    const outstanding = Number(fee.amount) - (Number(fee.paidAmount) || 0);
                    return (
                      <tr key={fee.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-4 font-medium text-on-surface">{fee.description || 'General Fee'}</td>
                        <td className="p-4 text-on-surface-variant">{fee.course ? `${fee.course.code} - ${fee.course.title}` : 'N/A'}</td>
                        <td className="p-4 text-on-surface-variant">{new Date(fee.dueDate).toLocaleDateString()}</td>
                        <td className="p-4 text-on-surface-variant">PKR {Number(fee.amount).toLocaleString()}</td>
                        <td className="p-4 text-on-surface-variant">PKR {(Number(fee.paidAmount) || 0).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isPaid ? 'bg-success-bg text-success border-success/20' : 'bg-error-bg text-error border-error/20'}`}>
                            {fee.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {!isPaid && (
                            <button 
                              onClick={() => handlePayClick(fee)}
                              className="text-xs bg-primary-container text-on-primary px-3 py-1.5 rounded font-medium hover:opacity-90 transition-opacity"
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-body-secondary italic">No fee records found.</td>
                    </tr>
                  )}
                  {fees.length > 0 && (
                    <tr className="bg-lime-cream font-bold text-evergreen">
                      <td colSpan={3} className="p-4">Total</td>
                      <td className="p-4">PKR {totalAmount.toLocaleString()}</td>
                      <td className="p-4">PKR {totalPaid.toLocaleString()}</td>
                      <td colSpan={2} className="p-4">PKR {totalOutstanding.toLocaleString()} Outstanding</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && selectedFee && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-xl shadow-2xl max-w-md w-full p-6 border border-divider">
            <h2 className="text-2xl font-bold text-evergreen mb-2">Make Payment</h2>
            <p className="text-body-secondary text-sm mb-6">Payment for: {selectedFee.description}</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Total Fee Amount</label>
                <div className="text-lg text-on-surface">PKR {Number(selectedFee.amount).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Already Paid</label>
                <div className="text-lg text-success">PKR {(Number(selectedFee.paidAmount) || 0).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Payment Amount (PKR)</label>
                <input 
                  type="number" 
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full border border-divider rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-container"
                  placeholder="Enter amount to pay"
                  max={Number(selectedFee.amount) - (Number(selectedFee.paidAmount) || 0)}
                />
              </div>
              <div className="bg-info-bg border border-info/20 p-3 rounded-lg flex items-start gap-2">
                <span className="material-symbols-outlined text-info text-sm mt-0.5">info</span>
                <span className="text-xs text-info">In a real application, this would redirect to a secure payment gateway (e.g. Stripe/JazzCash). For now, clicking submit will process the transaction directly.</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-divider rounded-lg font-medium hover:bg-surface-container-low transition-colors"
                disabled={processing}
              >
                Cancel
              </button>
              <button 
                onClick={handlePaymentSubmit}
                disabled={processing || !paymentAmount || Number(paymentAmount) <= 0}
                className="px-4 py-2 bg-primary-container text-on-primary rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {processing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
