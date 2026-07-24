import React from 'react';
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, Users } from 'lucide-react';

const mockTimetable = [
  { id: 1, course: 'CS101 - Intro to CS', teacher: 'Dr. Turing', time: '09:00 AM - 10:30 AM', room: 'Room 201', days: ['Mon', 'Wed'] },
  { id: 2, course: 'MGT201 - Management', teacher: 'Prof. Drucker', time: '11:00 AM - 12:30 PM', room: 'Room 305', days: ['Tue', 'Thu'] },
  { id: 3, course: 'MATH205 - Linear Algebra', teacher: 'Dr. Noether', time: '02:00 PM - 03:30 PM', room: 'Hall B', days: ['Mon', 'Wed', 'Fri'] },
  { id: 4, course: 'ENG102 - Academic Writing', teacher: 'Dr. Woolf', time: '10:00 AM - 11:30 AM', room: 'Room 102', days: ['Tue', 'Thu'] },
];

export default function AdminTimetable() {
  return (
    <div className="p-8 max-w-[1280px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#132a13] mb-2">Timetable Scheduling</h1>
          <p className="text-[#5f5f5f]">Manage class schedules and allocate resources.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#31572c] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(180deg, #3a6633 0%, #31572c 100%)' }}>
          <Plus className="w-5 h-5" />
          <span>Add Schedule</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#c6c6c6] overflow-hidden" style={{ boxShadow: '0 4px 12px rgba(19, 42, 19, 0.08)' }}>
        <div className="p-4 border-b border-[#c6c6c6] bg-[#fefef9] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#132a13] font-bold">
            <Calendar className="w-5 h-5 text-[#4f772d]" />
            <span>Weekly Master Schedule</span>
          </div>
          <div className="flex gap-2">
            <select className="border border-[#c6c6c6] rounded-lg px-3 py-1.5 text-sm text-[#444444] outline-none focus:border-[#31572c]">
              <option>All Departments</option>
              <option>Computer Science</option>
              <option>Business</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#31572c] text-white text-sm">
                <th className="p-4 font-semibold">Course & Instructor</th>
                <th className="p-4 font-semibold">Timing</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Days</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[#444444]">
              {mockTimetable.map((slot, index) => (
                <tr key={slot.id} className={`border-b border-[#c6c6c6] hover:bg-[#eff3e7] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#fcfdf1]'}`}>
                  <td className="p-4">
                    <div className="font-bold text-[#132a13]">{slot.course}</div>
                    <div className="text-sm text-[#5f5f5f] flex items-center gap-1 mt-1">
                      <Users className="w-4 h-4" /> {slot.teacher}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-[#31572c] font-medium">
                      <Clock className="w-4 h-4" /> {slot.time}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-[#5f5f5f]">
                      <MapPin className="w-4 h-4" /> {slot.room}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {slot.days.map(day => (
                        <span key={day} className="px-2 py-1 text-xs font-bold rounded bg-[#ecf39e] text-[#132a13]">
                          {day}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="p-1.5 text-[#3d6b8c] hover:bg-[#e2ebf0] rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-[#b3423a] hover:bg-[#f5e2e0] rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
