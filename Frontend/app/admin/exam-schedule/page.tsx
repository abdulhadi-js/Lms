"use client";
import { useState, useEffect } from 'react';
import { coursesApi, academicsApi } from '@/lib/api';
import { Printer, Plus } from 'lucide-react';

export default function ExamSchedulePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  
  useEffect(() => {
    // Mock classes for now since academicsApi might need specific methods, 
    // normally it would be academicsApi.listClasses()
    setClasses([
      { id: '9-a', name: '9-A' },
      { id: '9-b', name: '9-B' },
      { id: '10-a', name: '10-A' },
    ]);
    setSelectedClass('9-a');
    
    coursesApi.list().then(res => {
      setSubjects(res.data || res || []);
    }).catch(err => console.log(err));
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          table { border-collapse: collapse; }
          td, th { border: 1px solid #000; padding: 8px; }
          header, nav, aside { display: none !important; }
        }
      `}} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6 bg-white print:p-0 print:m-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 no-print">
          <div>
            <h2 className="text-3xl font-bold text-heading-on-light">Exam Date Sheet</h2>
            <p className="text-sm text-body-secondary mt-1">Schedule and print subject-wise exam dates for all classes.</p>
          </div>
          <div className="flex gap-2">
            <select 
              className="border border-border-light rounded-lg px-3 py-2 text-sm"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="border border-border-light rounded-lg px-3 py-2 text-sm">
              <option value="ALL">ALL</option>
              <option value="MONTHLY_TEST">MONTHLY_TEST</option>
              <option value="MID_TERM">MID_TERM</option>
              <option value="HALF_YEARLY">HALF_YEARLY</option>
              <option value="ANNUAL">ANNUAL</option>
            </select>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 flex items-center gap-2">
              <Plus className="w-4 h-4"/> Add Exam Date
            </button>
            <button onClick={() => window.print()} className="border border-border-light bg-surface px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container flex items-center gap-2">
              <Printer className="w-4 h-4"/> Print Date Sheet
            </button>
          </div>
        </div>

        <div className="border border-divider p-8 print:border-none print:p-0 bg-white">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold uppercase">EXAM DATE SHEET — Annual Examination 2025-2026</h1>
            <p className="text-lg mt-2">Class: {classes.find(c => c.id === selectedClass)?.name} | EduCore School</p>
          </div>

          <table className="w-full text-left border-collapse border border-black">
            <thead>
              <tr className="bg-gray-100 print:bg-gray-200">
                <th className="border border-black py-2 px-4 font-bold">Date</th>
                <th className="border border-black py-2 px-4 font-bold">Subject</th>
                <th className="border border-black py-2 px-4 font-bold">Time</th>
                <th className="border border-black py-2 px-4 font-bold">Duration</th>
                <th className="border border-black py-2 px-4 font-bold">Exam Hall</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black py-2 px-4">1 Apr</td>
                <td className="border border-black py-2 px-4">Urdu</td>
                <td className="border border-black py-2 px-4">9:00 AM</td>
                <td className="border border-black py-2 px-4">3 hrs</td>
                <td className="border border-black py-2 px-4">Hall A</td>
              </tr>
              <tr>
                <td className="border border-black py-2 px-4">3 Apr</td>
                <td className="border border-black py-2 px-4">English</td>
                <td className="border border-black py-2 px-4">9:00 AM</td>
                <td className="border border-black py-2 px-4">3 hrs</td>
                <td className="border border-black py-2 px-4">Hall A</td>
              </tr>
              <tr>
                <td className="border border-black py-2 px-4">5 Apr</td>
                <td className="border border-black py-2 px-4">Mathematics</td>
                <td className="border border-black py-2 px-4">9:00 AM</td>
                <td className="border border-black py-2 px-4">3 hrs</td>
                <td className="border border-black py-2 px-4">Hall B</td>
              </tr>
              <tr>
                <td className="border border-black py-2 px-4">7 Apr</td>
                <td className="border border-black py-2 px-4">Physics</td>
                <td className="border border-black py-2 px-4">9:00 AM</td>
                <td className="border border-black py-2 px-4">3 hrs</td>
                <td className="border border-black py-2 px-4">Hall B</td>
              </tr>
              <tr>
                <td className="border border-black py-2 px-4">9 Apr</td>
                <td className="border border-black py-2 px-4">Chemistry</td>
                <td className="border border-black py-2 px-4">9:00 AM</td>
                <td className="border border-black py-2 px-4">3 hrs</td>
                <td className="border border-black py-2 px-4">Hall A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
