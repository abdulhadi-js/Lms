"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { examsApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function ExamRunner() {
  const { id } = useParams();
  const router = useRouter();
  
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const examData = await examsApi.getExam(id as string);
        const ex = examData.data || examData;
        setExam(ex);
        setQuestions(ex.questions?.map((q: any) => q.question || q) || []);
        
        // Calculate remaining time
        const now = new Date().getTime();
        const end = new Date(ex.endTime).getTime();
        const maxDurationMs = ex.durationMinutes * 60 * 1000;
        
        // Ensure they don't get more time than the absolute end window
        const absoluteRemaining = end - now;
        const assignedTime = Math.min(maxDurationMs, absoluteRemaining);
        
        if (assignedTime <= 0) {
           toast.error('This exam has already ended.');
           router.push('/student/exams');
           return;
        }
        
        setTimeLeft(Math.floor(assignedTime / 1000)); // in seconds
      } catch (err) {
        toast.error('Failed to load exam details');
        router.push('/student/exams');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || submitted || loading) return;
    
    if (timeLeft <= 0) {
      toast.error('Time is up! Auto-submitting...');
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, loading]);

  const handleSelectOption = (qId: string, optionIdx: string) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    try {
      const res = await examsApi.submitExam(id as string, answers);
      const data = res.data || res;
      setSubmitted(true);
      setScore(data.score);
      toast.success('Exam submitted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-page-bg"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  if (!exam) return null;

  if (submitted) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-page-bg p-4">
        <div className="bg-surface rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-divider">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Exam Completed!</h2>
          <p className="text-body-secondary mb-6">Your submission has been recorded.</p>
          
          {score !== null && (
            <div className="bg-surface-container py-4 rounded-xl mb-6 border border-border-light">
              <div className="text-sm font-medium text-body-secondary">Your Score</div>
              <div className="text-3xl font-black text-primary">{score} / {exam.totalMarks}</div>
            </div>
          )}
          
          <button onClick={() => router.push('/student/exams')} className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="flex flex-col h-screen bg-page-bg">
      {/* CBT Header */}
      <header className="bg-surface border-b border-divider h-16 shrink-0 flex items-center justify-between px-6 sticky top-0 z-50">
        <div>
          <h1 className="font-bold text-lg text-on-surface line-clamp-1">{exam.title}</h1>
          <p className="text-xs text-body-secondary">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        
        <div className={`flex items-center gap-2 font-mono text-lg font-bold px-4 py-1.5 rounded-lg border ${timeLeft !== null && timeLeft < 300 ? 'bg-error/10 text-error border-error/20 animate-pulse' : 'bg-surface-container-low text-primary border-border-light'}`}>
          <Clock className="w-5 h-5" />
          {timeLeft !== null ? formatTime(timeLeft) : '00:00'}
        </div>
      </header>

      {/* Main Runner Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-3xl space-y-8 pb-24">
          
          {questions.length === 0 ? (
            <div className="bg-warning/10 border border-warning/20 p-6 rounded-xl flex items-start gap-3 text-warning-dark">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg">No questions found</h3>
                <p>This exam has no assigned questions. Please contact your instructor.</p>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-2xl border border-divider shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 md:p-10 border-b border-divider">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-primary/10 text-primary-fixed px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {currentQuestion?.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-body-secondary">{currentQuestion?.marks} Marks</span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-medium text-on-surface leading-relaxed">
                  {currentQuestion?.text}
                </h2>
              </div>
              
              <div className="p-6 md:p-10 bg-surface-container-lowest space-y-3">
                {currentQuestion?.type === 'MCQ' && (currentQuestion.options || []).map((opt: string, idx: number) => {
                   const isSelected = answers[currentQuestion.id] === idx.toString();
                   return (
                     <label 
                       key={idx} 
                       className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border-light hover:border-primary/40 bg-surface hover:bg-surface-container-low'}`}
                     >
                       <input 
                         type="radio" 
                         name={`q-${currentQuestion.id}`} 
                         className="w-5 h-5 text-primary border-border-light focus:ring-primary focus:ring-offset-surface-container-lowest"
                         checked={isSelected}
                         onChange={() => handleSelectOption(currentQuestion.id, idx.toString())}
                       />
                       <span className={`ml-4 text-base ${isSelected ? 'text-primary font-medium' : 'text-on-surface'}`}>{opt}</span>
                     </label>
                   )
                })}

                {currentQuestion?.type === 'TRUE_FALSE' && ['True', 'False'].map((opt, idx) => {
                   const isSelected = answers[currentQuestion.id] === opt;
                   return (
                     <label 
                       key={idx} 
                       className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border-light hover:border-primary/40 bg-surface hover:bg-surface-container-low'}`}
                     >
                       <input 
                         type="radio" 
                         name={`q-${currentQuestion.id}`} 
                         className="w-5 h-5 text-primary border-border-light focus:ring-primary focus:ring-offset-surface-container-lowest"
                         checked={isSelected}
                         onChange={() => handleSelectOption(currentQuestion.id, opt)}
                       />
                       <span className={`ml-4 text-base ${isSelected ? 'text-primary font-medium' : 'text-on-surface'}`}>{opt}</span>
                     </label>
                   )
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          {questions.length > 0 && (
            <div className="flex justify-between items-center pt-4">
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-0 hover:bg-surface-container border border-divider bg-surface shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              
              {!isLast ? (
                <button 
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors bg-primary text-white shadow-md hover:opacity-90"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to submit your exam? You cannot change your answers after this.')) {
                      handleSubmit();
                    }
                  }}
                  disabled={submitting}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-black transition-colors bg-success text-white shadow-lg hover:bg-success/90 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Submit Exam
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-surface-container-high fixed bottom-0 left-0 z-50">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
