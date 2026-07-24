"use client";

import React, { useState } from 'react';

export default function MyGrades() {
  const [openSem1, setOpenSem1] = useState(true);
  const [openSem2, setOpenSem2] = useState(false);

  return (
    <div className="pt-8 px-4 md:px-8 space-y-8 max-w-[1280px] mx-auto w-full pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[28px] font-bold text-evergreen">My Academic Record</h1>
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#31572c] to-[#4f772d] text-white px-6 py-3 rounded-lg text-[16px] font-medium shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined">download</span>
          Download Transcript (PDF)
        </button>
      </div>

      {/* GPA SUMMARY BANNER */}
      <div className="rounded-xl p-8 shadow-[0_4px_6px_-1px_rgba(19,42,19,0.08),0_2px_4px_-1px_rgba(19,42,19,0.04)] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden bg-gradient-to-br from-[#4f772d] via-[#90a955] to-[#ecf39e]">
        {/* Decorative background shapes */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-evergreen opacity-10 rounded-full blur-2xl"></div>
        
        <div className="flex flex-col z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-[48px] font-bold leading-tight">CGPA: 3.62</span>
            <span className="text-[16px] opacity-80">Out of 4.0</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center z-10 border-l border-white/20 pl-0 md:pl-8 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-white/20">
          <span className="text-[22px] font-semibold">Semester 1 GPA: 3.75</span>
          <span className="text-[16px] opacity-90 mt-1">Total Credits: 18</span>
        </div>
        
        {/* Animated Gauge */}
        <div className="relative w-32 h-32 z-10 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="8"></circle>
            {/* Fill (Calculated for 3.62/4.0 = ~90.5%) */}
            <circle 
              className="transition-all duration-1000 ease-out" 
              cx="50" cy="50" fill="none" r="45" 
              stroke="url(#gauge-gradient)" 
              strokeDasharray="282.7" 
              strokeDashoffset="26.8" 
              strokeWidth="8"
            ></circle>
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#90a955"></stop>
                <stop offset="100%" stopColor="#132A13"></stop>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold">3.62</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Gradebook */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SEMESTER ACCORDION 1 */}
          <div className="bg-white rounded-xl border border-divider shadow-[0_4px_6px_-1px_rgba(19,42,19,0.08),0_2px_4px_-1px_rgba(19,42,19,0.04)] overflow-hidden">
            {/* Top Accent */}
            <div className="h-1 w-full bg-gradient-to-r from-success to-primary-container"></div>
            
            {/* Accordion Header */}
            <button 
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-surface-bright transition-colors text-left"
              onClick={() => setOpenSem1(!openSem1)}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-[16px] font-semibold text-evergreen">Semester 1 — 2026</h2>
                <span className="bg-[#eff3e7] text-[#4f5d2f] px-3 py-1 rounded-full text-sm font-medium">Semester GPA: 3.75</span>
                <span className="text-body-secondary text-sm">18 Credits</span>
              </div>
              <span className={`material-symbols-outlined text-icon-inactive transition-transform duration-300 ${openSem1 ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            
            {/* Accordion Content */}
            <div className={`transition-all duration-300 overflow-hidden ${openSem1 ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="overflow-x-auto border-t border-divider">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-primary-container text-white">
                    <tr>
                      <th className="px-6 py-4 font-medium">Course</th>
                      <th className="px-6 py-4 font-medium text-center">Midterm</th>
                      <th className="px-6 py-4 font-medium text-center">Assignments</th>
                      <th className="px-6 py-4 font-medium text-center">Final</th>
                      <th className="px-6 py-4 font-medium text-center">Total</th>
                      <th className="px-6 py-4 font-medium text-center">Grade</th>
                      <th className="px-6 py-4 font-medium text-center">Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light text-[14px]">
                    <tr className="bg-white hover:bg-[#eff3e7] transition-colors">
                      <td className="px-6 py-4 font-medium text-evergreen">Advanced Calculus MATH-301</td>
                      <td className="px-6 py-4 text-center">28/30</td>
                      <td className="px-6 py-4 text-center">19/20</td>
                      <td className="px-6 py-4 text-center">48/50</td>
                      <td className="px-6 py-4 text-center font-medium">95</td>
                      <td className="px-6 py-4 text-center"><span className="bg-success-bg text-[#375320] font-bold px-2 py-1 rounded">A</span></td>
                      <td className="px-6 py-4 text-center text-body-secondary">4</td>
                    </tr>
                    <tr className="bg-[#fcfdf1] hover:bg-[#eff3e7] transition-colors">
                      <td className="px-6 py-4 font-medium text-evergreen">Data Structures CS-202</td>
                      <td className="px-6 py-4 text-center">25/30</td>
                      <td className="px-6 py-4 text-center">18/20</td>
                      <td className="px-6 py-4 text-center">42/50</td>
                      <td className="px-6 py-4 text-center font-medium">85</td>
                      <td className="px-6 py-4 text-center"><span className="bg-[#eff3e7] text-[#4f5d2f] px-2 py-1 rounded font-medium">B</span></td>
                      <td className="px-6 py-4 text-center text-body-secondary">4</td>
                    </tr>
                    <tr className="bg-white hover:bg-[#eff3e7] transition-colors">
                      <td className="px-6 py-4 font-medium text-evergreen">Physics II PHYS-201</td>
                      <td className="px-6 py-4 text-center">29/30</td>
                      <td className="px-6 py-4 text-center">20/20</td>
                      <td className="px-6 py-4 text-center">49/50</td>
                      <td className="px-6 py-4 text-center font-medium">98</td>
                      <td className="px-6 py-4 text-center"><span className="bg-success-bg text-[#375320] font-bold px-2 py-1 rounded">A</span></td>
                      <td className="px-6 py-4 text-center text-body-secondary">4</td>
                    </tr>
                    <tr className="bg-[#fcfdf1] hover:bg-[#eff3e7] transition-colors text-body-secondary italic">
                      <td className="px-6 py-4 font-medium text-evergreen not-italic">Literature LIT-101</td>
                      <td className="px-6 py-4 text-center">22/30</td>
                      <td className="px-6 py-4 text-center">15/20</td>
                      <td className="px-6 py-4 text-center text-placeholder">Pending</td>
                      <td className="px-6 py-4 text-center text-placeholder">-</td>
                      <td className="px-6 py-4 text-center"><span className="bg-warning-bg text-[#8a6521] px-2 py-1 rounded not-italic text-xs">In Progress</span></td>
                      <td className="px-6 py-4 text-center not-italic">3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SEMESTER ACCORDION 2 */}
          <div className="bg-white rounded-xl border border-divider shadow-[0_4px_6px_-1px_rgba(19,42,19,0.08),0_2px_4px_-1px_rgba(19,42,19,0.04)] overflow-hidden">
            <div className="h-1 w-full bg-surface-container-high"></div>
            <button 
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-surface-bright transition-colors text-left"
              onClick={() => setOpenSem2(!openSem2)}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-[16px] font-semibold text-evergreen">Semester 2 — 2025</h2>
                <span className="bg-surface-container text-body-secondary px-3 py-1 rounded-full text-sm font-medium">Semester GPA: 3.50</span>
                <span className="text-body-secondary text-sm">16 Credits</span>
              </div>
              <span className={`material-symbols-outlined text-icon-inactive transition-transform duration-300 ${openSem2 ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            <div className={`transition-all duration-300 overflow-hidden ${openSem2 ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 text-center text-body-secondary text-[14px]">
                Past semester details hidden for brevity in this preview.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Charts & Progress */}
        <div className="space-y-6">
          
          {/* Current Semester Progress */}
          <div className="bg-white rounded-xl border border-divider shadow-[0_4px_6px_-1px_rgba(19,42,19,0.08),0_2px_4px_-1px_rgba(19,42,19,0.04)] p-6">
            <h3 className="text-[20px] font-semibold text-evergreen mb-4">Current Progress</h3>
            
            <div className="space-y-6">
              {/* Course 1 */}
              <div>
                <h4 className="text-sm font-semibold text-evergreen mb-2">Literature LIT-101</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-xs">
                    <span className="w-20 text-body-secondary">Midterm</span>
                    <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden mx-2">
                      <div className="bg-gradient-to-r from-success to-primary-container h-full" style={{ width: '73%' }}></div>
                    </div>
                    <span className="w-10 text-right">22/30</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-20 text-body-secondary">Assignments</span>
                    <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden mx-2">
                      <div className="bg-gradient-to-r from-success to-primary-container h-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="w-10 text-right">15/20</span>
                  </div>
                  <div className="flex items-center text-xs opacity-60">
                    <span className="w-20 text-body-secondary">Final</span>
                    <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden mx-2">
                      <div className="bg-border-light h-full" style={{ width: '0%' }}></div>
                    </div>
                    <span className="w-10 text-right">-</span>
                  </div>
                  <p className="text-[11px] text-icon-inactive italic text-right mt-1">Final grade pending</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-divider"></div>

              {/* Course 2 */}
              <div>
                <h4 className="text-sm font-semibold text-evergreen mb-2">Advanced Calculus MATH-301</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-xs">
                    <span className="w-20 text-body-secondary">Midterm</span>
                    <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden mx-2">
                      <div className="bg-gradient-to-r from-success to-primary-container h-full" style={{ width: '93%' }}></div>
                    </div>
                    <span className="w-10 text-right">28/30</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-20 text-body-secondary">Assignments</span>
                    <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden mx-2">
                      <div className="bg-gradient-to-r from-success to-primary-container h-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="w-10 text-right">19/20</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-20 text-body-secondary">Final</span>
                    <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden mx-2">
                      <div className="bg-gradient-to-r from-success to-primary-container h-full" style={{ width: '96%' }}></div>
                    </div>
                    <span className="w-10 text-right">48/50</span>
                  </div>
                  <p className="text-[11px] text-[#375320] font-medium text-right mt-1">Grade Finalized: A</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
