"use client";

import React, { useState } from 'react';

export default function MyFees() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                <div className="text-[48px] font-bold text-error flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">PKR</span> 15,000
                </div>
              </div>
              <div className="flex items-center text-warning text-[12px] font-medium gap-2 bg-warning-bg px-3 py-1.5 rounded w-max">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                Due Date: 31 July 2026
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-br from-[#132A13] to-[#31572c] text-white font-semibold rounded-lg py-3 px-6 w-full mt-4 hover:shadow-lg transition-shadow duration-200 flex justify-center items-center gap-2"
              >
                Pay Now
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
              </button>
            </div>

            {/* Right Section (60%) */}
            <div className="w-full md:w-[60%] flex flex-col sm:flex-row items-center justify-center gap-8 md:border-l border-divider md:pl-8">
              <div className="relative flex justify-center items-center">
                <div 
                  className="w-[150px] h-[150px] rounded-full shadow-inner" 
                  style={{ background: 'conic-gradient(#f5e2e0 0% 30%, #31572c 30% 100%)' }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-surface w-24 h-24 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-[20px] text-primary font-bold">70%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 w-full max-w-[200px]">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded bg-primary-container mt-1 shrink-0"></div>
                  <div>
                    <div className="text-[12px] font-medium text-body-secondary">Paid Amount</div>
                    <div className="text-[16px] font-semibold text-success">PKR 35,000</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded bg-error-bg mt-1 shrink-0 border border-error/20"></div>
                  <div>
                    <div className="text-[12px] font-medium text-body-secondary">Outstanding</div>
                    <div className="text-[16px] font-semibold text-error">PKR 15,000</div>
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
            <h2 className="text-[16px] font-bold text-evergreen mb-4">Current Semester Fee Structure</h2>
            <div className="overflow-x-auto rounded-lg border border-divider">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary-container text-on-primary">
                    <th className="p-4 text-[12px] uppercase tracking-wider font-semibold">Fee Component</th>
                    <th className="p-4 text-[12px] uppercase tracking-wider font-semibold">Amount</th>
                    <th className="p-4 text-[12px] uppercase tracking-wider font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider text-[14px]">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-medium text-on-surface">Tuition Fee</td>
                    <td className="p-4 text-on-surface-variant">PKR 40,000</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">
                        Paid
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-medium text-on-surface">Lab Fee</td>
                    <td className="p-4 text-on-surface-variant">PKR 5,000</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-medium text-on-surface">Library Fee</td>
                    <td className="p-4 text-on-surface-variant">PKR 2,000</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">
                        Paid
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-lime-cream font-bold text-evergreen">
                    <td className="p-4">Total Semester Fee</td>
                    <td className="p-4 text-evergreen">PKR 47,000</td>
                    <td className="p-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="lg:col-span-12 bg-surface rounded-xl border border-border-light shadow-[0_4px_12px_rgba(19,42,19,0.08)] overflow-hidden relative">
          <div className="h-1 w-full bg-gradient-to-r from-success to-primary-container absolute top-0 left-0"></div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-[16px] font-bold text-evergreen">Payment History</h2>
              <button className="border-2 border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary text-[12px] font-medium rounded-lg py-2 px-4 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
                Download All Receipts
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-divider">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-surface-container-highest text-on-surface-variant">
                    <th className="p-4 text-[12px] font-semibold">Date</th>
                    <th className="p-4 text-[12px] font-semibold">Description</th>
                    <th className="p-4 text-[12px] font-semibold">Amount</th>
                    <th className="p-4 text-[12px] font-semibold">Method</th>
                    <th className="p-4 text-[12px] font-semibold">Reference</th>
                    <th className="p-4 text-[12px] font-semibold text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider text-[14px]">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 text-on-surface-variant">15 Jan 2026</td>
                    <td className="p-4 font-medium text-on-surface">Fall Semester Tuition (Partial)</td>
                    <td className="p-4 font-bold text-success">PKR 25,000</td>
                    <td className="p-4 text-on-surface-variant">Online Transfer</td>
                    <td className="p-4 font-mono text-sm text-body-secondary">TRX-98234A</td>
                    <td className="p-4 text-center">
                      <button className="text-info hover:text-info-bg transition-colors inline-block p-1 rounded hover:bg-surface-container">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>receipt_long</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 text-on-surface-variant">01 Sep 2025</td>
                    <td className="p-4 font-medium text-on-surface">Fall Semester Library Fee</td>
                    <td className="p-4 font-bold text-success">PKR 2,000</td>
                    <td className="p-4 text-on-surface-variant">Cash Deposit</td>
                    <td className="p-4 font-mono text-sm text-body-secondary">CSH-00129B</td>
                    <td className="p-4 text-center">
                      <button className="text-info hover:text-info-bg transition-colors inline-block p-1 rounded hover:bg-surface-container">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>receipt_long</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 text-on-surface-variant">15 Aug 2025</td>
                    <td className="p-4 font-medium text-on-surface">Fall Semester Tuition (Initial)</td>
                    <td className="p-4 font-bold text-success">PKR 15,000</td>
                    <td className="p-4 text-on-surface-variant">Credit Card</td>
                    <td className="p-4 font-mono text-sm text-body-secondary">CC-4451992</td>
                    <td className="p-4 text-center">
                      <button className="text-info hover:text-info-bg transition-colors inline-block p-1 rounded hover:bg-surface-container">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>receipt_long</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-surface w-full max-w-[520px] rounded-xl shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-br from-[#132A13] to-[#31572c] px-6 py-4 rounded-t-xl flex justify-between items-center text-on-primary shrink-0">
              <h3 className="text-[20px] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                Make Payment
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-on-primary/80 hover:text-on-primary transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="text-center mb-6">
                <span className="text-[12px] font-medium text-body-secondary uppercase tracking-wider">Amount Due</span>
                <div className="text-[28px] font-bold text-evergreen">PKR 15,000</div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-[14px] font-semibold text-on-surface mb-3">Select Payment Method</h4>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-border-light rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors has-[:checked]:border-success has-[:checked]:bg-success-bg/30">
                    <input type="radio" name="payment_method" value="bank" className="form-radio text-success focus:ring-success w-5 h-5" defaultChecked />
                    <span className="ml-3 flex-1 flex items-center justify-between">
                      <span className="text-[14px] font-medium text-on-surface">Bank Transfer</span>
                      <span className="material-symbols-outlined text-icon-inactive" style={{ fontVariationSettings: "'FILL' 0" }}>account_balance</span>
                    </span>
                  </label>
                  <label className="flex items-center p-4 border border-border-light rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors has-[:checked]:border-success has-[:checked]:bg-success-bg/30">
                    <input type="radio" name="payment_method" value="online" className="form-radio text-success focus:ring-success w-5 h-5" />
                    <span className="ml-3 flex-1 flex items-center justify-between">
                      <span className="text-[14px] font-medium text-on-surface">Online Payment / Card</span>
                      <span className="material-symbols-outlined text-icon-inactive" style={{ fontVariationSettings: "'FILL' 0" }}>credit_card</span>
                    </span>
                  </label>
                  <label className="flex items-center p-4 border border-border-light rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors has-[:checked]:border-success has-[:checked]:bg-success-bg/30">
                    <input type="radio" name="payment_method" value="cash" className="form-radio text-success focus:ring-success w-5 h-5" />
                    <span className="ml-3 flex-1 flex items-center justify-between">
                      <span className="text-[14px] font-medium text-on-surface">Cash Deposit (Campus)</span>
                      <span className="material-symbols-outlined text-icon-inactive" style={{ fontVariationSettings: "'FILL' 0" }}>payments</span>
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="mb-6 bg-surface-container-low p-4 rounded-lg border border-border-light">
                <h4 className="text-[14px] font-semibold text-on-surface mb-3">Upload Payment Proof (For Bank/Cash)</h4>
                <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container-highest transition-colors cursor-pointer mb-4">
                  <span className="material-symbols-outlined text-icon-inactive mb-2" style={{ fontVariationSettings: "'FILL' 0", fontSize: '32px' }}>cloud_upload</span>
                  <p className="text-[12px] font-medium text-body-secondary mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-placeholder">PNG, JPG, PDF up to 5MB</p>
                </div>
                <div>
                  <label htmlFor="reference" className="block text-[12px] font-medium text-on-surface mb-1">Transaction Reference Number</label>
                  <input type="text" id="reference" className="w-full border border-border-light rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-placeholder" placeholder="e.g. TRX-12345678" />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-divider flex justify-end gap-3 shrink-0 bg-surface rounded-b-xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-lg font-semibold text-[16px] border border-outline text-on-surface-variant hover:bg-surface-container-highest transition-colors"
              >
                Cancel
              </button>
              <button className="px-5 py-2.5 rounded-lg font-semibold text-[16px] bg-gradient-to-br from-[#132A13] to-[#31572c] text-on-primary hover:shadow-lg transition-shadow flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
