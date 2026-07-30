"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, Clock, PlayCircle, Loader2, BookOpen } from 'lucide-react';
import { coursesApi, examsApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function ExamsManagement() {
  const [activeTab, setActiveTab] = useState<'BANK' | 'EXAMS'>('EXAMS');
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedExamForAssign, setSelectedExamForAssign] = useState<any>(null);
  
  const [saving, setSaving] = useState(false);

  // Question Form
  const [qForm, setQForm] = useState({
    text: '', type: 'MCQ', options: ['','','',''], correctAnswer: '0', 
    chapter: '', topic: '', difficulty: 'MEDIUM', marks: 1
  });

  // Exam Form
  const [eForm, setEForm] = useState({
    title: '', durationMinutes: 60, totalMarks: 100,
    startTime: '', endTime: ''
  });
  
  // Assign Questions
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const cData = await coursesApi.list();
        setCourses(cData);
        if (cData.length > 0) setSelectedCourse(cData[0].id);
      } catch (e) {
        toast.error('Failed to load courses');
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (selectedCourse) loadData();
  }, [selectedCourse, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'BANK') {
        const qData = await examsApi.getQuestions(selectedCourse);
        setQuestions(qData.data || qData || []);
      } else {
        const eData = await examsApi.getExams(selectedCourse);
        setExams(eData.data || eData || []);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (idx: number, val: string) => {
    const newOptions = [...qForm.options];
    newOptions[idx] = val;
    setQForm({ ...qForm, options: newOptions });
  };

  const saveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await examsApi.createQuestion({
        ...qForm,
        courseId: selectedCourse,
        options: qForm.options.filter(o => o.trim() !== ''),
        correctAnswer: qForm.options[parseInt(qForm.correctAnswer)] || qForm.correctAnswer // if true/false
      });
      toast.success('Question added to bank');
      setIsQuestionModalOpen(false);
      setQForm({text: '', type: 'MCQ', options: ['','','',''], correctAnswer: '0', chapter: '', topic: '', difficulty: 'MEDIUM', marks: 1});
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const saveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await examsApi.createExam({
        ...eForm,
        courseId: selectedCourse,
        startTime: new Date(eForm.startTime).toISOString(),
        endTime: new Date(eForm.endTime).toISOString()
      });
      toast.success('Exam drafted successfully');
      setIsExamModalOpen(false);
      setEForm({ title: '', durationMinutes: 60, totalMarks: 100, startTime: '', endTime: '' });
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to draft exam');
    } finally {
      setSaving(false);
    }
  };

  const openAssignModal = async (exam: any) => {
    setSelectedExamForAssign(exam);
    try {
      const qData = await examsApi.getQuestions(selectedCourse);
      setQuestions(qData.data || qData || []);
      
      // Auto-check already assigned questions if we had them in exam.questions
      const alreadyAssigned = (exam.questions || []).map((q: any) => q.questionId || q.id);
      setSelectedQuestionIds(alreadyAssigned);
      setIsAssignModalOpen(true);
    } catch (err) {
      toast.error('Failed to load question bank');
    }
  };

  const toggleQuestionSelection = (qId: string) => {
    if (selectedQuestionIds.includes(qId)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== qId));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, qId]);
    }
  };

  const saveAssignments = async () => {
    setSaving(true);
    try {
      await examsApi.assignQuestions(selectedExamForAssign.id, selectedQuestionIds);
      toast.success('Questions assigned successfully');
      setIsAssignModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign questions');
    } finally {
      setSaving(false);
    }
  };

  const publishExam = async (examId: string) => {
    if (!confirm('Are you sure you want to publish? Students will be able to take it during the scheduled window.')) return;
    try {
      await examsApi.publishExam(examId);
      toast.success('Exam Published!');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Examination & CBT</h2>
          <p className="text-sm text-body-secondary mt-1">Build question banks and schedule online tests.</p>
        </div>
        
        <select 
          value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}
          className="bg-surface border border-border-light rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
        >
          {courses.length === 0 && <option>No Courses Available</option>}
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <div className="flex justify-between items-center border-b border-divider mb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('EXAMS')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'EXAMS' ? 'border-primary text-primary' : 'border-transparent text-body-secondary hover:text-on-surface'
            }`}
          >
            Online Exams
          </button>
          <button
            onClick={() => setActiveTab('BANK')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'BANK' ? 'border-primary text-primary' : 'border-transparent text-body-secondary hover:text-on-surface'
            }`}
          >
            Question Bank
          </button>
        </div>
        <div>
          {activeTab === 'EXAMS' ? (
            <button onClick={() => setIsExamModalOpen(true)} className="flex items-center gap-2 primary-gradient text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-all">
              <Plus className="w-4 h-4" /> Create Exam
            </button>
          ) : (
            <button onClick={() => setIsQuestionModalOpen(true)} className="flex items-center gap-2 primary-gradient text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-all">
              <Plus className="w-4 h-4" /> Add Question
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : activeTab === 'EXAMS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {exams.length === 0 ? (
            <div className="col-span-full py-12 text-center text-body-secondary border border-dashed border-divider rounded-xl bg-surface">
              No exams found for this course.
            </div>
          ) : exams.map((exam: any) => (
            <div key={exam.id} className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden flex flex-col">
              <div className={`p-4 border-b border-divider flex justify-between items-center ${exam.status === 'PUBLISHED' ? 'bg-success/5' : 'bg-surface-container-low'}`}>
                <div className="font-bold text-on-surface truncate pr-2">{exam.title}</div>
                {exam.status === 'PUBLISHED' ? (
                  <span className="px-2 py-1 bg-success text-white text-xs font-bold rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> PUBLISHED</span>
                ) : (
                  <span className="px-2 py-1 bg-warning/20 text-warning text-xs font-bold rounded">DRAFT</span>
                )}
              </div>
              <div className="p-4 space-y-3 flex-grow text-sm text-body-secondary">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-icon-inactive" /> {exam.durationMinutes} Minutes</div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-icon-inactive" /> {exam.totalMarks} Total Marks</div>
                <div className="flex items-center gap-2"><PlayCircle className="w-4 h-4 text-icon-inactive" /> {new Date(exam.startTime).toLocaleString()}</div>
                <div className="pt-2 border-t border-divider mt-2">
                  <span className="font-medium text-on-surface">Assigned Questions:</span> {(exam.questions || []).length}
                </div>
              </div>
              {exam.status === 'DRAFT' && (
                <div className="p-3 bg-surface-container-lowest border-t border-divider flex justify-between gap-2">
                  <button onClick={() => openAssignModal(exam)} className="flex-1 py-1.5 border border-primary text-primary rounded text-xs font-semibold hover:bg-primary/5 transition-colors">Assign Questions</button>
                  <button onClick={() => publishExam(exam.id)} className="flex-1 py-1.5 bg-success text-white rounded text-xs font-semibold hover:bg-success/90 transition-colors">Publish</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                <th className="py-4 px-6 font-semibold w-12">#</th>
                <th className="py-4 px-6 font-semibold w-1/2">Question</th>
                <th className="py-4 px-6 font-semibold">Type</th>
                <th className="py-4 px-6 font-semibold">Topic</th>
                <th className="py-4 px-6 font-semibold">Diff.</th>
                <th className="py-4 px-6 font-semibold">Marks</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {questions.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-body-secondary">Question bank is empty for this course.</td></tr>
              ) : questions.map((q, i) => (
                <tr key={q.id} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                  <td className="py-3 px-6 text-body-secondary">{i+1}</td>
                  <td className="py-3 px-6 font-medium text-on-surface">
                    {q.text}
                    {q.type === 'MCQ' && (
                      <div className="text-xs text-body-secondary mt-1 font-normal">
                        Options: {(q.options || []).join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-6"><span className="px-2 py-1 bg-surface-container rounded text-xs font-medium border border-border-light">{q.type}</span></td>
                  <td className="py-3 px-6 text-body-secondary">{q.chapter} - {q.topic}</td>
                  <td className="py-3 px-6">
                    <span className={`text-xs font-bold ${q.difficulty === 'HARD' ? 'text-error' : q.difficulty === 'MEDIUM' ? 'text-warning' : 'text-success'}`}>{q.difficulty}</span>
                  </td>
                  <td className="py-3 px-6 font-bold">{q.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-divider flex justify-between items-center bg-surface shrink-0">
              <h3 className="text-lg font-bold text-heading-on-light flex items-center gap-2">
                Assign Questions to: {selectedExamForAssign?.title}
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors"><Trash2 className="h-5 w-5 hidden" />&times;</button>
            </div>
            
            <div className="p-0 overflow-y-auto flex-grow bg-surface-container-lowest">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-surface z-10 border-b border-divider shadow-sm">
                  <tr className="text-body-secondary text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">Select</th>
                    <th className="py-3 px-4 font-semibold">Question</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Marks</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {questions.map((q) => (
                    <tr key={q.id} className="border-b border-border-light hover:bg-surface transition-colors cursor-pointer" onClick={() => toggleQuestionSelection(q.id)}>
                      <td className="py-3 px-4 text-center">
                        <input type="checkbox" checked={selectedQuestionIds.includes(q.id)} readOnly className="w-4 h-4 text-primary rounded border-border-light focus:ring-primary cursor-pointer" />
                      </td>
                      <td className="py-3 px-4 text-on-surface font-medium">{q.text}</td>
                      <td className="py-3 px-4 text-body-secondary">{q.type}</td>
                      <td className="py-3 px-4 font-bold">{q.marks}</td>
                    </tr>
                  ))}
                  {questions.length === 0 && <tr><td colSpan={4} className="py-8 text-center">No questions available in the bank.</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-divider bg-surface flex justify-between items-center shrink-0">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{selectedQuestionIds.length} Selected</span>
              <div className="flex gap-3">
                <button onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-body-secondary hover:bg-surface-container rounded-lg transition-colors">Cancel</button>
                <button onClick={saveAssignments} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-divider flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold">Add Question</h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="text-icon-inactive hover:text-error">&times;</button>
            </div>
            <form onSubmit={saveQuestion} className="p-5 space-y-4 overflow-y-auto flex-grow">
              <div>
                <label className="block text-sm font-medium mb-1">Question Text</label>
                <textarea required value={qForm.text} onChange={e => setQForm({...qForm, text: e.target.value})} className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={qForm.type} onChange={e => setQForm({...qForm, type: e.target.value})} className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
                    <option value="MCQ">Multiple Choice</option>
                    <option value="TRUE_FALSE">True / False</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Marks</label>
                  <input type="number" min="1" required value={qForm.marks} onChange={e => setQForm({...qForm, marks: Number(e.target.value)})} className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
              </div>

              {qForm.type === 'MCQ' && (
                <div className="space-y-2 p-3 bg-surface-container-lowest rounded-lg border border-border-light">
                  <label className="block text-sm font-medium">Options</label>
                  {[0,1,2,3].map(i => (
                    <input key={i} type="text" placeholder={`Option ${i+1}`} required={i<2} value={qForm.options[i]} onChange={e => handleOptionChange(i, e.target.value)} className="w-full bg-white border border-border-light rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary" />
                  ))}
                  <label className="block text-sm font-medium mt-3">Correct Option (0-3)</label>
                  <select value={qForm.correctAnswer} onChange={e => setQForm({...qForm, correctAnswer: e.target.value})} className="w-full bg-white border border-border-light rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary">
                    {[0,1,2,3].map(i => <option key={i} value={i.toString()}>Option {i+1}</option>)}
                  </select>
                </div>
              )}
              {qForm.type === 'TRUE_FALSE' && (
                 <div className="space-y-2 p-3 bg-surface-container-lowest rounded-lg border border-border-light">
                   <label className="block text-sm font-medium">Correct Answer</label>
                   <select value={qForm.correctAnswer} onChange={e => setQForm({...qForm, correctAnswer: e.target.value})} className="w-full bg-white border border-border-light rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary">
                     <option value="True">True</option>
                     <option value="False">False</option>
                   </select>
                 </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Chapter</label>
                  <input type="text" value={qForm.chapter} onChange={e => setQForm({...qForm, chapter: e.target.value})} className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <select value={qForm.difficulty} onChange={e => setQForm({...qForm, difficulty: e.target.value})} className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
                    <option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option>
                  </select>
                </div>
              </div>
            </form>
            <div className="p-4 border-t border-divider flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsQuestionModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-surface-container rounded-lg">Cancel</button>
              <button onClick={saveQuestion} disabled={saving} className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 flex items-center">{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Question</button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-divider flex justify-between items-center">
              <h3 className="text-lg font-bold">Create Online Exam</h3>
              <button onClick={() => setIsExamModalOpen(false)} className="text-icon-inactive hover:text-error">&times;</button>
            </div>
            <form onSubmit={saveExam} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Exam Title</label>
                <input type="text" required value={eForm.title} onChange={e => setEForm({...eForm, title: e.target.value})} placeholder="Midterm Exam" className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (Mins)</label>
                  <input type="number" required value={eForm.durationMinutes} onChange={e => setEForm({...eForm, durationMinutes: Number(e.target.value)})} className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Total Marks</label>
                  <input type="number" required value={eForm.totalMarks} onChange={e => setEForm({...eForm, totalMarks: Number(e.target.value)})} className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Time Window</label>
                <input type="datetime-local" required value={eForm.startTime} onChange={e => setEForm({...eForm, startTime: e.target.value})} className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time Window</label>
                <input type="datetime-local" required value={eForm.endTime} onChange={e => setEForm({...eForm, endTime: e.target.value})} className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="pt-4 border-t border-divider flex justify-end gap-3">
                <button type="button" onClick={() => setIsExamModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-surface-container rounded-lg">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 flex items-center">{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Draft Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
