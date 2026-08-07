"use client";
import { useState } from 'react';
import { Calendar, Plus, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AcademicCalendarPage() {
  const [activeTab, setActiveTab] = useState<'years' | 'terms' | 'holidays'>('years');
  const [years, setYears] = useState([
    { id: 1, range: '2024-2025', status: 'COMPLETED', students: 850 },
    { id: 2, range: '2025-2026', status: 'CURRENT', students: 920 },
    { id: 3, range: '2026-2027', status: 'UPCOMING', students: 0 },
  ]);
  const [terms, setTerms] = useState([
    { id: 1, name: 'Term 1 (Monthly Test)', startDate: '15 Apr 2025', endDate: '15 Apr 2025', examType: 'MONTHLY_TEST', status: 'Completed' },
    { id: 2, name: 'Mid-Term', startDate: '10 Jun 2025', endDate: '20 Jun 2025', examType: 'MID_TERM', status: 'Completed' },
    { id: 3, name: 'Half-Yearly', startDate: '10 Nov 2025', endDate: '25 Nov 2025', examType: 'HALF_YEARLY', status: 'Upcoming' },
    { id: 4, name: 'Annual', startDate: '1 Apr 2026', endDate: '20 Apr 2026', examType: 'ANNUAL', status: 'Scheduled' },
  ]);
  const [holidays, setHolidays] = useState([
    { id: 1, name: 'Independence Day', date: '14 August' },
    { id: 2, name: 'Eid ul Fitr', date: '3 days (dynamic)' },
    { id: 3, name: 'Eid ul Adha', date: '3 days (dynamic)' },
    { id: 4, name: 'Quaid-e-Azam Day', date: '25 December' },
    { id: 5, name: 'Labour Day', date: '1 May' },
    { id: 6, name: 'Kashmir Solidarity Day', date: '5 February' },
    { id: 7, name: 'Iqbal Day', date: '9 November' },
    { id: 8, name: 'Ashura', date: '2 days (dynamic)' },
  ]);

  const saveLocally = () => toast.success('Saved locally — connect to backend');

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Academic Calendar</h2>
          <p className="text-sm text-body-secondary mt-1">Manage school year, terms, and public holidays.</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
        <div className="flex border-b border-divider bg-surface-container/20 px-2">
          <button onClick={() => setActiveTab('years')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'years' ? 'border-primary text-primary' : 'border-transparent text-body-secondary hover:text-on-surface'}`}>📅 Academic Years</button>
          <button onClick={() => setActiveTab('terms')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'terms' ? 'border-primary text-primary' : 'border-transparent text-body-secondary hover:text-on-surface'}`}>📆 Terms & Exams</button>
          <button onClick={() => setActiveTab('holidays')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'holidays' ? 'border-primary text-primary' : 'border-transparent text-body-secondary hover:text-on-surface'}`}>🎌 Holidays</button>
        </div>
        
        <div className="p-6">
          {activeTab === 'years' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Academic Years</h3>
                <button onClick={saveLocally} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90">+ New Academic Year</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {years.map(y => (
                  <div key={y.id} className="border border-divider rounded-xl p-5 shadow-sm relative bg-surface">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-xl">{y.range} {y.status === 'CURRENT' && '(Current)'}</h4>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${y.status === 'CURRENT' ? 'bg-success-bg text-success' : y.status === 'UPCOMING' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-body-secondary'}`}>{y.status}</span>
                      <span className="text-sm text-body-secondary">{y.students} students</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Exam Terms (Current Year)</h3>
                <button onClick={saveLocally} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90">+ Add Term</button>
              </div>
              <div className="overflow-x-auto border border-divider rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container/30">
                    <tr className="text-xs uppercase text-body-secondary border-b border-divider">
                      <th className="py-3 px-4 font-semibold">Term</th>
                      <th className="py-3 px-4 font-semibold">Start Date</th>
                      <th className="py-3 px-4 font-semibold">End Date</th>
                      <th className="py-3 px-4 font-semibold">Exam Type</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {terms.map(t => (
                      <tr key={t.id} className="border-b border-divider last:border-b-0 hover:bg-surface-container/10">
                        <td className="py-3 px-4 font-medium">{t.name}</td>
                        <td className="py-3 px-4 text-body-secondary">{t.startDate}</td>
                        <td className="py-3 px-4 text-body-secondary">{t.endDate}</td>
                        <td className="py-3 px-4 text-body-secondary">{t.examType}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${t.status === 'Completed' ? 'bg-success-bg text-success' : t.status === 'Upcoming' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-body-secondary'}`}>{t.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'holidays' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">National & Public Holidays</h3>
                <button onClick={saveLocally} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90">+ Add Holiday</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {holidays.map(h => (
                  <div key={h.id} className="border border-divider rounded-xl p-4 shadow-sm flex justify-between items-center bg-surface">
                    <div>
                      <h4 className="font-bold text-on-surface">{h.name}</h4>
                      <p className="text-sm text-body-secondary flex items-center gap-1 mt-1"><Calendar className="w-3 h-3"/> {h.date}</p>
                    </div>
                    <button onClick={saveLocally} className="text-error hover:bg-error-bg p-2 rounded-lg text-xs font-medium">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
