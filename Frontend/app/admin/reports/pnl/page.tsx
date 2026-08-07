"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Download, Calendar, Banknote, TrendingUp, TrendingDown, ArrowLeft, RefreshCcw } from 'lucide-react';
import { financeApi } from '@/lib/api';
import Link from 'next/link';

export default function PnLReport() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ totalIncome: number, totalExpenses: number, netProfit: number } | null>(null);
  
  // Default to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const fetchPnL = async () => {
    setLoading(true);
    try {
      const res = await financeApi.getPnL(new Date(startDate).toISOString(), new Date(endDate).toISOString());
      setData(res.data || res || { totalIncome: 0, totalExpenses: 0, netProfit: 0 });
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch P&L Report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPnL();
  }, []); // Initial load

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <div>
          <Link href="/admin/reports" className="flex items-center text-sm font-medium text-body-secondary hover:text-primary mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Reports
          </Link>
          <h2 className="text-3xl font-bold text-heading-on-light">Profit & Loss Closing</h2>
          <p className="text-sm text-body-secondary mt-1">Generate automated financial closing statements.</p>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container transition-colors brand-shadow">
          <Download className="w-4 h-4" />
          Export Statement
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-divider brand-shadow p-5 mb-6 print:hidden">
        <h3 className="text-sm font-bold text-on-surface mb-4 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> Select Period
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-body-secondary mb-1">Start Date</label>
            <input 
              type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-body-secondary mb-1">End Date</label>
            <input 
              type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
            />
          </div>
          <button 
            onClick={fetchPnL} disabled={loading}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : 'Generate Statement'}
          </button>
        </div>
      </div>

      {data && (
        <div className="bg-white rounded-xl border border-divider shadow-md print:shadow-none print:border-none p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          <div className="flex justify-between items-start mb-12 border-b border-divider pb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Statement of Profit & Loss</h1>
              <p className="text-gray-500 mt-2 font-medium">EduCore Institute of Excellence</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider mb-1">Closing Period</p>
              <p className="text-lg font-bold text-gray-900">{new Date(startDate).toLocaleDateString()} &mdash; {new Date(endDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Income Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-100 pb-2 mb-4 flex items-center justify-between">
                <span>Revenue (Income)</span>
                <TrendingUp className="w-5 h-5 text-success" />
              </h3>
              <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Total Operational Income (Fees + Manual)</span>
                <span className="text-xl font-bold text-success">Rs. {Number(data.totalIncome).toLocaleString('en-PK')}</span>
              </div>
            </div>

            {/* Expenses Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-100 pb-2 mb-4 flex items-center justify-between">
                <span>Operating Expenses</span>
                <TrendingDown className="w-5 h-5 text-error" />
              </h3>
              <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Total Expenses (Payroll, Maintenance, etc.)</span>
                <span className="text-xl font-bold text-error">-Rs. {Number(data.totalExpenses).toLocaleString('en-PK')}</span>
              </div>
            </div>

            {/* Net Profit Section */}
            <div className="mt-12 pt-8 border-t-[3px] border-gray-900">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-gray-900 uppercase tracking-widest">Net Cash-In-Hand</span>
                <span className={`text-3xl font-black ${data.netProfit >= 0 ? 'text-success' : 'text-error'}`}>
                  Rs. {Number(data.netProfit).toLocaleString('en-PK')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-dashed border-divider flex justify-between items-end">
            <div className="w-48 text-center">
              <div className="border-b border-gray-400 mb-2 h-10"></div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Accountant Signature</p>
            </div>
            <div className="w-48 text-center">
              <div className="border-b border-gray-400 mb-2 h-10"></div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Director Signature</p>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <DollarSign className="w-96 h-96" />
          </div>
        </div>
      )}
    </div>
  );
}
