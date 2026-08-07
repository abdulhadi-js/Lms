"use client";
import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'lms_academic_calendar';

const DEFAULT_DATA = {
  years: [
    { id: 1, range: '2024-2025', status: 'COMPLETED', students: 850 },
    { id: 2, range: '2025-2026', status: 'CURRENT', students: 920 },
    { id: 3, range: '2026-2027', status: 'UPCOMING', students: 0 },
  ],
  terms: [
    { id: 1, name: 'Term 1 (Monthly Test)', startDate: '2025-04-15', endDate: '2025-04-15', examType: 'MONTHLY_TEST', status: 'Completed' },
    { id: 2, name: 'Mid-Term Exams',        startDate: '2025-06-10', endDate: '2025-06-20', examType: 'MID_TERM',     status: 'Completed' },
    { id: 3, name: 'Half-Yearly Exams',     startDate: '2025-11-10', endDate: '2025-11-25', examType: 'HALF_YEARLY',  status: 'Upcoming' },
    { id: 4, name: 'Annual Examinations',   startDate: '2026-04-01', endDate: '2026-04-20', examType: 'ANNUAL',       status: 'Scheduled' },
  ],
  holidays: [
    { id: 1, name: 'Independence Day',       date: '14 Aug' },
    { id: 2, name: 'Eid ul Fitr',            date: '3 days (Islamic Calendar)' },
    { id: 3, name: 'Eid ul Adha',            date: '3 days (Islamic Calendar)' },
    { id: 4, name: 'Quaid-e-Azam Day',       date: '25 Dec' },
    { id: 5, name: 'Labour Day',             date: '1 May' },
    { id: 6, name: 'Kashmir Solidarity Day', date: '5 Feb' },
    { id: 7, name: 'Iqbal Day',              date: '9 Nov' },
    { id: 8, name: 'Ashura',                 date: '2 days (Islamic Calendar)' },
    { id: 9, name: 'Pakistan Day',           date: '23 Mar' },
  ],
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

function saveToStorage(data: typeof DEFAULT_DATA) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export default function AcademicCalendarPage() {
  const [activeTab, setActiveTab] = useState<'years' | 'terms' | 'holidays'>('years');
  const [data, setData]           = useState(DEFAULT_DATA);
  const [saved, setSaved]         = useState(false);

  // Load from localStorage on mount
  useEffect(() => { setData(loadFromStorage()); }, []);

  const save = (newData: typeof DEFAULT_DATA) => {
    saveToStorage(newData);
    setData(newData);
    setSaved(true);
    toast.success('Calendar saved!');
    setTimeout(() => setSaved(false), 2000);
  };

  // ─── Terms ───────────────────────────────────────────
  const [termForm, setTermForm] = useState({ name: '', startDate: '', endDate: '', examType: 'MONTHLY_TEST', status: 'Upcoming' });
  const [addingTerm, setAddingTerm] = useState(false);

  const addTerm = () => {
    if (!termForm.name || !termForm.startDate) { toast.error('Name and start date required'); return; }
    const newData = { ...data, terms: [...data.terms, { ...termForm, id: Date.now() }] };
    save(newData);
    setAddingTerm(false);
    setTermForm({ name: '', startDate: '', endDate: '', examType: 'MONTHLY_TEST', status: 'Upcoming' });
  };

  const deleteTerm = (id: number) => {
    if (!confirm('Remove this term?')) return;
    save({ ...data, terms: data.terms.filter(t => t.id !== id) });
  };

  // ─── Holidays ────────────────────────────────────────
  const [holidayForm, setHolidayForm] = useState({ name: '', date: '' });
  const [addingHoliday, setAddingHoliday] = useState(false);

  const addHoliday = () => {
    if (!holidayForm.name || !holidayForm.date) { toast.error('Name and date required'); return; }
    save({ ...data, holidays: [...data.holidays, { ...holidayForm, id: Date.now() }] });
    setAddingHoliday(false);
    setHolidayForm({ name: '', date: '' });
  };

  const deleteHoliday = (id: number) => {
    if (!confirm('Remove this holiday?')) return;
    save({ ...data, holidays: data.holidays.filter(h => h.id !== id) });
  };

  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const EXAM_TYPE_LABELS: Record<string, string> = {
    MONTHLY_TEST: 'Monthly Test', MID_TERM: 'Mid-Term', HALF_YEARLY: 'Half-Yearly', ANNUAL: 'Annual',
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Academic Calendar</h2>
          <p className="text-sm text-body-secondary mt-1">Manage school years, exam terms, and public holidays.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-body-secondary">
          {saved && <span className="flex items-center gap-1 text-success"><CheckCircle2 className="w-3.5 h-3.5"/>Saved</span>}
          <span>Data persisted in browser localStorage</span>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-divider bg-surface-container/20 px-2">
          {(['years', 'terms', 'holidays'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-body-secondary hover:text-on-surface'}`}>
              {tab === 'years' ? '📅 Academic Years' : tab === 'terms' ? '📆 Terms & Exams' : '🎌 Holidays'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ─── Academic Years ─── */}
          {activeTab === 'years' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Academic Years (2025–2026 Session)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.years.map(y => (
                  <div key={y.id} className="border border-divider rounded-xl p-5 shadow-sm bg-surface">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-xl">{y.range}</h4>
                      {y.status === 'CURRENT' && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-success/10 text-success rounded-full">CURRENT</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        y.status === 'CURRENT' ? 'bg-success-bg text-success' :
                        y.status === 'UPCOMING' ? 'bg-primary/10 text-primary' :
                        'bg-surface-container text-body-secondary'}`}>{y.status}</span>
                      <span className="text-sm text-body-secondary">{y.students.toLocaleString()} students</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Terms & Exams ─── */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Exam Terms — 2025–2026</h3>
                <button onClick={() => setAddingTerm(v => !v)}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90">
                  <Plus className="w-4 h-4"/> Add Term
                </button>
              </div>

              {/* Add Term Form */}
              {addingTerm && (
                <div className="border border-primary/20 rounded-xl p-4 bg-primary/5 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <input placeholder="Term Name (e.g. Second Monthly Test)" value={termForm.name}
                    onChange={e => setTermForm(f => ({...f, name: e.target.value}))}
                    className="col-span-2 border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-surface" />
                  <div>
                    <label className="block text-xs font-semibold text-body-secondary mb-1">Start Date</label>
                    <input type="date" value={termForm.startDate} onChange={e => setTermForm(f => ({...f, startDate: e.target.value}))}
                      className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-surface" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-body-secondary mb-1">End Date</label>
                    <input type="date" value={termForm.endDate} onChange={e => setTermForm(f => ({...f, endDate: e.target.value}))}
                      className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-surface" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-body-secondary mb-1">Exam Type</label>
                    <select value={termForm.examType} onChange={e => setTermForm(f => ({...f, examType: e.target.value}))}
                      className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-surface">
                      <option value="MONTHLY_TEST">Monthly Test</option>
                      <option value="MID_TERM">Mid-Term</option>
                      <option value="HALF_YEARLY">Half-Yearly</option>
                      <option value="ANNUAL">Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-body-secondary mb-1">Status</label>
                    <select value={termForm.status} onChange={e => setTermForm(f => ({...f, status: e.target.value}))}
                      className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-surface">
                      <option>Upcoming</option><option>Scheduled</option><option>Completed</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex gap-2 justify-end">
                    <button onClick={() => setAddingTerm(false)} className="px-4 py-2 text-sm border border-border-light rounded-lg hover:bg-surface-container">Cancel</button>
                    <button onClick={addTerm} className="px-4 py-2 text-sm bg-primary text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90">
                      <Save className="w-4 h-4"/> Save Term
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto border border-divider rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container/30">
                    <tr className="text-xs uppercase text-body-secondary border-b border-divider">
                      <th className="py-3 px-4 font-semibold">Term</th>
                      <th className="py-3 px-4 font-semibold">Start</th>
                      <th className="py-3 px-4 font-semibold">End</th>
                      <th className="py-3 px-4 font-semibold">Type</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {data.terms.map(t => (
                      <tr key={t.id} className="border-b border-divider last:border-b-0 hover:bg-surface-container/10">
                        <td className="py-3 px-4 font-semibold">{t.name}</td>
                        <td className="py-3 px-4 text-body-secondary">{fmtDate(t.startDate)}</td>
                        <td className="py-3 px-4 text-body-secondary">{fmtDate(t.endDate)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-md">
                            {EXAM_TYPE_LABELS[t.examType] || t.examType}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            t.status === 'Completed' ? 'bg-success-bg text-success' :
                            t.status === 'Upcoming'  ? 'bg-primary/10 text-primary' :
                            'bg-surface-container text-body-secondary'}`}>{t.status}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button onClick={() => deleteTerm(t.id)} className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Holidays ─── */}
          {activeTab === 'holidays' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">National & Public Holidays</h3>
                <button onClick={() => setAddingHoliday(v => !v)}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90">
                  <Plus className="w-4 h-4"/> Add Holiday
                </button>
              </div>

              {addingHoliday && (
                <div className="border border-primary/20 rounded-xl p-4 bg-primary/5 flex gap-3 flex-wrap mb-4">
                  <input placeholder="Holiday Name" value={holidayForm.name}
                    onChange={e => setHolidayForm(f => ({...f, name: e.target.value}))}
                    className="flex-1 min-w-[180px] border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-surface" />
                  <input placeholder="Date (e.g. 14 Aug)" value={holidayForm.date}
                    onChange={e => setHolidayForm(f => ({...f, date: e.target.value}))}
                    className="flex-1 min-w-[140px] border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-surface" />
                  <button onClick={() => setAddingHoliday(false)} className="px-4 py-2 text-sm border border-border-light rounded-lg hover:bg-surface-container">Cancel</button>
                  <button onClick={addHoliday} className="px-4 py-2 text-sm bg-primary text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90">
                    <Save className="w-4 h-4"/> Save
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.holidays.map(h => (
                  <div key={h.id} className="border border-divider rounded-xl p-4 shadow-sm flex justify-between items-center bg-surface">
                    <div>
                      <h4 className="font-bold text-on-surface">{h.name}</h4>
                      <p className="text-sm text-body-secondary flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3"/> {h.date}
                      </p>
                    </div>
                    <button onClick={() => deleteHoliday(h.id)}
                      className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors ml-3 shrink-0">
                      <Trash2 className="w-4 h-4"/>
                    </button>
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
