"use client";
import { GraduationCap, BookOpen, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { useState, useEffect } from 'react';
import { enrollmentsApi, coursesApi } from '@/lib/api';

export default function ApplyPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    desiredCourse: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await coursesApi.getPublic();
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses', err);
      }
    }
    fetchCourses();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.desiredCourse) newErrors.desiredCourse = 'Please select a course.';
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
    try {
      await enrollmentsApi.apply(formData);
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
              Apply now to join our upcoming cohorts. Select your desired course, submit your application, and our admissions team will review it shortly.
            </p>

            <div className="w-full max-w-[550px] mb-10 grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-surface border border-divider shadow-xl rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl group cursor-default">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-heading font-bold text-heading-on-light tracking-tight">{courses.length}+</div>
                    <div className="text-sm font-semibold text-body-secondary uppercase tracking-wider mt-1">Active Courses</div>
                  </div>
                </div>
                <p className="text-sm text-body-secondary leading-relaxed">
                  Choose from our wide variety of active courses taught by expert instructors.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="w-full h-full flex lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-full max-w-[500px] bg-surface border border-divider shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-2xl p-6 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary-fixed"></div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-heading-on-light">Application Received!</h3>
                  <p className="text-sm text-body-secondary max-w-[300px]">
                    Thank you, <strong>{formData.firstName}</strong>! Your application for <strong>{courses.find(c => c.id === formData.desiredCourse)?.title || 'the course'}</strong> has been submitted.
                  </p>
                  <p className="text-sm text-body-secondary max-w-[300px]">
                    Our admissions team will review your application and contact you at <strong>{formData.email}</strong>.
                  </p>
                  <Link href="/" className="mt-4 text-sm text-primary font-semibold hover:underline">
                    Return to Home →
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="font-heading font-bold text-2xl text-heading-on-light mb-2">Student Application</h3>
                  <p className="text-sm text-body-secondary mb-8">Fill out the form below to apply for admission.</p>

                  {errors.general && (
                    <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">{errors.general}</div>
                  )}

                  <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label htmlFor="firstName" className="text-xs font-semibold text-body-secondary uppercase tracking-wider">First Name</label>
                        <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.firstName ? 'border-error' : 'border-divider'}`}
                          placeholder="John" />
                        {errors.firstName && <p className="text-xs text-error">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="lastName" className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Last Name</label>
                        <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.lastName ? 'border-error' : 'border-divider'}`}
                          placeholder="Doe" />
                        {errors.lastName && <p className="text-xs text-error">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="email" className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Email Address</label>
                      <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                        className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.email ? 'border-error' : 'border-divider'}`}
                        placeholder="john.doe@example.com" />
                      {errors.email && <p className="text-xs text-error">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="phone" className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Phone Number</label>
                      <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange}
                        className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.phone ? 'border-error' : 'border-divider'}`}
                        placeholder="+1 (555) 000-0000" />
                      {errors.phone && <p className="text-xs text-error">{errors.phone}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="desiredCourse" className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Desired Course</label>
                      <select id="desiredCourse" name="desiredCourse" value={formData.desiredCourse} onChange={handleChange}
                        className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${errors.desiredCourse ? 'border-error' : 'border-divider'}`}>
                        <option value="" disabled>Select a course...</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                        ))}
                      </select>
                      {errors.desiredCourse && <p className="text-xs text-error">{errors.desiredCourse}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="notes" className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Additional Notes (Optional)</label>
                      <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange}
                        className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors border-divider`}
                        placeholder="Any previous experience or questions?" rows={3} />
                    </div>

                    <div className="pt-4">
                      <button type="submit" disabled={isLoading}
                        className="w-full py-3.5 bg-primary text-on-primary font-semibold rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed">
                        {isLoading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                        ) : (
                          <>Submit Application <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
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
