"use client";
import { useState, useEffect } from 'react';
import { Plus, Building2, MapPin, Phone, MoreVertical, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { campusesApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CampusesManagement() {
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', address: '', contactPhone: '' });
  const router = useRouter();

  const fetchCampuses = async () => {
    setLoading(true);
    try {
      const data = await campusesApi.list();
      setCampuses(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch campuses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await campusesApi.create(formData);
      toast.success('Campus created successfully');
      setIsModalOpen(false);
      setFormData({ name: '', code: '', address: '', contactPhone: '' });
      fetchCampuses();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create campus');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Campus Management</h2>
          <p className="text-sm text-body-secondary mt-1">Super Admin Dashboard to manage school branches.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Campus
        </button>
      </div>

      {loading ? (
        <div className="text-center p-12 text-body-secondary">Loading campuses...</div>
      ) : campuses.length === 0 ? (
        <div className="bg-surface rounded-xl border border-divider p-12 text-center flex flex-col items-center">
          <Building2 className="w-12 h-12 text-body-secondary/30 mb-4" />
          <h3 className="text-lg font-bold text-heading-on-light mb-1">No Campuses Found</h3>
          <p className="text-sm text-body-secondary mb-4">Create your first campus to start assigning students and staff.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-primary font-medium text-sm hover:underline">Create Campus</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campuses.map(campus => (
            <div key={campus.id} onClick={() => router.push('/admin')} className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
              <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-heading-on-light text-lg">{campus.name}</h3>
                      <span className="text-xs font-mono bg-surface-container px-2 py-0.5 rounded text-body-secondary">CODE: {campus.code}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-start gap-3 text-sm text-body-secondary">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
                    <span className="line-clamp-2">{campus.address || 'No address provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-body-secondary">
                    <Phone className="w-4 h-4 shrink-0 text-primary/70" />
                    <span>{campus.contactPhone || 'No contact provided'}</span>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 bg-surface-container-lowest border-t border-divider flex justify-between items-center text-xs">
                <span className="text-body-secondary">Created: {new Date(campus.createdAt).toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded-full font-medium ${campus.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {campus.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-divider flex justify-between items-center">
              <h3 className="text-lg font-bold text-heading-on-light">Register New Campus</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-body-secondary hover:text-error"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Campus Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. DHA Phase 1 Campus"
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Campus Code *</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. DHA-01"
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary uppercase" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Contact Phone</label>
                <input type="text" value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-divider">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg">Save Campus</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
