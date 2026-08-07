"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { coursesApi, enrollmentsApi, assignmentsApi, marksApi } from '@/lib/api';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef, getSortedRowModel, SortingState } from '@tanstack/react-table';

export default function TeacherGradebook() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'GRADEBOOK' | 'EXAM_ENTRY'>('GRADEBOOK');
  const [examFormData, setExamFormData] = useState({
    examType: 'MONTHLY_TEST',
    totalMarks: 100,
    passingMarks: 40,
    examDate: new Date().toISOString().split('T')[0]
  });
  
  const getPakistaniGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    if (percentage >= 40) return 'E';
    return 'F';
  };
  
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
      } catch (err: any) {
        // B13 FIX: show error state via toast
        toast.error(err?.message || 'Failed to load courses.');
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

      const courseStudents = (Array.isArray(enrollData) ? enrollData : [])
        .filter((e: any) => e.course?.id === courseId && e.status === 'ACTIVE' && e.student)
        .map((e: any) => e.student);

      const courseAssignments = (Array.isArray(assignData) ? assignData : [])
        .filter((a: any) => a.courseId === courseId);

      setStudents(courseStudents);
      setAssignments(courseAssignments);
      setMarks(Array.isArray(marksData) ? marksData : []);
    } catch (err: any) {
      // B13 FIX: surface error to user via toast
      toast.error(err?.message || 'Failed to load gradebook data.');
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
          await marksApi.updateMark(change.markId, { score: change.score });
        }
      });

      await Promise.all(promises);
      await loadGradebookData(selectedCourse);
      // B12 FIX: replace alert() with toast
      toast.success(`${Object.keys(pendingChanges).length} grade(s) saved successfully!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save grades. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // B11 FIX: CSV export of gradebook data
  const handleExport = () => {
    if (filteredStudents.length === 0) {
      toast.error('No students to export.');
      return;
    }
    const courseName = courses.find(c => c.id === selectedCourse)?.title || 'gradebook';
    const headers = ['Student Name', 'Email', ...assignments.map((a: any) => `${a.title} (/${a.maxMarks || 100})`), 'Total (%)', 'Grade'];
    const rows = filteredStudents.map((student: any) => {
      const totalStr = calculateTotal(student.id);
      const grade = getGrade(parseFloat(totalStr));
      const scores = assignments.map((a: any) => {
        const pending = pendingChanges[`${student.id}_${a.id}`];
        if (pending) return pending.score;
        const m = marks.find((m: any) => m.studentId === student.id && m.component === a.id);
        return m ? m.score : '';
      });
      return [`${student.firstName} ${student.lastName}`, student.email || '', ...scores, totalStr, grade];
    });
    const csv = [headers, ...rows].map(r => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gradebook-${courseName.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Gradebook exported as CSV!');
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

  const [sorting, setSorting] = useState<SortingState>([]);
  
  const columns = useMemo<ColumnDef<any>[]>(() => {
    const baseCols: ColumnDef<any>[] = [
      {
        accessorFn: row => `${row.firstName} ${row.lastName}`,
        id: 'student',
        header: 'Student',
        cell: info => {
          const student = info.row.original;
          return (
            <div>
              <div className="font-medium text-on-surface">{student.firstName} {student.lastName}</div>
              <div className="text-xs text-body-secondary">{student.email}</div>
            </div>
          );
        }
      }
    ];

    const assignmentCols: ColumnDef<any>[] = assignments.map(a => ({
      id: a.id,
      header: () => (
        <div className="flex flex-col items-center group cursor-pointer" title={a.title}>
          <span className="font-semibold text-sm text-heading-on-light group-hover:text-primary transition-colors max-w-[100px] truncate">{a.title}</span>
          <span className="text-xs text-body-secondary font-normal mt-0.5">Max: {a.maxMarks || 100} | W: {a.weightPercent || 10}%</span>
        </div>
      ),
      cell: info => {
        const student = info.row.original;
        const existingMark = marks.find((m: any) => m.studentId === student.id && m.component === a.id);
        const pending = pendingChanges[`${student.id}_${a.id}`];
        const displayVal = pending ? pending.score : (existingMark ? existingMark.score : '');
        return (
          <div className="flex justify-center">
            <input 
              type="number" 
              value={displayVal}
              onChange={(e) => handleMarkChange(student.id, a, e.target.value, existingMark)}
              className={`w-16 text-center border rounded px-1 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all ${
                pending ? 'bg-warning-bg/20 border-warning' : 'bg-surface-container-lowest border-border-light'
              }`}
              max={a.maxMarks || 100}
            />
          </div>
        );
      }
    }));

    const endCols: ColumnDef<any>[] = assignments.length > 0 ? [
      {
        id: 'total',
        header: 'Total (%)',
        accessorFn: row => parseFloat(calculateTotal(row.id)),
        cell: info => {
          const val = info.getValue() as number;
          return <div className="text-center font-bold text-on-surface">{val.toFixed(1)}%</div>;
        }
      },
      {
        id: 'grade',
        header: 'Final Grade',
        accessorFn: row => {
          const total = parseFloat(calculateTotal(row.id));
          return getGrade(total);
        },
        cell: info => {
          const grade = info.getValue() as string;
          return (
            <div className="text-center">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                grade === 'A' ? 'bg-success-bg text-success' :
                grade === 'B' ? 'bg-primary-fixed text-primary-container' :
                grade === 'C' ? 'bg-warning-bg text-warning' :
                grade === 'D' ? 'bg-error-bg text-error opacity-70' :
                'bg-error text-white'
              }`}>
                {grade}
              </span>
            </div>
          );
        }
      }
    ] : [];

    return [...baseCols, ...assignmentCols, ...endCols];
  }, [assignments, marks, pendingChanges]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredStudents,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-border-light bg-surface rounded-lg text-sm font-medium hover:bg-surface-container transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg w-fit mb-6">
        <button
          onClick={() => setActiveTab('GRADEBOOK')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${activeTab === 'GRADEBOOK' ? 'bg-surface shadow-sm text-primary' : 'text-body-secondary hover:text-primary'}`}
        >
          📊 Gradebook
        </button>
        <button
          onClick={() => setActiveTab('EXAM_ENTRY')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${activeTab === 'EXAM_ENTRY' ? 'bg-surface shadow-sm text-primary' : 'text-body-secondary hover:text-primary'}`}
        >
          📝 Exam Result Entry
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
        {activeTab === 'EXAM_ENTRY' ? (
          <div className="p-5">
            <div className="mb-6 border-b border-divider pb-6">
              <h3 className="text-xl font-bold text-heading-on-light mb-1">Paper-Based Exam Result Entry</h3>
              <p className="text-sm text-body-secondary mb-6">Enter marks obtained by students in written exams (Monthly Test, Mid-Term, Annual)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Exam Type</label>
                  <select
                    className="w-full bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={examFormData.examType}
                    onChange={(e) => setExamFormData({...examFormData, examType: e.target.value})}
                  >
                    <option value="MONTHLY_TEST">MONTHLY_TEST</option>
                    <option value="MID_TERM">MID_TERM</option>
                    <option value="HALF_YEARLY">HALF_YEARLY</option>
                    <option value="ANNUAL">ANNUAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Subject</label>
                  <select 
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={loading || courses.length === 0}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Total Marks</label>
                  <input
                    type="number"
                    className="w-full bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={examFormData.totalMarks}
                    onChange={(e) => setExamFormData({...examFormData, totalMarks: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Passing Marks (40%)</label>
                  <input
                    type="number"
                    className="w-full bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={examFormData.passingMarks}
                    onChange={(e) => setExamFormData({...examFormData, passingMarks: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Exam Date</label>
                  <input
                    type="date"
                    className="w-full bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={examFormData.examDate}
                    onChange={(e) => setExamFormData({...examFormData, examDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto border border-divider rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-body-secondary text-sm">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold">GR No.</th>
                    <th className="py-3 px-4 font-semibold">Marks Obtained</th>
                    <th className="py-3 px-4 font-semibold">Auto-Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider text-sm">
                  {students.map(student => {
                    const key = `exam_${student.id}`;
                    const score = pendingChanges[key]?.score;
                    let grade = '-';
                    let pct = 0;
                    if (score !== undefined && examFormData.totalMarks > 0) {
                      pct = (Number(score) / examFormData.totalMarks) * 100;
                      grade = getPakistaniGrade(pct);
                    }
                    
                    return (
                      <tr key={student.id} className="hover:bg-surface-container-lowest">
                        <td className="py-3 px-4 font-medium text-on-surface">{student.firstName} {student.lastName}</td>
                        <td className="py-3 px-4 text-body-secondary">{student.grNumber || '-'}</td>
                        <td className="py-3 px-4">
                          <input 
                            type="number"
                            value={score ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                const newChanges = {...pendingChanges};
                                delete newChanges[key];
                                setPendingChanges(newChanges);
                              } else {
                                setPendingChanges({
                                  ...pendingChanges,
                                  [key]: { score: parseFloat(val), isNew: true }
                                });
                              }
                            }}
                            className="w-24 border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder={`/ ${examFormData.totalMarks}`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          {score !== '' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${grade === 'F' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                              {grade}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={async () => {
                  setSaving(true);
                  try {
                    const promises = Object.entries(pendingChanges).filter(([k]) => k.startsWith('exam_')).map(async ([key, change]) => {
                      const studentId = key.replace('exam_', '');
                      await marksApi.enterMark({
                        studentId,
                        courseId: selectedCourse,
                        component: examFormData.examType,
                        score: change.score,
                        maxScore: examFormData.totalMarks,
                        weightPercent: 100
                      });
                    });
                    await Promise.all(promises);
                    toast.success('Exam results saved successfully');
                    
                    // clean up pending changes
                    const newChanges = {...pendingChanges};
                    Object.keys(newChanges).forEach(k => {
                      if (k.startsWith('exam_')) delete newChanges[k];
                    });
                    setPendingChanges(newChanges);
                  } catch (err: any) {
                    toast.error('Failed to save exam results');
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save All Results'}
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-body-secondary whitespace-nowrap">Course:</span>
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-surface border border-border-light rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64 font-semibold"
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
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4">
            {loading ? (
              <div className="p-8 text-center text-body-secondary">Loading gradebook...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-body-secondary">No students found.</div>
            ) : assignments.length === 0 ? (
              <div className="p-8 text-center text-body-secondary">Create assignments first to add grades.</div>
            ) : (
              filteredStudents.map((student) => {
                const totalStr = calculateTotal(student.id);
                const total = parseFloat(totalStr);
                const grade = getGrade(total);
                
                return (
                  <div key={student.id} className="bg-surface p-4 rounded-xl border border-divider shadow-sm relative">
                    <div className="flex justify-between items-start mb-4 pb-3 border-b border-divider">
                      <div>
                        <div className="font-bold text-on-surface">{student.firstName} {student.lastName}</div>
                        <div className="text-sm text-body-secondary">{student.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-body-secondary">Grade</div>
                        <div className="flex items-center gap-2 justify-end">
                          <span className="font-bold text-on-surface">{totalStr}%</span>
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                            grade === 'A' ? 'bg-success-bg text-success' :
                            grade === 'B' ? 'bg-primary-fixed text-primary-container' :
                            grade === 'C' ? 'bg-warning-bg text-warning' :
                            grade === 'D' ? 'bg-error-bg text-error opacity-70' :
                            'bg-error text-white'
                          }`}>
                            {grade}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {assignments.map(a => {
                        const existingMark = marks.find(m => m.studentId === student.id && m.component === a.id);
                        const pending = pendingChanges[`${student.id}_${a.id}`];
                        const displayVal = pending ? pending.score : (existingMark ? existingMark.score : '');
                        
                        return (
                          <div key={a.id} className="flex justify-between items-center">
                            <div className="text-sm">
                              <div className="font-medium text-on-surface max-w-[200px] truncate">{a.title}</div>
                              <div className="text-xs text-body-secondary">Max: {a.maxMarks || 100} | W: {a.weightPercent || 10}%</div>
                            </div>
                            <input 
                              type="number" 
                              value={displayVal}
                              onChange={(e) => handleMarkChange(student.id, a, e.target.value, existingMark)}
                              className={`w-20 text-center border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all ${
                                pending ? 'bg-warning-bg/20 border-warning' : 'bg-surface-container-lowest border-border-light'
                              }`}
                              max={a.maxMarks || 100}
                              placeholder="-"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table View */}
          <table className="hidden md:table w-full text-left border-collapse min-w-[800px]">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-surface-container-low border-b border-divider">
                  {headerGroup.headers.map((header, index) => (
                    <th 
                      key={header.id} 
                      onClick={header.column.getToggleSortingHandler()}
                      className={`py-4 px-4 font-semibold text-sm text-heading-on-light cursor-pointer select-none ${index === 0 ? 'sticky left-0 bg-surface-container-low z-10 shadow-[1px_0_0_var(--color-divider)]' : 'text-center'}`}
                    >
                      <div className={`flex items-center gap-1 ${index === 0 ? '' : 'justify-center'}`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={assignments.length + 3} className="p-8 text-center text-body-secondary">Loading gradebook...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={assignments.length + 3} className="p-8 text-center text-body-secondary">No students found.</td></tr>
              ) : assignments.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-body-secondary">Create assignments first to add columns to the gradebook.</td></tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-border-light hover:bg-surface transition-colors group">
                    {row.getVisibleCells().map((cell, index) => (
                      <td 
                        key={cell.id} 
                        className={`py-3 px-4 ${index === 0 ? 'sticky left-0 bg-surface z-10 shadow-[1px_0_0_var(--color-divider)]' : ''} ${cell.column.id === 'total' ? 'border-l border-divider bg-surface-container-lowest/50' : ''}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
