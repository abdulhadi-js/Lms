"use client";
import { useState } from 'react';
import { Search, Download, Settings, ChevronDown, Filter, FileText } from 'lucide-react';

export default function TeacherGradebook() {
  const [selectedCourse, setSelectedCourse] = useState('CS-101');
  
  const assignments = [
    { id: 'a1', name: 'Quiz 1', max: 10, weight: '10%' },
    { id: 'a2', name: 'Midterm Proj', max: 50, weight: '30%' },
    { id: 'a3', name: 'Assignment 2', max: 20, weight: '10%' },
    { id: 'a4', name: 'Final Exam', max: 100, weight: '50%' },
  ];

  const students = [
    { id: 'STD-042', name: 'Sarah Ahmed', marks: { a1: 9, a2: 45, a3: 18, a4: 88 }, gpa: '3.8' },
    { id: 'STD-089', name: 'Mohammad Hassan', marks: { a1: 6, a2: 35, a3: 14, a4: 72 }, gpa: '2.7' },
    { id: 'STD-112', name: 'Fatima Ali', marks: { a1: 10, a2: 48, a3: 19, a4: 95 }, gpa: '4.0' },
    { id: 'STD-015', name: 'Zain Malik', marks: { a1: 4, a2: 25, a3: 10, a4: 55 }, gpa: '1.8' },
    { id: 'STD-103', name: 'Ayesha Khan', marks: { a1: 8, a2: 42, a3: 17, a4: 81 }, gpa: '3.3' },
  ];

  const calculateTotal = (marks: Record<string, number>) => {
    // Mock calculation based on weights
    const a1w = (marks.a1 / 10) * 10;
    const a2w = (marks.a2 / 50) * 30;
    const a3w = (marks.a3 / 20) * 10;
    const a4w = (marks.a4 / 100) * 50;
    return (a1w + a2w + a3w + a4w).toFixed(1);
  };

  const getGrade = (total: number) => {
    if (total >= 90) return 'A';
    if (total >= 80) return 'B';
    if (total >= 70) return 'C';
    if (total >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Gradebook</h2>
          <p className="text-sm text-body-secondary mt-1">Manage scores and academic performance.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-border-light bg-white rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border-light bg-white rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
            <Settings className="w-4 h-4" /> Grading Setup
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-body-secondary whitespace-nowrap">Course:</span>
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-white border border-border-light rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64 font-semibold"
            >
              <option value="CS-101">CS-101: Intro to Computer Science</option>
              <option value="CS-201">CS-201: Data Structures</option>
            </select>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-icon-inactive" />
              <input type="text" placeholder="Search student..." className="w-full pl-9 pr-4 py-2 bg-white border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-divider">
                <th className="py-4 px-4 font-semibold text-sm text-heading-on-light sticky left-0 bg-surface-container-low z-10 shadow-[1px_0_0_var(--color-divider)]">Student</th>
                {assignments.map(a => (
                  <th key={a.id} className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center group cursor-pointer">
                      <span className="font-semibold text-sm text-heading-on-light group-hover:text-primary transition-colors">{a.name}</span>
                      <span className="text-xs text-body-secondary font-normal mt-0.5">Max: {a.max} | {a.weight}</span>
                    </div>
                  </th>
                ))}
                <th className="py-4 px-4 font-semibold text-sm text-heading-on-light text-center border-l border-divider">Total (%)</th>
                <th className="py-4 px-4 font-semibold text-sm text-heading-on-light text-center">Final Grade</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {students.map((student, i) => {
                const total = parseFloat(calculateTotal(student.marks));
                const grade = getGrade(total);
                
                return (
                  <tr key={i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                    <td className="py-3 px-4 sticky left-0 bg-white group-even:bg-surface-container-low z-10 shadow-[1px_0_0_var(--color-divider)]">
                      <div className="font-medium text-on-surface">{student.name}</div>
                      <div className="text-xs text-body-secondary">{student.id}</div>
                    </td>
                    {assignments.map(a => (
                      <td key={a.id} className="py-3 px-4 text-center">
                        <input 
                          type="number" 
                          defaultValue={student.marks[a.id as keyof typeof student.marks]} 
                          className="w-16 text-center bg-surface-container-lowest border border-border-light rounded px-1 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                          max={a.max}
                        />
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center font-bold text-on-surface border-l border-divider bg-surface-container-lowest/50">
                      {total}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        grade === 'A' ? 'bg-success-bg text-success' :
                        grade === 'B' ? 'bg-primary-fixed text-primary-container' :
                        grade === 'C' ? 'bg-warning-bg text-warning' :
                        grade === 'D' ? 'bg-error-bg text-error opacity-70' :
                        'bg-error text-white'
                      }`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-divider flex justify-between items-center bg-surface-container-lowest">
          <p className="text-sm text-body-secondary">Changes are saved automatically.</p>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 text-primary font-medium text-sm hover:underline">
              <FileText className="w-4 h-4" /> Add Assignment Column
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
