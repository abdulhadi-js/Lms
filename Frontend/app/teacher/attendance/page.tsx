"use client";
import { useState } from 'react';
import { Search, Filter, Calendar as CalendarIcon, Check, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TeacherAttendance() {
  const [selectedCourse, setSelectedCourse] = useState('CS-101');
  const [date, setDate] = useState('2026-10-12');
  
  const students = [
    { id: 'STD-042', name: 'Sarah Ahmed', status: 'present' },
    { id: 'STD-089', name: 'Mohammad Hassan', status: 'absent' },
    { id: 'STD-112', name: 'Fatima Ali', status: 'present' },
    { id: 'STD-015', name: 'Zain Malik', status: 'late' },
    { id: 'STD-103', name: 'Ayesha Khan', status: 'present' },
    { id: 'STD-055', name: 'Omar Farooq', status: 'present' },
    { id: 'STD-077', name: 'Bilal Saeed', status: 'excused' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Attendance</h2>
          <p className="text-sm text-body-secondary mt-1">Mark and manage attendance for your classes.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 border border-border-light bg-white rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
            Generate Report
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 primary-gradient text-white rounded-lg text-sm font-semibold hover:shadow-md transition-shadow">
            Save Attendance
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-body-secondary whitespace-nowrap">Class:</span>
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="bg-white border border-border-light rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-48"
              >
                <option value="CS-101">CS-101: Intro to CS</option>
                <option value="CS-201">CS-201: Data Structures</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-body-secondary whitespace-nowrap">Date:</span>
              <div className="relative w-full sm:w-auto">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-icon-inactive" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-white border border-border-light rounded-lg pl-9 pr-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-icon-inactive" />
            <input type="text" placeholder="Search student..." className="w-full pl-9 pr-4 py-2 bg-white border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>
        </div>
        
        <div className="p-4 bg-surface-container-lowest border-b border-divider flex justify-between items-center text-sm">
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-success"></span> <span className="text-body-secondary">Present (4)</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-error"></span> <span className="text-body-secondary">Absent (1)</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-warning"></span> <span className="text-body-secondary">Late (1)</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-info"></span> <span className="text-body-secondary">Excused (1)</span>
             </div>
           </div>
           <div>
             <button className="text-primary font-medium hover:underline">Mark All Present</button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                <th className="py-4 px-6 font-semibold w-12">#</th>
                <th className="py-4 px-6 font-semibold">Student Name</th>
                <th className="py-4 px-6 font-semibold">ID</th>
                <th className="py-4 px-6 font-semibold text-center">Status</th>
                <th className="py-4 px-6 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {students.map((student, i) => (
                <tr key={i} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                  <td className="py-3 px-6 text-body-secondary">{i + 1}</td>
                  <td className="py-3 px-6">
                    <div className="font-medium text-on-surface">{student.name}</div>
                  </td>
                  <td className="py-3 px-6 text-body-secondary">{student.id}</td>
                  <td className="py-3 px-6">
                    <div className="flex justify-center gap-2">
                      <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${student.status === 'present' ? 'bg-success text-white shadow-md' : 'bg-surface-container-high text-icon-inactive hover:bg-border-light'}`} title="Present">
                        <Check className="w-5 h-5" />
                      </button>
                      <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${student.status === 'absent' ? 'bg-error text-white shadow-md' : 'bg-surface-container-high text-icon-inactive hover:bg-border-light'}`} title="Absent">
                        <X className="w-5 h-5" />
                      </button>
                      <button className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${student.status === 'late' ? 'bg-warning text-white shadow-md' : 'bg-surface-container-high text-icon-inactive hover:bg-border-light'}`} title="Late">
                        L
                      </button>
                      <button className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${student.status === 'excused' ? 'bg-info text-white shadow-md' : 'bg-surface-container-high text-icon-inactive hover:bg-border-light'}`} title="Excused">
                        E
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <input type="text" placeholder="Add note..." className="w-full bg-transparent border-b border-transparent hover:border-border-light focus:border-primary focus:outline-none py-1 text-sm transition-colors" defaultValue={student.status === 'excused' ? 'Medical leave' : ''} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
