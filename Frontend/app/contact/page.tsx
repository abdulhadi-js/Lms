"use client";
import { GraduationCap, Mail, MapPin, Phone, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { MarketingNavbar } from '@/components/MarketingNavbar';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    inquiryType: 'Request a Demo',
    message: '',
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
    if (!formData.message.trim()) newErrors.message = 'Please provide a message.';
    else if (formData.message.trim().length < 20) newErrors.message = 'Message must be at least 20 characters.';
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-[32px] bg-surface-container-lowest border-b border-divider">
        <div className="max-w-[800px] mx-auto text-center animate-fade-in-up">
          <h1 className="font-heading font-bold text-[40px] md:text-[56px] leading-[1.1] text-heading-on-light mb-6">
            Get in <span className="text-primary">Touch.</span>
          </h1>
          <p className="font-normal text-[18px] leading-[1.6] text-body-secondary mb-8">
            Whether you need enterprise deployment support, customized architectural planning, or technical assistance, our engineers are here to help.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 md:px-[32px] bg-page-bg">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-heading font-bold text-heading-on-light mb-6">Global Offices</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface mb-1">North America Headquarters</h3>
                    <p className="text-sm text-body-secondary leading-relaxed">
                      100 Tech Corridor Parkway<br />Suite 500<br />San Francisco, CA 94105
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface mb-1">Enterprise Support</h3>
                    <p className="text-sm text-body-secondary leading-relaxed">
                      +1 (800) 555-0199<br />Mon-Fri, 9am - 6pm PST
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface mb-1">General Inquiries</h3>
                    <p className="text-sm text-body-secondary leading-relaxed">
                      deployments@educore-erp.com<br />support@educore-erp.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-surface p-8 rounded-2xl border border-divider shadow-sm">
            <h2 className="text-2xl font-heading font-bold text-heading-on-light mb-6">Send a Message</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-heading font-bold text-xl text-heading-on-light">Message Sent!</h3>
                <p className="text-sm text-body-secondary max-w-[280px]">
                  Thanks for reaching out! We'll reply to <strong>{formData.email}</strong> within one business day.
                </p>
                <button onClick={() => { setSubmitted(false); setFormData({ firstName: '', lastName: '', email: '', inquiryType: 'Request a Demo', message: '' }); }}
                  className="mt-4 text-sm text-primary font-semibold hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <>
                {errors.general && (
                  <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">{errors.general}</div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label htmlFor="firstName" className="text-sm font-medium text-on-surface">First Name</label>
                      <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange}
                        className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.firstName ? 'border-error' : 'border-divider'}`}
                        placeholder="John" />
                      {errors.firstName && <p className="text-xs text-error">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="lastName" className="text-sm font-medium text-on-surface">Last Name</label>
                      <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange}
                        className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.lastName ? 'border-error' : 'border-divider'}`}
                        placeholder="Doe" />
                      {errors.lastName && <p className="text-xs text-error">{errors.lastName}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-on-surface">Institution Email</label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                      className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.email ? 'border-error' : 'border-divider'}`}
                      placeholder="j.doe@university.edu" />
                    {errors.email && <p className="text-xs text-error">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="inquiryType" className="text-sm font-medium text-on-surface">Inquiry Type</label>
                    <select id="inquiryType" name="inquiryType" value={formData.inquiryType} onChange={handleChange}
                      className="w-full bg-surface-container-lowest border border-divider rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option>Request a Demo</option>
                      <option>Technical Support</option>
                      <option>Billing &amp; Licensing</option>
                      <option>Partnership Opportunities</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="message" className="text-sm font-medium text-on-surface">Message</label>
                    <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange}
                      className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-colors ${errors.message ? 'border-error' : 'border-divider'}`}
                      placeholder="How can we help your institution?" />
                    {errors.message && <p className="text-xs text-error">{errors.message}</p>}
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed">
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><MessageSquare className="w-4 h-4" /> Submit Request</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-divider py-16 px-6 md:px-[32px]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded bg-primary group-hover:bg-primary/90 transition-colors flex items-center justify-center">
                <GraduationCap className="text-on-primary w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-lg text-heading-on-light group-hover:text-primary transition-colors">EduCore</span>
            </Link>
            <div className="flex space-x-6">
              <Link href="/about" className="text-sm text-body-secondary hover:text-primary transition-colors">About Us</Link>
              <Link href="/contact" className="text-sm text-body-secondary hover:text-primary transition-colors">Contact</Link>
              <Link href="/apply" className="text-sm text-body-secondary hover:text-primary transition-colors">Request Deployment</Link>
            </div>
          </div>
          <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-body-secondary text-sm">© 2026 EduCore Technologies. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-body-secondary">
              <span className="hover:text-primary transition-colors cursor-default">ISO 27001 Certified</span>
              <span className="hover:text-primary transition-colors cursor-default">FERPA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
