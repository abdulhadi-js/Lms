import React from 'react';
import { FileText, Plus, CheckCircle, Clock, MoreHorizontal } from 'lucide-react';

const mockAssignments = [
  { id: 1, title: 'React Final Project', course: 'CS101 - Intro to CS', due: '2026-10-15', submissions: 24, total: 30, status: 'Active' },
  { id: 2, title: 'Essay on Leadership', course: 'MGT201 - Management', due: '2026-10-10', submissions: 28, total: 28, status: 'Grading' },
  { id: 3, title: 'Linear Algebra Quiz 2', course: 'MATH205 - Linear Algebra', due: '2026-09-30', submissions: 40, total: 40, status: 'Completed' },
];

export default function TeacherAssignments() {
  return (
    <div className="p-8 max-w-[1280px] mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#132a13] mb-2">Assignment Management</h1>
          <p className="text-[#5f5f5f]">Create, track, and grade student assignments.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#31572c] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(180deg, #3a6633 0%, #31572c 100%)' }}>
          <Plus className="w-5 h-5" />
          <span>Create Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {['Active Assignments', 'Needs Grading', 'Total Created'].map((title, i) => (
          <div key={i} className="bg-white rounded-[12px] border border-[#c6c6c6] p-5 relative overflow-hidden" style={{ boxShadow: '0 4px 12px rgba(19, 42, 19, 0.08)' }}>
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #90a955 0%, #ecf39e 100%)' }}></div>
            <p className="text-sm font-bold text-[#5f5f5f] mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-[#132a13]">{[4, 12, 45][i]}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[12px] border border-[#c6c6c6] overflow-hidden" style={{ boxShadow: '0 4px 12px rgba(19, 42, 19, 0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#31572c] text-white text-sm">
                <th className="p-4 font-semibold">Assignment Details</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Submissions</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[#444444]">
              {mockAssignments.map((assignment, index) => (
                <tr key={assignment.id} className={`border-b border-[#c6c6c6] hover:bg-[#eff3e7] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#fcfdf1]'}`}>
                  <td className="p-4">
                    <div className="font-bold text-[#132a13] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#4f772d]" />
                      {assignment.title}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#5f5f5f]">{assignment.course}</td>
                  <td className="p-4 text-sm font-medium text-[#31572c] flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {assignment.due}
                  </td>
                  <td className="p-4">
                    <div className="w-full bg-[#e4e4e4] rounded-full h-2 mb-1">
                      <div className="bg-[#90a955] h-2 rounded-full" style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-[#5f5f5f]">{assignment.submissions} / {assignment.total} submitted</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${assignment.status === 'Active' ? 'bg-[#e6ece2] text-[#4f772d]' : assignment.status === 'Grading' ? 'bg-[#faf1de] text-[#d9a441]' : 'bg-[#e2ebf0] text-[#3d6b8c]'}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-[#5f5f5f] hover:text-[#31572c] transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
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
