"use client";
import { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { campusesApi } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function CampusDetails() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [campus, setCampus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', code: '', address: '', contactPhone: '', isActive: true });

  useEffect(() => {
    fetchCampus();
  }, [id]);

  const fetchCampus = async () => {
    try {
      const data = await campusesApi.get(id);
      setCampus(data);
      setFormData({ 
        name: data.name, 
        code: data.code, 
        address: data.address || '', 
        contactPhone: data.contactPhone || '',
        isActive: data.isActive !== false
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch campus details');
      router.push('/admin/campuses');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await campusesApi.update(id, formData);
      toast.success('Campus updated successfully');
      fetchCampus();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update campus');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-body-secondary"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" /> Loading Campus Details...</div>;
  }

  if (!campus) return null;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <Link href="/admin/campuses" className="inline-flex items-center text-sm font-medium text-body-secondary hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Campuses
      </Link>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            {campus.name}
          </h2>
          <p className="text-sm text-body-secondary mt-1">Manage details and settings for this campus branch.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
            <div className="p-5 border-b border-divider bg-surface-container-lowest">
              <h3 className="font-bold text-lg text-heading-on-light">Campus Information</h3>
            </div>
            <form onSubmit={handleUpdate} className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Campus Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Campus Code</label>
                  <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary uppercase transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon-inactive" />
                    <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon-inactive" />
                    <input type="text" value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Status</label>
                  <select value={formData.isActive ? 'true' : 'false'} onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-4 py-2 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-divider flex justify-end">
                <button type="submit" disabled={saving} className="flex items-center gap-2 primary-gradient text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-70 transition-all">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface rounded-xl border border-divider brand-shadow p-5">
            <h3 className="font-bold text-lg text-heading-on-light mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-lg border border-border-light">
                <span className="text-sm font-medium text-body-secondary">Created At</span>
                <span className="text-sm font-bold text-on-surface">{new Date(campus.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-lg border border-border-light">
                <span className="text-sm font-medium text-body-secondary">Last Updated</span>
                <span className="text-sm font-bold text-on-surface">{new Date(campus.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-error-bg/30 rounded-xl border border-error/20 p-5">
            <h3 className="font-bold text-error flex items-center gap-2 mb-2"><Trash2 className="w-5 h-5" /> Danger Zone</h3>
            <p className="text-xs text-error/80 mb-4">Deactivating or deleting a campus can affect all users and classes assigned to it. Proceed with caution.</p>
            <button 
              type="button"
              className="w-full px-4 py-2 bg-error text-white rounded-lg text-sm font-semibold hover:bg-error/90 transition-colors"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this campus?')) {
                  campusesApi.remove(id).then(() => {
                    toast.success('Campus deleted');
                    router.push('/admin/campuses');
                  }).catch((err: any) => toast.error(err.message));
                }
              }}
            >
              Delete Campus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
