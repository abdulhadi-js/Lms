import React from 'react';
import { Award, BookOpen, ChevronDown, Download } from 'lucide-react';

const mockTranscript = [
  { term: 'Fall 2025', courses: [
    { code: 'CS101', name: 'Intro to CS', credits: 4, grade: 'A', points: 4.0 },
    { code: 'MATH205', name: 'Linear Algebra', credits: 3, grade: 'B+', points: 3.3 },
    { code: 'ENG102', name: 'Academic Writing', credits: 3, grade: 'A-', points: 3.7 },
  ], termGPA: 3.71 },
  { term: 'Spring 2025', courses: [
    { code: 'PHY101', name: 'Physics I', credits: 4, grade: 'B', points: 3.0 },
    { code: 'CS102', name: 'Data Structures', credits: 4, grade: 'A', points: 4.0 },
  ], termGPA: 3.50 },
];

export default function StudentTranscript() {
  return (
    <div className="p-8 max-w-[1280px] mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#132a13] mb-2">Unofficial Transcript</h1>
          <p className="text-[#5f5f5f]">Review your academic history and grades.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#ffffff] text-[#31572c] border border-[#31572c] px-4 py-2 rounded-lg hover:bg-[#eff3e7] transition-colors">
          <Download className="w-5 h-5" />
          <span>Download PDF</span>
        </button>
      </div>

      <div className="bg-[#132a13] rounded-[12px] p-6 mb-8 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#31572c] flex items-center justify-center border-2 border-[#90a955]">
            <Award className="w-8 h-8 text-[#ecf39e]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Cumulative GPA: 3.62</h2>
            <p className="text-[#ecf39e]">Total Credits Earned: 74</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="font-medium text-[#c6c6c6]">Student ID: 2026-0042</p>
          <p className="font-medium text-[#c6c6c6]">Program: B.S. Computer Science</p>
        </div>
      </div>

      <div className="space-y-6">
        {mockTranscript.map((termData, index) => (
          <div key={index} className="bg-white rounded-[12px] border border-[#c6c6c6] overflow-hidden" style={{ boxShadow: '0 4px 12px rgba(19, 42, 19, 0.08)' }}>
            <div className="p-4 border-b border-[#c6c6c6] bg-[#fefef9] flex items-center justify-between cursor-pointer hover:bg-[#eff3e7]">
              <div className="flex items-center gap-2 text-[#132a13] font-bold">
                <BookOpen className="w-5 h-5 text-[#4f772d]" />
                <span className="text-lg">{termData.term}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#31572c]">Term GPA: {termData.termGPA}</span>
                <ChevronDown className="w-5 h-5 text-[#5f5f5f]" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4f4f4] text-[#444444] text-sm">
                    <th className="p-3 font-semibold border-b border-[#c6c6c6]">Course Code</th>
                    <th className="p-3 font-semibold border-b border-[#c6c6c6]">Course Name</th>
                    <th className="p-3 font-semibold border-b border-[#c6c6c6]">Credits</th>
                    <th className="p-3 font-semibold border-b border-[#c6c6c6]">Grade</th>
                    <th className="p-3 font-semibold border-b border-[#c6c6c6]">Points</th>
                  </tr>
                </thead>
                <tbody className="text-[#444444]">
                  {termData.courses.map((course, idx) => (
                    <tr key={idx} className="border-b border-[#e4e4e4] last:border-0 hover:bg-[#fcfdf1]">
                      <td className="p-3 font-medium text-[#31572c]">{course.code}</td>
                      <td className="p-3">{course.name}</td>
                      <td className="p-3">{course.credits}</td>
                      <td className="p-3 font-bold text-[#132a13]">{course.grade}</td>
                      <td className="p-3">{course.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
