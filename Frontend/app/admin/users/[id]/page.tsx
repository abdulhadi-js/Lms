"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { User, Phone, Mail, MapPin, BookOpen, ChevronLeft, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      const data = await fetchApi(`/users/${id}`);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-on-surface">Loading user details...</div>;
  if (error) return <div className="p-8 text-center text-error">{error}</div>;
  if (!profile) return <div className="p-8 text-center">User not found</div>;

  const isStudent = profile.role?.name?.toUpperCase() === 'STUDENT' || !profile.role;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg bg-surface border border-divider hover:bg-surface-container transition-colors">
          <ChevronLeft className="w-5 h-5 text-on-surface" />
        </button>
        <div>
          <h1 className="text-3xl font-heading font-bold text-on-surface">User Profile</h1>
          <p className="text-body-secondary mt-1">View detailed information and history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Profile Card */}
        <div className="bg-surface brand-shadow rounded-xl p-5 lg:col-span-1 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary-fixed-dim text-evergreen flex items-center justify-center text-3xl font-bold mb-4">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.firstName} className="w-full h-full rounded-full object-cover" />
              ) : (
                `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`
              )}
            </div>
            <h2 className="text-2xl font-bold text-on-surface">{profile.firstName} {profile.lastName}</h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mt-2 tracking-wide uppercase">
              {profile.role?.name || (profile.isTeachingStaff ? 'Teaching Staff' : 'Student')}
            </span>
            <div className="text-sm text-body-secondary mt-2">ID: {profile.id.split('-')[0]}</div>
          </div>

          <div className="mt-8 space-y-4 border-t border-divider pt-6">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span className="text-on-surface truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span className="text-on-surface">{profile.phone || 'N/A'}</span>
            </div>
            {profile.campus && (
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-on-surface">{profile.campus.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Additional Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Family & Guardian Details (For Students) */}
          {isStudent && (
            <div className="bg-surface brand-shadow rounded-xl overflow-hidden">
              <div className="p-5 border-b border-divider bg-surface-container-lowest">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Guardian Details
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-body-secondary uppercase tracking-wider block mb-1">Father's Name</span>
                  <div className="font-medium text-on-surface">{profile.family?.fatherName || profile.fatherName || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-xs text-body-secondary uppercase tracking-wider block mb-1">Father's Phone</span>
                  <div className="font-medium text-on-surface">{profile.family?.fatherPhone || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-xs text-body-secondary uppercase tracking-wider block mb-1">Mother's Name</span>
                  <div className="font-medium text-on-surface">{profile.family?.motherName || profile.motherName || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-xs text-body-secondary uppercase tracking-wider block mb-1">Guardian's Name</span>
                  <div className="font-medium text-on-surface">{profile.family?.guardianName || profile.guardianName || 'N/A'}</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-body-secondary uppercase tracking-wider block mb-1">Discount Amount</span>
                  <div className="font-medium text-success">Rs. {profile.discountAmount || '0'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Academic Background */}
          {isStudent && profile.previousSchool && (
            <div className="bg-surface brand-shadow rounded-xl overflow-hidden">
              <div className="p-5 border-b border-divider bg-surface-container-lowest">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Academic Background
                </h3>
              </div>
              <div className="p-5">
                <span className="text-xs text-body-secondary uppercase tracking-wider block mb-1">Previous School</span>
                <div className="font-medium text-on-surface">{profile.previousSchool}</div>
              </div>
            </div>
          )}

          {/* Enrollments List (If student) */}
          {isStudent && (
             <div className="bg-surface brand-shadow rounded-xl overflow-hidden">
               <div className="p-5 border-b border-divider bg-surface-container-lowest">
                 <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                   <BookOpen className="w-5 h-5 text-primary" /> Current Enrollments
                 </h3>
               </div>
               <div className="p-5 text-sm text-body-secondary">
                 Enrollments list will populate here (can be fetched dynamically via /enrollments api).
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
