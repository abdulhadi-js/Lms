"use client";
import { GraduationCap, ShieldCheck, Server, Users, ArrowRight, Building2, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { useState } from 'react';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
    enrollment: '',
    interests: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.institution.trim()) newErrors.institution = 'Institution name is required.';
    if (!formData.enrollment) newErrors.enrollment = 'Please select your enrollment size.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCheckbox = (value: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter(i => i !== value)
        : [...prev.interests, value],
    }));
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
      // Simulate API call — replace with real endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
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
              See EduCore in <span className="text-primary">Action.</span>
            </h1>
            <p className="font-normal text-[16px] md:text-[18px] leading-[1.6] text-body-secondary max-w-[500px] mb-10">
              Request a personalized walk-through with our architecture engineers. We'll explore how EduCore can seamlessly map to your institution's unique workflows and scale requirements.
            </p>

            <div className="w-full max-w-[550px] mb-10 grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-surface border border-divider shadow-xl rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl group cursor-default">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-heading font-bold text-heading-on-light tracking-tight">150+</div>
                    <div className="text-sm font-semibold text-body-secondary uppercase tracking-wider mt-1">Institutions Worldwide</div>
                  </div>
                </div>
                <p className="text-sm text-body-secondary leading-relaxed">
                  Join leading universities and enterprise districts that trust EduCore for their daily academic and operational management.
                </p>
              </div>

              <div className="bg-surface border border-divider shadow-lg rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:shadow-xl group cursor-default">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="text-3xl font-heading font-bold text-success mb-1 tracking-tight">99.99%</div>
                  <div className="text-xs font-bold text-body-secondary uppercase tracking-wider">Uptime SLA</div>
                </div>
              </div>

              <div className="bg-surface border border-divider shadow-lg rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:shadow-xl group cursor-default">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Server className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-heading font-bold text-primary mb-1 tracking-tight">&lt; 2 Wks</div>
                  <div className="text-xs font-bold text-body-secondary uppercase tracking-wider">Avg. Deployment</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[550px]">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded bg-success/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-on-surface mb-1">Bank-Grade Security</h4>
                  <p className="text-xs text-body-secondary leading-relaxed">End-to-end encryption with zero-trust architecture.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <Server className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-on-surface mb-1">Dedicated Infrastructure</h4>
                  <p className="text-xs text-body-secondary leading-relaxed">Isolated databases deployed in your preferred region.</p>
                </div>
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
                  <h3 className="font-heading font-bold text-2xl text-heading-on-light">Request Received!</h3>
                  <p className="text-sm text-body-secondary max-w-[300px]">
                    Thank you! Our deployment team will reach out to <strong>{formData.email}</strong> within 24 hours.
                  </p>
                  <Link href="/" className="mt-4 text-sm text-primary font-semibold hover:underline">
                    Return to Home →
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="font-heading font-bold text-2xl text-heading-on-light mb-2">Request Deployment</h3>
                  <p className="text-sm text-body-secondary mb-8">Fill out the form below and our deployment specialists will be in touch within 24 hours.</p>

                  {errors.general && (
                    <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">{errors.general}</div>
                  )}

                  <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label htmlFor="firstName" className="text-xs font-semibold text-body-secondary uppercase tracking-wider">First Name</label>
                        <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange}
                          className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.firstName ? 'border-error' : 'border-divider'}`}
                          placeholder="Jane" />
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
                      <label htmlFor="email" className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Work Email</label>
                      <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                        className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.email ? 'border-error' : 'border-divider'}`}
                        placeholder="jane@university.edu" />
                      {errors.email && <p className="text-xs text-error">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="institution" className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Institution Name</label>
                      <input id="institution" name="institution" type="text" value={formData.institution} onChange={handleChange}
                        className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.institution ? 'border-error' : 'border-divider'}`}
                        placeholder="State University" />
                      {errors.institution && <p className="text-xs text-error">{errors.institution}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="enrollment" className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Total Enrollment</label>
                      <select id="enrollment" name="enrollment" value={formData.enrollment} onChange={handleChange}
                        className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${errors.enrollment ? 'border-error' : 'border-divider'}`}>
                        <option value="" disabled>Select an option...</option>
                        <option value="under_1k">Under 1,000</option>
                        <option value="1k_5k">1,000 - 5,000</option>
                        <option value="5k_20k">5,000 - 20,000</option>
                        <option value="over_20k">20,000+</option>
                      </select>
                      {errors.enrollment && <p className="text-xs text-error">{errors.enrollment}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Primary Interest</label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {['Student Info System', 'LMS Core', 'Finance & Fees', 'Analytics'].map(interest => (
                          <label key={interest} htmlFor={`interest-${interest}`}
                            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors ${formData.interests.includes(interest) ? 'border-primary bg-primary/5' : 'border-divider'}`}>
                            <input id={`interest-${interest}`} type="checkbox" checked={formData.interests.includes(interest)}
                              onChange={() => handleCheckbox(interest)}
                              className="rounded text-primary focus:ring-primary border-divider" />
                            <span className="text-xs font-medium text-on-surface">{interest}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" disabled={isLoading}
                        className="w-full py-3.5 bg-primary text-on-primary font-semibold rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed">
                        {isLoading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                        ) : (
                          <>Schedule Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </button>
                      <p className="text-[11px] text-body-secondary text-center mt-4">
                        By submitting this form, you agree to our{' '}
                        <Link href="/privacy" className="underline hover:text-primary">Terms of Service</Link> and{' '}
                        <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                      </p>
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
