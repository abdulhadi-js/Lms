"use client";
import { useState, useEffect } from 'react';
import { familiesApi, feesApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Users, Search, FileText, Phone, MapPin, Loader2, User, Printer } from 'lucide-react';
import { RequireAccess } from '@/components/RequireAccess';
import Link from 'next/link';

export default function FamilySiblingReportPage() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingCode, setGeneratingCode] = useState<string | null>(null);

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const data = await familiesApi.list();
      setFamilies(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch family records');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateConsolidatedVoucher = async (familyCode: string) => {
    setGeneratingCode(familyCode);
    try {
      const res = await feesApi.getFamilyConsolidated(familyCode);
      toast.success(`Consolidated Voucher for ${familyCode}: Rs. ${Number(res.totalUnpaid).toLocaleString('en-PK')} unpaid across ${res.fees?.length || 0} items`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate consolidated voucher');
    } finally {
      setGeneratingCode(null);
    }
  };

  const filteredFamilies = families.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.familyCode?.toLowerCase().includes(q) ||
      f.fatherName?.toLowerCase().includes(q) ||
      f.fatherPhone?.toLowerCase().includes(q) ||
      f.users?.some((u: any) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q))
    );
  });

  return (
    <RequireAccess module="USERS_STUDENTS" action="canView">
      <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6 animate-in fade-in duration-300">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-heading-on-light flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              Family & Sibling Directory
            </h1>
            <p className="text-sm text-body-secondary mt-1">
              Consolidated record of family units, linked siblings, contact channels, and billing statements.
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="bg-surface hover:bg-surface-container border border-divider text-on-surface text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-primary" />
              Print Report
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-surface p-4 rounded-xl border border-divider brand-shadow flex items-center gap-3 print:hidden">
          <Search className="w-5 h-5 text-body-secondary shrink-0" />
          <input
            type="text"
            placeholder="Search by Family Code, Father Name, Phone, or Student Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-sm text-on-surface focus:outline-none placeholder:text-body-secondary"
          />
        </div>

        {/* Family Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredFamilies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredFamilies.map((fam) => (
              <div key={fam.id} className="bg-surface rounded-xl border border-divider brand-shadow p-5 space-y-4 hover:border-primary/50 transition-colors">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-border-light pb-4">
                  <div>
                    <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary-container/20 px-2.5 py-1 rounded-md">
                      {fam.familyCode}
                    </span>
                    <h3 className="text-xl font-bold text-heading-on-light mt-2">{fam.fatherName}</h3>
                    <p className="text-xs text-body-secondary flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" /> {fam.fatherPhone || 'No Phone'}</span>
                      {fam.fatherCnic && <span className="flex items-center gap-1 font-mono text-[11px] bg-surface-container-low px-1.5 rounded text-body-secondary">CNIC: {fam.fatherCnic}</span>}
                    </p>
                  </div>

                  <button
                    onClick={() => handleGenerateConsolidatedVoucher(fam.familyCode)}
                    disabled={generatingCode === fam.familyCode}
                    className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 shrink-0 print:hidden"
                  >
                    {generatingCode === fam.familyCode ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    Consolidated Fee
                  </button>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {fam.motherName && (
                    <div>
                      <span className="text-body-secondary uppercase font-semibold">Mother</span>
                      <p className="font-medium text-on-surface mt-0.5">{fam.motherName}</p>
                    </div>
                  )}
                  {fam.guardianName && (
                    <div>
                      <span className="text-body-secondary uppercase font-semibold">Guardian</span>
                      <p className="font-medium text-on-surface mt-0.5">{fam.guardianName}</p>
                    </div>
                  )}
                  {fam.address && (
                    <div className="col-span-2">
                      <span className="text-body-secondary uppercase font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" /> Address
                      </span>
                      <p className="font-medium text-on-surface mt-0.5">{fam.address}</p>
                    </div>
                  )}
                </div>

                {/* Linked Siblings */}
                <div className="pt-3 border-t border-border-light">
                  <span className="text-xs text-body-secondary font-bold uppercase tracking-wider block mb-2">
                    Linked Siblings ({fam.users?.length || 0})
                  </span>
                  {fam.users && fam.users.length > 0 ? (
                    <div className="space-y-2">
                      {fam.users.map((student: any) => (
                        <div key={student.id} className="flex justify-between items-center bg-surface-container-low p-2.5 rounded-lg border border-border-light">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-on-surface">{student.firstName} {student.lastName}</p>
                              <p className="text-xs text-body-secondary">{student.email}</p>
                            </div>
                          </div>
                          <Link
                            href={`/admin/students/${student.id}`}
                            className="text-xs text-primary font-semibold hover:underline print:hidden"
                          >
                            View File →
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-body-secondary italic">No students linked to this family record.</p>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface p-12 rounded-xl border border-divider text-center text-body-secondary">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            No family records found.
          </div>
        )}

      </div>
    </RequireAccess>
  );
}
