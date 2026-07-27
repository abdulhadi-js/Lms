"use client";

import React, { useState, useEffect } from 'react';
import { Search, Download, Settings, FileText, CheckCircle, Save } from 'lucide-react';
import { coursesApi, enrollmentsApi, assignmentsApi, marksApi } from '@/lib/api';

export default function TeacherGradebook() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  
  // Track modified cells to show a save button
  const [pendingChanges, setPendingChanges] = useState<Record<string, { score: number, markId?: string, isNew: boolean }>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await coursesApi.list();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load courses', err);
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadGradebookData(selectedCourse);
    }
  }, [selectedCourse]);

  async function loadGradebookData(courseId: string) {
    setLoading(true);
    setPendingChanges({});
    try {
      const [enrollData, assignData, marksData] = await Promise.all([
        enrollmentsApi.list(),
        assignmentsApi.list(),
        marksApi.getGradebook(courseId)
      ]);
      
      const courseStudents = enrollData
        .filter((e: any) => e.course?.id === courseId && e.status === 'ENROLLED' && e.student)
        .map((e: any) => e.student);
        
      const courseAssignments = assignData.filter((a: any) => a.courseId === courseId);

      setStudents(courseStudents);
      setAssignments(courseAssignments);
      setMarks(marksData);
    } catch (err) {
      console.error('Failed to load gradebook', err);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkChange = (studentId: string, assignment: any, value: string, existingMark?: any) => {
    const key = `${studentId}_${assignment.id}`;
    if (value === '') {
      const newChanges = { ...pendingChanges };
      delete newChanges[key];
      setPendingChanges(newChanges);
      return;
    }
    
    setPendingChanges({
      ...pendingChanges,
      [key]: {
        score: parseFloat(value),
        markId: existingMark?.id,
        isNew: !existingMark
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const promises = Object.entries(pendingChanges).map(async ([key, change]) => {
        const [studentId, assignmentId] = key.split('_');
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) return;
        
        if (change.isNew) {
          await marksApi.enterMark({
            studentId,
            courseId: selectedCourse,
            component: assignment.id,
            score: change.score,
            maxScore: assignment.maxMarks || 100,
            weightPercent: assignment.weightPercent || 10
          });
        } else if (change.markId) {
          await marksApi.updateMark(change.markId, {
            score: change.score
          });
        }
      });
      
      await Promise.all(promises);
      await loadGradebookData(selectedCourse);
      alert('Grades saved successfully!');
    } catch (err) {
      console.error('Failed to save grades', err);
      alert('Failed to save grades');
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = (studentId: string) => {
    let earned = 0;
    assignments.forEach(a => {
      const key = `${studentId}_${a.id}`;
      let score = 0;
      if (pendingChanges[key]) {
        score = pendingChanges[key].score;
      } else {
        const m = marks.find(m => m.studentId === studentId && m.component === a.id);
        if (m) score = Number(m.score);
      }
      
      const max = a.maxMarks || 100;
      const weight = a.weightPercent || 10;
      if (max > 0) {
        earned += (score / max) * weight;
      }
    });
    return earned.toFixed(1);
  };

  const getGrade = (total: number) => {
    if (total >= 90) return 'A';
    if (total >= 80) return 'B';
    if (total >= 70) return 'C';
    if (total >= 60) return 'D';
    return 'F';
  };

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Gradebook</h2>
          <p className="text-sm text-body-secondary mt-1">Manage scores and academic performance.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {Object.keys(pendingChanges).length > 0 && (
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 border border-border-light bg-white rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
            <Download className="w-4 h-4" /> Export
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
              disabled={loading || courses.length === 0}
            >
              {courses.length === 0 ? (
                <option value="">No courses available</option>
              ) : (
                courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))
              )}
            </select>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-icon-inactive" />
              <input 
                type="text" 
                placeholder="Search student..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
              />
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
                    <div className="flex flex-col items-center group cursor-pointer" title={a.title}>
                      <span className="font-semibold text-sm text-heading-on-light group-hover:text-primary transition-colors max-w-[100px] truncate">{a.title}</span>
                      <span className="text-xs text-body-secondary font-normal mt-0.5">Max: {a.maxMarks || 100} | W: {a.weightPercent || 10}%</span>
                    </div>
                  </th>
                ))}
                {assignments.length > 0 && (
                  <>
                    <th className="py-4 px-4 font-semibold text-sm text-heading-on-light text-center border-l border-divider">Total (%)</th>
                    <th className="py-4 px-4 font-semibold text-sm text-heading-on-light text-center">Final Grade</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={assignments.length + 3} className="p-8 text-center text-body-secondary">Loading gradebook...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={assignments.length + 3} className="p-8 text-center text-body-secondary">No students found.</td></tr>
              ) : assignments.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-body-secondary">Create assignments first to add columns to the gradebook.</td></tr>
              ) : (
                filteredStudents.map((student, i) => {
                  const totalStr = calculateTotal(student.id);
                  const total = parseFloat(totalStr);
                  const grade = getGrade(total);
                  
                  return (
                    <tr key={student.id} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                      <td className="py-3 px-4 sticky left-0 bg-white group-even:bg-surface-container-low z-10 shadow-[1px_0_0_var(--color-divider)]">
                        <div className="font-medium text-on-surface">{student.firstName} {student.lastName}</div>
                        <div className="text-xs text-body-secondary">{student.email}</div>
                      </td>
                      {assignments.map(a => {
                        const existingMark = marks.find(m => m.studentId === student.id && m.component === a.id);
                        const pending = pendingChanges[`${student.id}_${a.id}`];
                        const displayVal = pending ? pending.score : (existingMark ? existingMark.score : '');
                        
                        return (
                        <td key={a.id} className="py-3 px-4 text-center">
                          <input 
                            type="number" 
                            value={displayVal}
                            onChange={(e) => handleMarkChange(student.id, a, e.target.value, existingMark)}
                            className={`w-16 text-center border rounded px-1 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all ${
                              pending ? 'bg-warning-bg/20 border-warning' : 'bg-surface-container-lowest border-border-light'
                            }`}
                            max={a.maxMarks || 100}
                          />
                        </td>
                      )})}
                      <td className="py-3 px-4 text-center font-bold text-on-surface border-l border-divider bg-surface-container-lowest/50">
                        {totalStr}%
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
