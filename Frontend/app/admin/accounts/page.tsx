"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Search, TrendingUp, TrendingDown, Banknote, Loader2, ArrowRight } from 'lucide-react';
import { RequireAccess } from '@/components/RequireAccess';
import { financeApi } from '@/lib/api';

export default function AccountsManagement() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    category: 'MAINTENANCE',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    referenceNumber: ''
  });
  const [sourceAccount, setSourceAccount] = useState('MAIN_BANK');
  const [lineItems, setLineItems] = useState([{ amount: '', description: '' }]);

  // Filters
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await financeApi.getTransactions();
      setTransactions(res.data || res || []);
    } catch (err: any) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Promise.all(lineItems.map(item => 
        financeApi.createTransaction({
          type: formData.type,
          category: formData.category,
          amount: Number(item.amount),
          description: `[${sourceAccount}] ` + item.description,
          date: new Date(formData.date).toISOString(),
          referenceNumber: formData.referenceNumber || null
        })
      ));
      toast.success('Transaction logged successfully');
      setIsModalOpen(false);
      setFormData({ ...formData, referenceNumber: '' });
      setLineItems([{ amount: '', description: '' }]);
      setSourceAccount('MAIN_BANK');
      fetchTransactions();
    } catch (err: any) {
      toast.error(err.message || 'Failed to log transaction');
    }
  };

  const handleRunPayroll = async () => {
    if (!confirm('Are you sure you want to run the automated payroll engine for this month? This will compute all staff salaries and insert EXPENSE records.')) return;
    try {
      await financeApi.generatePayroll();
      toast.success('Payroll generated and posted to ledger!');
      fetchTransactions();
    } catch (err: any) {
      toast.error(err.message || 'Payroll generation failed');
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + Number(b.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + Number(b.amount), 0);
  const netProfit = totalIncome - totalExpense;

  const filtered = transactions.filter(t => {
    if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase()) && !t.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <RequireAccess module="ACCOUNTS" action="canView">
      <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6 animate-in fade-in duration-300">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-heading-on-light">Chart of Accounts</h2>
            <p className="text-sm text-body-secondary mt-1">Manage institute expenses, incomes, and payroll ledger.</p>
          </div>
          <div className="flex gap-2">
            <RequireAccess module="ACCOUNTS" action="canAdd">
              <button 
                onClick={handleRunPayroll}
                className="flex items-center gap-2 bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors"
              >
                Run Payroll Engine
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 primary-gradient text-white px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
              >
                <Plus className="h-4 w-4" />
                Log Transaction
              </button>
            </RequireAccess>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-surface rounded-xl border border-divider brand-shadow p-5 flex items-start gap-4">
            <div className="p-3 bg-success-bg text-success rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-body-secondary uppercase tracking-wider">Manual Income</p>
              <h3 className="text-2xl font-bold text-on-surface mt-1">Rs. {totalIncome.toLocaleString('en-PK')}</h3>
            </div>
          </div>
          
          <div className="bg-surface rounded-xl border border-divider brand-shadow p-5 flex items-start gap-4">
            <div className="p-3 bg-error-bg text-error rounded-lg">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-body-secondary uppercase tracking-wider">Total Expenses</p>
              <h3 className="text-2xl font-bold text-on-surface mt-1">Rs. {totalExpense.toLocaleString('en-PK')}</h3>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-divider brand-shadow p-5 flex items-start gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="p-3 bg-primary-container/20 text-primary-fixed rounded-lg">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-body-secondary uppercase tracking-wider">Net (Manual)</p>
              <h3 className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-success' : 'text-error'}`}>
                Rs. {netProfit.toLocaleString('en-PK')}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
          <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
            <div className="flex gap-2">
              <select 
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Types</option>
                <option value="INCOME">Income Only</option>
                <option value="EXPENSE">Expense Only</option>
              </select>
              
              <select 
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Categories</option>
                <option value="SALARY">Salary</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="PHOTOSTAT">Photostat</option>
                <option value="UTILITIES">Utilities</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-icon-inactive" />
              <input 
                type="text" 
                placeholder="Search descriptions, refs..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
              />
            </div>
          </div>
          
          <div className="overflow-x-auto min-h-[400px]">
            {loading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-body-secondary">
                <Banknote className="w-12 h-12 mb-2 opacity-20" />
                <p>No transactions found.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="text-body-secondary text-[11px] uppercase tracking-wider border-b border-divider">
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id} className="border-b border-border-light hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.type === 'INCOME' ? 'bg-success-bg text-success' : 'bg-error-bg text-error'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-body-secondary">{t.category}</td>
                      <td className="py-3 px-4">
                        <div className="text-on-surface">{t.description}</div>
                        {t.referenceNumber && <div className="text-xs text-body-secondary mt-0.5">Ref: {t.referenceNumber}</div>}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${t.type === 'INCOME' ? 'text-success' : 'text-error'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}Rs. {Number(t.amount).toLocaleString('en-PK')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Log Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light">Log Transaction</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Type</label>
                  <select 
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income (Manual)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Category</label>
                  <select 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  >
                    <option value="SALARY">Salary</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="PHOTOSTAT">Photostat</option>
                    <option value="UTILITIES">Utilities</option>
                    <option value="MARKETING">Marketing/Publicity</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Source Account</label>
                <select 
                  value={sourceAccount} onChange={e => setSourceAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="MAIN_BANK">Main Bank Account</option>
                  <option value="PETTY_CASH">Petty Cash</option>
                  <option value="ONLINE_GATEWAY">Online Payment Gateway</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-on-surface">Line Items</label>
                  <button type="button" onClick={() => setLineItems([...lineItems, { amount: '', description: '' }])} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>
                {lineItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input 
                        type="text" required placeholder="Description (e.g. Monthly electricity bill)"
                        value={item.description} onChange={e => {
                          const newItems = [...lineItems];
                          newItems[index].description = e.target.value;
                          setLineItems(newItems);
                        }}
                        className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm mb-1" 
                      />
                    </div>
                    <div className="w-1/3">
                      <input 
                        type="number" step="0.01" required placeholder="Amount ($)"
                        value={item.amount} onChange={e => {
                          const newItems = [...lineItems];
                          newItems[index].amount = e.target.value;
                          setLineItems(newItems);
                        }}
                        className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
                      />
                    </div>
                    {lineItems.length > 1 && (
                      <button type="button" onClick={() => {
                        setLineItems(lineItems.filter((_, i) => i !== index));
                      }} className="p-2 text-icon-inactive hover:text-error mt-0.5">
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Date</label>
                  <input 
                    type="date" required
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Cheque / Ref # (Optional)</label>
                  <input 
                    type="text"
                    value={formData.referenceNumber} onChange={e => setFormData({...formData, referenceNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-divider mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-body-secondary hover:bg-surface-container rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold">Log Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RequireAccess>
  );
}
