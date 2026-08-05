"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import { fetchAuthApi as fetchApi, academicsApi, coursesApi } from '@/lib/api';
import { Check, ChevronLeft, ChevronRight, User, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function NewAdmissionWizard() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    // Step 1: Student
    firstName: '',
    lastName: '',
    email: '',
    gender: 'Male',
    dateOfBirth: '',
    phone: '',
    // Step 2: Guardian & Extra
    fatherName: '',
    guardianName: '',
    motherName: '',
    fatherCnic: '',
    previousSchool: '',
    discountAmount: 0,
    // Step 3: Academics
    academicGroupId: '',
    courseId: '',
  });

  useEffect(() => {
    if (user) {
      Promise.all([
        coursesApi.list(),
        fetchApi(`/academic-groups${user.campusId ? `?campusId=${user.campusId}` : ''}`)
      ]).then(([coursesData, groupsData]) => {
        setCourses(coursesData?.data || coursesData || []);
        setGroups(groupsData || []);
      }).catch(err => toast.error('Failed to load academic data'));
    }
  }, [user]);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.gender) return toast.error('Please fill required student details');
    }
    if (step === 2) {
      if (!formData.fatherName) return toast.error('Father name is required');
    }
    setStep(s => Math.min(s + 1, 3));
  };
  
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!formData.courseId) return toast.error('Please select a class/course to enroll into');
    setLoading(true);
    try {
      await fetchApi('/enrollments/admission', {
        method: 'POST',
        body: JSON.stringify({ ...formData, campusId: user?.campusId })
      });
      toast.success('Admission complete! Student enrolled successfully.');
      router.push('/admin/enrollments');
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete admission');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Student', icon: User },
    { num: 2, title: 'Guardian', icon: Users },
    { num: 3, title: 'Academics', icon: BookOpen },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/enrollments" className="p-2 rounded-lg bg-surface border border-divider hover:bg-surface-container transition-colors">
          <ChevronLeft className="w-5 h-5 text-on-surface" />
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold text-on-surface">New Admission</h1>
          <p className="text-body-secondary mt-1">Enroll a new student into the system.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-surface brand-shadow rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-container-high -z-10 rounded-full" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          
          {steps.map(s => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${step >= s.num ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-body-secondary border-divider'}`}>
                {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-on-surface' : 'text-body-secondary'}`}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-surface brand-shadow rounded-xl p-8">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-on-surface mb-4 border-b border-divider pb-2">Student Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">First Name <span className="text-error">*</span></label>
                <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary" placeholder="First Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Last Name <span className="text-error">*</span></label>
                <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary" placeholder="Last Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Gender</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Date of Birth</label>
                <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Email Address (Optional)</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary" placeholder="student@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Student Phone (Optional)</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary" placeholder="03xx-xxxxxxx" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-on-surface mb-4 border-b border-divider pb-2">Guardian & Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Father's Name <span className="text-error">*</span></label>
                <input type="text" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary" placeholder="Father Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Father's CNIC (Optional)</label>
                <input type="text" value={formData.fatherCnic} onChange={e => setFormData({...formData, fatherCnic: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary" placeholder="xxxxx-xxxxxxx-x" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Mother's Name (Optional)</label>
                <input type="text" value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Guardian's Name (If not parents)</label>
                <input type="text" value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-on-surface mb-2">Previous School</label>
                <input type="text" value={formData.previousSchool} onChange={e => setFormData({...formData, previousSchool: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary" placeholder="Previous Institution Name" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-on-surface mb-2">Discount Amount (Flat Off)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-secondary font-medium">Rs.</span>
                  <input type="number" min="0" value={formData.discountAmount} onChange={e => setFormData({...formData, discountAmount: parseFloat(e.target.value) || 0})} className="w-full border border-divider rounded-lg pl-10 pr-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary" placeholder="0" />
                </div>
                <p className="text-xs text-body-secondary mt-2">Any special discount applied for siblings or scholarship.</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-on-surface mb-4 border-b border-divider pb-2">Academic Placement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Academic Group / Stream</label>
                <select value={formData.academicGroupId} onChange={e => setFormData({...formData, academicGroupId: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary">
                  <option value="">Select Stream...</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Class / Course <span className="text-error">*</span></label>
                <select value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary">
                  <option value="">Select Class...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title || c.name} ({c.code})</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-divider">
          <button 
            onClick={handleBack} 
            disabled={step === 1}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${step === 1 ? 'opacity-50 cursor-not-allowed bg-surface-container text-body-secondary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-divider'}`}
          >
            Back
          </button>
          
          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 primary-gradient text-white rounded-lg font-semibold hover:shadow-md transition-shadow ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Complete Admission'}
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
