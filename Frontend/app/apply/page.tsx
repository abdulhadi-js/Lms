"use client";
import { GraduationCap, BookOpen, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { useState, useEffect } from 'react';
import { enrollmentsApi, academicsApi, coursesApi } from '@/lib/api';

export default function ApplyPage() {
  const [campuses, setCampuses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentLastName: '',
    dob: '',
    gender: 'MALE',
    fatherName: '',
    fatherCnic: '',
    email: '',
    phone: '',
    previousSchool: '',
    campusId: '',
    desiredClassId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchCampuses() {
      try {
        const data = await academicsApi.getPublicCampuses();
        setCampuses(data);
      } catch (err) {
        console.error('Failed to load campuses', err);
      }
    }
    fetchCampuses();
  }, []);

  useEffect(() => {
    async function fetchClasses() {
      if (!formData.campusId) {
        setClasses([]);
        return;
      }
      try {
        const data = await academicsApi.getPublicClasses(formData.campusId);
        setClasses(data);
      } catch (err) {
        console.error('Failed to load classes', err);
      }
    }
    fetchClasses();
  }, [formData.campusId]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.studentFirstName.trim()) newErrors.studentFirstName = 'First name is required.';
    if (!formData.studentLastName.trim()) newErrors.studentLastName = 'Last name is required.';
    if (!formData.dob) newErrors.dob = 'Date of birth is required.';
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required.";
    if (!formData.fatherCnic.trim()) newErrors.fatherCnic = 'CNIC is required.';
    if (!formData.phone.trim()) newErrors.phone = 'WhatsApp/Phone number is required.';
    if (!formData.campusId) newErrors.campusId = 'Please select a campus.';
    if (!formData.desiredClassId) newErrors.desiredClassId = 'Please select a class.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    
    // Clean up empty optional fields to prevent 400 Bad Request from class-validator
    const payload: any = { ...formData };
    if (!payload.email) delete payload.email;
    if (!payload.previousSchool) delete payload.previousSchool;
    if (!payload.gender) delete payload.gender;
    if (!payload.dob) delete payload.dob;

    try {
      await enrollmentsApi.apply(payload);
      setSubmitted(true);
    } catch (err: any) {
      setErrors({ general: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-on-surface antialiased min-h-screen bg-page-bg font-sans scroll-smooth">
      <MarketingNavbar />
      
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-[32px] bg-surface-container-lowest overflow-hidden border-b border-divider">
        <div className="relative z-10 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="flex flex-col items-start text-left animate-fade-in-up">
            <h1 className="font-heading font-bold text-[36px] md:text-[48px] lg:text-[56px] leading-[1.15] text-heading-on-light mb-6">
              Start Your Journey with <span className="text-primary">EduCore.</span>
            </h1>
            <p className="font-normal text-[16px] md:text-[18px] leading-[1.6] text-body-secondary max-w-[500px] mb-10">
              Apply now for the upcoming academic session. Fill out the admission form, and our admissions office will contact you for the entry test schedule.
            </p>

            <div className="w-full max-w-[550px] mb-10 grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-surface border border-divider shadow-xl rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl group cursor-default">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-heading font-bold text-heading-on-light tracking-tight">{classes.length}+</div>
                    <div className="text-sm font-semibold text-body-secondary uppercase tracking-wider mt-1">Open Classes</div>
                  </div>
                </div>
                <p className="text-sm text-body-secondary leading-relaxed">
                  Admissions are currently open across multiple grades. Select your class below.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="w-full h-full flex lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-full max-w-[550px] bg-surface border border-divider shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-2xl p-6 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary-fixed"></div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-heading-on-light">Application Received!</h3>
                  <p className="text-sm text-body-secondary max-w-[300px]">
                    Thank you! The application for <strong>{formData.studentFirstName}</strong> has been submitted successfully.
                  </p>
                  <p className="text-sm text-body-secondary max-w-[300px]">
                    Our admissions team will review it and contact you at <strong>{formData.phone}</strong> to schedule an admission test.
                  </p>
                  <Link href="/" className="mt-4 text-sm text-primary font-semibold hover:underline">
                    Return to Home →
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="font-heading font-bold text-2xl text-heading-on-light mb-2">School Admission Form</h3>
                  <p className="text-sm text-body-secondary mb-8">Please fill out the applicant and guardian details.</p>

                  {errors.general && (
                    <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">{errors.general}</div>
                  )}

                  <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    {/* Student Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Student First Name *</label>
                        <input name="studentFirstName" type="text" value={formData.studentFirstName} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.studentFirstName ? 'border-error' : 'border-divider'}`} />
                        {errors.studentFirstName && <p className="text-xs text-error">{errors.studentFirstName}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Student Last Name *</label>
                        <input name="studentLastName" type="text" value={formData.studentLastName} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.studentLastName ? 'border-error' : 'border-divider'}`} />
                        {errors.studentLastName && <p className="text-xs text-error">{errors.studentLastName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Date of Birth *</label>
                        <input name="dob" type="date" value={formData.dob} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.dob ? 'border-error' : 'border-divider'}`} />
                        {errors.dob && <p className="text-xs text-error">{errors.dob}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}
                          className="w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors border-divider">
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>
                    </div>

                    {/* Guardian Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-divider">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Father / Guardian Name *</label>
                        <input name="fatherName" type="text" value={formData.fatherName} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.fatherName ? 'border-error' : 'border-divider'}`} />
                        {errors.fatherName && <p className="text-xs text-error">{errors.fatherName}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Father CNIC *</label>
                        <input name="fatherCnic" type="text" value={formData.fatherCnic} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.fatherCnic ? 'border-error' : 'border-divider'}`}
                          placeholder="e.g. 35202-1234567-1" />
                        {errors.fatherCnic && <p className="text-xs text-error">{errors.fatherCnic}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">WhatsApp / Phone *</label>
                        <input name="phone" type="text" value={formData.phone} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.phone ? 'border-error' : 'border-divider'}`} />
                        {errors.phone && <p className="text-xs text-error">{errors.phone}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Email (Optional)</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors border-divider`} />
                      </div>
                    </div>

                    {/* Academic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-divider">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Campus *</label>
                        <select name="campusId" value={formData.campusId} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${errors.campusId ? 'border-error' : 'border-divider'}`}>
                          <option value="" disabled>Select a campus...</option>
                          {campuses.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        {errors.campusId && <p className="text-xs text-error">{errors.campusId}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Desired Class *</label>
                        <select 
                          name="desiredClassId" 
                          value={formData.desiredClassId} 
                          onChange={handleChange}
                          disabled={!formData.campusId}
                          className={`w-full border rounded-lg px-4 py-3 bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary ${errors.desiredClassId ? 'border-error' : 'border-divider'}`}
                        >
                          <option value="">Select a Class...</option>
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        {errors.desiredClassId && <p className="text-xs text-error">{errors.desiredClassId}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Previous School (Optional)</label>
                        <input name="previousSchool" type="text" value={formData.previousSchool} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors border-divider`} />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" disabled={isLoading}
                        className="w-full py-3.5 bg-primary text-on-primary font-semibold rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed">
                        {isLoading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                        ) : (
                          <>Submit Admission Form <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-divider py-12 px-4 md:px-[32px]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg bg-primary group-hover:bg-primary/90 transition-colors flex items-center justify-center">
              <GraduationCap className="text-on-primary w-5 h-5" strokeWidth={2} />
            </div>
            <span className="font-heading font-bold text-xl text-heading-on-light tracking-tight group-hover:text-primary transition-colors">EduCore ERP</span>
          </Link>
          <p className="text-body-secondary text-sm">© 2026 EduCore Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
