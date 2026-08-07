"use client";
import { useState, useEffect } from 'react';
import { coursesApi, academicsApi } from '@/lib/api';
import { Printer, Plus, Trash2, Save, BookOpen, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ExamRow {
  id: string;
  date: string;
  subject: string;
  subjectCode: string;
  startTime: string;
  duration: string;
  hall: string;
  examType: string;
}

const EXAM_TYPES = [
  { value: 'MONTHLY_TEST', label: 'Monthly Test' },
  { value: 'MID_TERM', label: 'Mid-Term Exam' },
  { value: 'HALF_YEARLY', label: 'Half-Yearly Exam' },
  { value: 'ANNUAL', label: 'Annual Examination' },
];

export default function ExamSchedulePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('ANNUAL');
  const [examRows, setExamRows] = useState<ExamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolName, setSchoolName] = useState('EduCore School System');
  const [academicYear, setAcademicYear] = useState('2025–2026');

  useEffect(() => {
    Promise.all([
      academicsApi.listClasses().catch(() => []),
      coursesApi.list().catch(() => [])
    ]).then(([classData, courseData]) => {
      const classList = classData.data || classData || [];
      const courseList = courseData.data || courseData || [];
      setClasses(classList);
      setSubjects(courseList);
      if (classList.length > 0) setSelectedClass(classList[0].id);
    }).finally(() => setLoading(false));
  }, []);

  const addRow = () => {
    setExamRows(prev => [...prev, {
      id: Date.now().toString(),
      date: '',
      subject: '',
      subjectCode: '',
      startTime: '09:00 AM',
      duration: '3 Hours',
      hall: 'Main Hall',
      examType: selectedExamType
    }]);
  };

  const updateRow = (id: string, field: keyof ExamRow, value: string) => {
    setExamRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      // Auto-fill subject code when subject name is selected
      if (field === 'subject') {
        const matched = subjects.find(s => s.title === value || s.id === value);
        if (matched) {
          updated.subject = matched.title;
          updated.subjectCode = matched.code || '';
        }
      }
      return updated;
    }));
  };

  const removeRow = (id: string) => {
    setExamRows(prev => prev.filter(r => r.id !== id));
  };

  const populateFromSubjects = () => {
    const classSubjects = subjects.filter(s =>
      !selectedClass || s.classId === selectedClass || s.classLevel === classes.find(c => c.id === selectedClass)?.name
    );
    if (classSubjects.length === 0) {
      toast.error('No subjects linked to this class. Please assign subjects first.');
      return;
    }
    const newRows: ExamRow[] = classSubjects.map((s, i) => ({
      id: `auto-${s.id}`,
      date: '',
      subject: s.title,
      subjectCode: s.code || '',
      startTime: '09:00 AM',
      duration: '3 Hours',
      hall: 'Main Hall',
      examType: selectedExamType
    }));
    setExamRows(newRows);
    toast.success(`${newRows.length} subjects loaded. Fill in the dates.`);
  };

  const selectedClassName = classes.find(c => c.id === selectedClass)?.name || selectedClass;
  const examTypeLabel = EXAM_TYPES.find(e => e.value === selectedExamType)?.label || selectedExamType;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          table { border-collapse: collapse !important; width: 100% !important; }
          td, th { border: 1px solid #000 !important; padding: 8px !important; font-size: 12px !important; }
          header, nav, aside, footer { display: none !important; }
          .print-container { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
        }
      `}} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6 print-container">
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 no-print">
          <div>
            <h2 className="text-3xl font-bold text-heading-on-light">Exam Date Sheet</h2>
            <p className="text-sm text-body-secondary mt-1">Create and print subject-wise exam schedules for each class.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => window.print()} className="border border-border-light bg-surface px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container flex items-center gap-2">
              <Printer className="w-4 h-4"/> Print Date Sheet
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="no-print bg-surface border border-divider rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-body-secondary mb-1">School Name</label>
            <input value={schoolName} onChange={e => setSchoolName(e.target.value)}
              className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-body-secondary mb-1">Academic Year</label>
            <input value={academicYear} onChange={e => setAcademicYear(e.target.value)}
              className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-body-secondary mb-1">Class</label>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
              className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
              {classes.length > 0 ? classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              )) : ['9','10','11','12'].map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-body-secondary mb-1">Exam Type</label>
            <select value={selectedExamType} onChange={e => setSelectedExamType(e.target.value)}
              className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
              {EXAM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print flex flex-wrap gap-2">
          <button onClick={populateFromSubjects}
            className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/20">
            <BookOpen className="w-4 h-4"/> Auto-Fill from Class Subjects
          </button>
          <button onClick={addRow}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90">
            <Plus className="w-4 h-4"/> Add Row Manually
          </button>
        </div>

        {/* Printable Date Sheet */}
        <div className="border border-divider rounded-xl overflow-hidden bg-white">
          {/* Print Header */}
          <div className="text-center py-6 px-4 border-b border-black bg-white">
            <h1 className="text-2xl font-bold uppercase tracking-wide">{schoolName}</h1>
            <h2 className="text-xl font-semibold mt-1">{examTypeLabel} — {academicYear}</h2>
            <p className="text-base mt-1">Class: <strong>{selectedClassName}</strong></p>
            <p className="text-sm text-gray-500 mt-1 no-print">Date Sheet Preview — Edit rows below then print</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-black min-w-[700px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black py-2 px-3 font-bold text-sm">No.</th>
                  <th className="border border-black py-2 px-3 font-bold text-sm">Date</th>
                  <th className="border border-black py-2 px-3 font-bold text-sm">Subject</th>
                  <th className="border border-black py-2 px-3 font-bold text-sm">Code</th>
                  <th className="border border-black py-2 px-3 font-bold text-sm">Time</th>
                  <th className="border border-black py-2 px-3 font-bold text-sm">Duration</th>
                  <th className="border border-black py-2 px-3 font-bold text-sm">Exam Hall</th>
                  <th className="border border-black py-2 px-3 font-bold text-sm no-print">Action</th>
                </tr>
              </thead>
              <tbody>
                {examRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="border border-black py-8 text-center text-gray-400 italic no-print">
                      No exam schedule added yet. Click "Auto-Fill from Class Subjects" or "Add Row Manually".
                    </td>
                  </tr>
                ) : examRows.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="border border-black py-1.5 px-3 text-sm font-semibold">{idx + 1}</td>
                    <td className="border border-black py-1 px-2 no-print">
                      <input type="date" value={row.date} onChange={e => updateRow(row.id, 'date', e.target.value)}
                        className="w-full border-0 outline-none text-sm bg-transparent" />
                    </td>
                    <td className="border border-black py-1.5 px-3 text-sm print-only hidden">{row.date ? new Date(row.date).toLocaleDateString('en-PK', {day:'2-digit', month:'short', year:'numeric'}) : '___________'}</td>
                    <td className="border border-black py-1 px-2 no-print">
                      <select value={row.subject} onChange={e => updateRow(row.id, 'subject', e.target.value)}
                        className="w-full border-0 outline-none text-sm bg-transparent min-w-[120px]">
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                        {row.subject && !subjects.find(s => s.title === row.subject) && (
                          <option value={row.subject}>{row.subject}</option>
                        )}
                      </select>
                    </td>
                    <td className="border border-black py-1.5 px-3 text-sm print-only hidden">{row.subject || '___________'}</td>
                    <td className="border border-black py-1 px-2 no-print">
                      <input value={row.subjectCode} onChange={e => updateRow(row.id, 'subjectCode', e.target.value)}
                        placeholder="e.g. MATH-9"
                        className="w-full border-0 outline-none text-sm bg-transparent font-mono" />
                    </td>
                    <td className="border border-black py-1.5 px-3 text-sm print-only hidden">{row.subjectCode}</td>
                    <td className="border border-black py-1 px-2 no-print">
                      <input value={row.startTime} onChange={e => updateRow(row.id, 'startTime', e.target.value)}
                        className="w-full border-0 outline-none text-sm bg-transparent" />
                    </td>
                    <td className="border border-black py-1.5 px-3 text-sm print-only hidden">{row.startTime}</td>
                    <td className="border border-black py-1 px-2 no-print">
                      <input value={row.duration} onChange={e => updateRow(row.id, 'duration', e.target.value)}
                        className="w-full border-0 outline-none text-sm bg-transparent" />
                    </td>
                    <td className="border border-black py-1.5 px-3 text-sm print-only hidden">{row.duration}</td>
                    <td className="border border-black py-1 px-2 no-print">
                      <input value={row.hall} onChange={e => updateRow(row.id, 'hall', e.target.value)}
                        className="w-full border-0 outline-none text-sm bg-transparent" />
                    </td>
                    <td className="border border-black py-1.5 px-3 text-sm print-only hidden">{row.hall}</td>
                    <td className="border border-black py-1 px-2 no-print">
                      <button onClick={() => removeRow(row.id)} className="text-error hover:bg-error/10 p-1 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Print Footer */}
          {examRows.length > 0 && (
            <div className="p-6 grid grid-cols-3 gap-8 border-t border-black bg-white mt-4">
              <div className="text-center">
                <div className="border-t border-black pt-2 text-sm font-semibold">Principal&apos;s Signature</div>
              </div>
              <div className="text-center">
                <div className="border-t border-black pt-2 text-sm font-semibold">Controller of Examinations</div>
              </div>
              <div className="text-center">
                <div className="border-t border-black pt-2 text-sm font-semibold">Date of Issue</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
