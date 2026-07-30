"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usersApi, feesApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { 
  User, Mail, Phone, MapPin, Users, BookOpen, Banknote, 
  Award, Clock, ArrowLeft, Loader2, CheckCircle, XCircle, FileText 
} from 'lucide-react';
import { RequireAccess } from '@/components/RequireAccess';

export default function UnifiedStudentProfile() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingVoucher, setGeneratingVoucher] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProfile(params.id as string);
    }
  }, [params.id]);

  const fetchProfile = async (id: string) => {
    setLoading(true);
    try {
      const data = await usersApi.getUnifiedProfile(id);
      setStudent(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load student profile');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFamilyVoucher = async () => {
    if (!student?.family?.familyCode) return;
    setGeneratingVoucher(true);
    try {
      const res = await feesApi.getFamilyConsolidated(student.family.familyCode);
      toast.success(`Generated consolidated voucher for $${res.totalUnpaid}`);
      // In a real app, this would open a PDF or a printable view
      console.log('Consolidated fees:', res.fees);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate voucher');
    } finally {
      setGeneratingVoucher(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-page-bg">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) return null;

  const family = student.family;
  const siblings = family?.users?.filter((u: any) => u.id !== student.id) || [];
  const enrollments = student.enrollments || [];
  const fees = student.fees || [];
  const marks = student.marks || [];

  return (
    <RequireAccess module="USERS_STUDENTS" action="canView">
      <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6 animate-in fade-in duration-300">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm font-semibold text-body-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to List
        </button>

        {/* Top Header - Student Info */}
        <div className="bg-surface rounded-xl border border-divider brand-shadow p-6 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <div className="w-24 h-24 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-3xl border-4 border-surface shrink-0">
            {student.profilePicture ? (
              <img src={student.profilePicture.startsWith('http') ? student.profilePicture : `http://localhost:3001${student.profilePicture}`} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-heading-on-light mb-1">{student.firstName} {student.lastName}</h1>
            <p className="text-body-secondary font-medium mb-3">GR / ID: {student.id}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-on-surface">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-primary" /> {student.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-primary" /> {student.phone || 'N/A'}</span>
            </div>
          </div>
          
          <div className="shrink-0 flex flex-col items-end gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${student.status === 'ACTIVE' ? 'bg-success-bg text-success border border-success/20' : 'bg-error-bg text-error border border-error/20'}`}>
              {student.status}
            </span>
            <span className="text-xs text-body-secondary font-medium">Joined {new Date(student.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Family & Contacts */}
          <div className="space-y-6">
            <div className="bg-surface rounded-xl border border-divider brand-shadow p-5 relative">
              <h3 className="text-lg font-bold text-heading-on-light mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Family Details
              </h3>
              
              {family ? (
                <div className="space-y-4">
                  <div className="bg-surface-container-low p-4 rounded-lg border border-border-light text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5"></div>
                    <p className="text-xs text-body-secondary uppercase font-semibold relative z-10">Family Code</p>
                    <p className="text-xl font-bold text-primary tracking-widest relative z-10 mb-3">{family.familyCode}</p>
                    <button 
                      onClick={handleGenerateFamilyVoucher}
                      disabled={generatingVoucher}
                      className="relative z-10 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 mx-auto hover:bg-primary/90 hover:shadow-md transition-all disabled:opacity-70"
                    >
                      {generatingVoucher ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                      Consolidated Fee Voucher
                    </button>
                  </div>
                  
                  <ul className="space-y-3 text-sm">
                    <li className="flex flex-col">
                      <span className="text-body-secondary text-xs font-semibold uppercase">Father</span>
                      <span className="font-medium text-on-surface flex items-center gap-2">
                        {family.fatherName}
                        {family.fatherPhone && <span className="text-xs text-body-secondary font-normal">({family.fatherPhone})</span>}
                      </span>
                    </li>
                    {family.motherName && (
                      <li className="flex flex-col">
                        <span className="text-body-secondary text-xs font-semibold uppercase">Mother</span>
                        <span className="font-medium text-on-surface">{family.motherName}</span>
                      </li>
                    )}
                    {family.guardianName && (
                      <li className="flex flex-col">
                        <span className="text-body-secondary text-xs font-semibold uppercase">Guardian</span>
                        <span className="font-medium text-on-surface">{family.guardianName}</span>
                      </li>
                    )}
                    {family.address && (
                      <li className="flex flex-col">
                        <span className="text-body-secondary text-xs font-semibold uppercase">Address</span>
                        <span className="font-medium text-on-surface flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                          {family.address}
                        </span>
                      </li>
                    )}
                  </ul>
                  
                  {siblings.length > 0 && (
                    <div className="pt-4 border-t border-border-light">
                      <p className="text-xs text-body-secondary uppercase font-semibold mb-2">Linked Siblings</p>
                      <div className="space-y-2">
                        {siblings.map((sib: any) => (
                          <div key={sib.id} className="flex items-center justify-between bg-surface-container p-2 rounded-lg border border-border-light">
                            <span className="font-medium text-sm text-on-surface">{sib.firstName} {sib.lastName}</span>
                            <button onClick={() => router.push(`/admin/students/${sib.id}`)} className="text-xs text-primary font-semibold hover:underline">View</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-body-secondary text-center py-6">
                  <User className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  No family linked to this student.
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Academic & Financials */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Enrollments & Courses */}
            <div className="bg-surface rounded-xl border border-divider brand-shadow p-5">
              <h3 className="text-lg font-bold text-heading-on-light mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Current Enrollments
              </h3>
              
              {enrollments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {enrollments.map((enr: any) => (
                    <div key={enr.id} className="border border-border-light rounded-xl p-4 hover:border-primary/50 transition-colors relative">
                      {enr.status === 'ACTIVE' || enr.status === 'ENROLLED' ? (
                         <span className="absolute top-3 right-3 flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                         </span>
                      ) : null}
                      <h4 className="font-bold text-on-surface mb-1 pr-6">{enr.section?.title || 'Unknown Course'}</h4>
                      <p className="text-xs text-body-secondary mb-3">Enrolled: {new Date(enr.createdAt).toLocaleDateString()}</p>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-border-light">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${enr.status === 'ACTIVE' || enr.status === 'ENROLLED' ? 'bg-success-bg text-success' : 'bg-surface-container text-body-secondary'}`}>
                          {enr.status}
                        </span>
                        <span className="text-xs font-medium text-primary">Academic Yr: {enr.academicYear || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-body-secondary py-4">Not enrolled in any courses.</p>
              )}
            </div>

            {/* Financial Ledger (Fees) */}
            <RequireAccess module="FEES" action="canView">
              <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
                <div className="p-5 border-b border-divider bg-surface">
                  <h3 className="text-lg font-bold text-heading-on-light flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-success" />
                    Fee Ledger
                  </h3>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider">
                        <th className="py-3 px-5 font-semibold">Title</th>
                        <th className="py-3 px-5 font-semibold">Amount</th>
                        <th className="py-3 px-5 font-semibold">Paid</th>
                        <th className="py-3 px-5 font-semibold">Due Date</th>
                        <th className="py-3 px-5 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.length > 0 ? fees.map((fee: any) => (
                        <tr key={fee.id} className="border-b border-border-light last:border-0 hover:bg-surface-container-low">
                          <td className="py-3 px-5 font-medium text-on-surface">{fee.title || 'Course Fee'}</td>
                          <td className="py-3 px-5">${fee.amount?.toLocaleString()}</td>
                          <td className="py-3 px-5 text-success font-medium">${fee.paidAmount?.toLocaleString() || '0'}</td>
                          <td className="py-3 px-5 text-body-secondary">{new Date(fee.dueDate).toLocaleDateString()}</td>
                          <td className="py-3 px-5">
                            {fee.status === 'PAID' ? (
                              <span className="flex items-center gap-1 text-success text-xs font-bold"><CheckCircle className="w-3.5 h-3.5" /> PAID</span>
                            ) : fee.status === 'OVERDUE' ? (
                              <span className="flex items-center gap-1 text-error text-xs font-bold"><XCircle className="w-3.5 h-3.5" /> OVERDUE</span>
                            ) : (
                              <span className="flex items-center gap-1 text-warning text-xs font-bold"><Clock className="w-3.5 h-3.5" /> PENDING</span>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-body-secondary">No fee records found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </RequireAccess>
            
            {/* Exam Results & Marks */}
            <RequireAccess module="EXAMS" action="canView">
              <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
                <div className="p-5 border-b border-divider bg-surface">
                  <h3 className="text-lg font-bold text-heading-on-light flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Academic Results
                  </h3>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider">
                        <th className="py-3 px-5 font-semibold">Assessment</th>
                        <th className="py-3 px-5 font-semibold text-right">Score</th>
                        <th className="py-3 px-5 font-semibold text-center">Grade</th>
                        <th className="py-3 px-5 font-semibold">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marks.length > 0 ? marks.map((mark: any) => (
                        <tr key={mark.id} className="border-b border-border-light last:border-0 hover:bg-surface-container-low">
                          <td className="py-3 px-5 font-medium text-on-surface">Assignment {mark.assignmentId?.slice(0,6) || 'Assessment'}</td>
                          <td className="py-3 px-5 text-right font-medium">
                            {mark.score} <span className="text-body-secondary text-xs">/ {mark.maxScore}</span>
                          </td>
                          <td className="py-3 px-5 text-center">
                            <span className="inline-block px-2 py-1 rounded bg-primary-container text-primary-container-on font-bold text-xs">
                              {mark.grade || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-body-secondary truncate max-w-[200px]" title={mark.feedback || ''}>
                            {mark.feedback || '—'}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-body-secondary">No academic results recorded yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </RequireAccess>

          </div>
        </div>
      </div>
    </RequireAccess>
  );
}
