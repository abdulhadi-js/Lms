"use client";
import { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Settings2, Shield, Search, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { rolesApi, campusesApi } from '@/lib/api';

const AVAILABLE_PERMISSIONS = [
  'MANAGE_USERS', 'VIEW_USERS',
  'MANAGE_ACADEMICS', 'VIEW_ACADEMICS',
  'MANAGE_ADMISSIONS', 'VIEW_ADMISSIONS',
  'MANAGE_FEES', 'VIEW_FEES',
  'MANAGE_ATTENDANCE', 'VIEW_ATTENDANCE',
  'MANAGE_MARKS', 'VIEW_MARKS'
];

export default function RolesManagement() {
  const [roles, setRoles] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', campusId: '', permissions: [] as string[] });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesData, campusesData] = await Promise.all([
        rolesApi.list().catch(() => []),
        campusesApi.list().catch(() => [])
      ]);
      setRoles(rolesData);
      setCampuses(campusesData);
    } catch (err: any) {
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.permissions.length === 0) {
      return toast.error('Please select at least one permission');
    }
    try {
      await rolesApi.create({
        ...formData,
        campusId: formData.campusId || null
      });
      toast.success('Role created successfully');
      setIsModalOpen(false);
      setFormData({ name: '', campusId: '', permissions: [] });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create role');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Roles & Permissions</h2>
          <p className="text-sm text-body-secondary mt-1">Design custom RBAC roles and assign them to specific campuses.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-lowest">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-heading-on-light">Defined Roles</h3>
          </div>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-body-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search roles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-border-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-body-secondary">Loading roles...</div>
          ) : roles.length === 0 ? (
            <div className="p-8 text-center text-body-secondary">No custom roles defined.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                  <th className="py-4 px-6 font-semibold">Role Name</th>
                  <th className="py-4 px-6 font-semibold">Campus Assignment</th>
                  <th className="py-4 px-6 font-semibold">Permissions</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {roles
                  .filter(r => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(role => (
                  <tr key={role.id} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                    <td className="py-4 px-6 font-medium text-on-surface">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary/70" />
                        {role.name}
                        {role.isSystem && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase ml-2">System</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-body-secondary">
                      {role.campusId ? (
                        <span className="bg-surface-container px-2 py-1 rounded text-xs">
                          {campuses.find(c => c.id === role.campusId)?.name || 'Unknown Campus'}
                        </span>
                      ) : (
                        <span className="bg-success/10 text-success px-2 py-1 rounded text-xs">Global Role</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {(role.permissions || []).slice(0, 3).map((p: string) => (
                          <span key={p} className="text-[10px] border border-border-light text-body-secondary px-1.5 py-0.5 rounded bg-surface">
                            {p.replace('MANAGE_', 'M_').replace('VIEW_', 'V_')}
                          </span>
                        ))}
                        {(role.permissions || []).length > 3 && (
                          <span className="text-[10px] text-primary font-medium px-1.5 py-0.5">+{role.permissions.length - 3} more</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {!role.isSystem && (
                        <button className="text-body-secondary hover:text-primary transition-colors p-1" title="Edit Role">
                          <Settings2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-2xl my-auto animate-fade-in-up">
            <div className="px-6 py-4 border-b border-divider flex justify-between items-center sticky top-0 bg-surface z-10 rounded-t-2xl">
              <h3 className="text-lg font-bold text-heading-on-light flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Create Custom Role
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-body-secondary hover:text-error"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Role Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Primary Section Coordinator"
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Target Campus</label>
                  <select value={formData.campusId} onChange={e => setFormData({ ...formData, campusId: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
                    <option value="">Global (Available to all)</option>
                    {campuses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-3 border-b border-divider pb-2">Assign Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {AVAILABLE_PERMISSIONS.map(perm => {
                    const isSelected = formData.permissions.includes(perm);
                    return (
                      <label 
                        key={perm} 
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-border-light bg-surface-container-lowest text-body-secondary hover:border-body-secondary'}`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${isSelected ? 'bg-primary border-primary' : 'border-body-secondary'}`}>
                          {isSelected && <svg className="w-3 h-3 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                          {perm.replace('_', ' ')}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-divider sticky bottom-0 bg-surface pb-2 -mb-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg">Create Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
