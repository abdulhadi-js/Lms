"use client";
import { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Settings2, Shield, Search, X, Check, CheckSquare, Square } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { rolesApi, campusesApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const MODULES = [
  'DASHBOARD', 'CAMPUSES', 'ROLES', 'ACADEMICS', 
  'USERS_STAFF', 'USERS_STUDENTS', 'FEES', 'ACCOUNTS', 
  'ATTENDANCE', 'EXAMS', 'REPORTS', 'MESSAGING'
];

type MatrixRow = {
  moduleId: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  specialFlags?: any;
};

const getEmptyMatrix = (): MatrixRow[] => {
  return MODULES.map(m => ({
    moduleId: m,
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false
  }));
};

export default function RolesManagement() {
  const [roles, setRoles] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', campusId: '', matrix: getEmptyMatrix() });
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin === true || 
    user?.role?.name?.toUpperCase() === 'SUPERADMIN' || 
    (typeof user?.role === 'string' && user.role.toUpperCase() === 'SUPERADMIN');

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

  const handleMatrixChange = (moduleId: string, action: 'canView' | 'canAdd' | 'canEdit' | 'canDelete') => {
    setFormData(prev => {
      const newMatrix = [...prev.matrix];
      const rowIndex = newMatrix.findIndex(r => r.moduleId === moduleId);
      if (rowIndex !== -1) {
        newMatrix[rowIndex] = {
          ...newMatrix[rowIndex],
          [action]: !newMatrix[rowIndex][action]
        };
        // Auto-enable canView if another action is selected
        if (action !== 'canView' && newMatrix[rowIndex][action]) {
            newMatrix[rowIndex].canView = true;
        }
      }
      return { ...prev, matrix: newMatrix };
    });
  };

  const handleRowToggle = (moduleId: string, enableAll: boolean) => {
    setFormData(prev => {
      const newMatrix = [...prev.matrix];
      const rowIndex = newMatrix.findIndex(r => r.moduleId === moduleId);
      if (rowIndex !== -1) {
        newMatrix[rowIndex] = {
          ...newMatrix[rowIndex],
          canView: enableAll,
          canAdd: enableAll,
          canEdit: enableAll,
          canDelete: enableAll
        };
      }
      return { ...prev, matrix: newMatrix };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Role name is required');
    
    // Filter out rows that have absolutely no permissions
    const activeMatrix = formData.matrix.filter(m => m.canView || m.canAdd || m.canEdit || m.canDelete);
    
    if (activeMatrix.length === 0) {
      return toast.error('Please assign at least one permission in the matrix');
    }

    try {
      if (formData.id) {
        await rolesApi.update(formData.id, {
          name: formData.name,
          campusId: formData.campusId || null,
          matrix: activeMatrix
        });
        toast.success('Role updated successfully');
      } else {
        await rolesApi.create({
          name: formData.name,
          campusId: formData.campusId || null,
          matrix: activeMatrix
        });
        toast.success('Role created successfully');
      }
      setIsModalOpen(false);
      setFormData({ id: '', name: '', campusId: '', matrix: getEmptyMatrix() });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save role');
    }
  };

  const handleEditClick = (role: any) => {
    const fullMatrix = getEmptyMatrix();
    (role.matrix || []).forEach((m: any) => {
      const idx = fullMatrix.findIndex(f => f.moduleId === m.moduleId);
      if (idx !== -1) {
        fullMatrix[idx] = { ...fullMatrix[idx], ...m };
      }
    });

    setFormData({
      id: role.id,
      name: role.name,
      campusId: role.campusId || '',
      matrix: fullMatrix
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role? This cannot be undone.')) return;
    try {
      await rolesApi.remove(id);
      toast.success('Role deleted successfully');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete role');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Roles & Matrix</h2>
          <p className="text-sm text-body-secondary mt-1">Design highly granular RBAC matrices and assign them to specific campuses.</p>
        </div>
        {isSuperAdmin && (
          <button 
            onClick={() => { setFormData({ id: '', name: '', campusId: '', matrix: getEmptyMatrix() }); setIsModalOpen(true); }}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Build Custom Matrix
          </button>
        )}
      </div>

      <div className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-lowest">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-heading-on-light">Active Matrices</h3>
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
            <div className="p-8 text-center text-body-secondary">Loading matrices...</div>
          ) : roles.length === 0 ? (
            <div className="p-8 text-center text-body-secondary">No custom roles defined.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-body-secondary text-[11px] uppercase tracking-wider border-b border-divider">
                  <th className="py-3 px-4 font-semibold">Role Name</th>
                  <th className="py-3 px-4 font-semibold">Campus Assignment</th>
                  <th className="py-3 px-4 font-semibold">Configured Modules</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {roles
                  .filter(r => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(role => {
                  
                  // Compute summary of what modules are active
                  const matrix = role.matrix || [];
                  const activeModules = matrix.map((m: any) => m.moduleId);
                  
                  return (
                  <tr key={role.id} className="border-b border-border-light  hover:bg-surface transition-colors">
                    <td className="py-3 px-4 font-medium text-on-surface">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary/70" />
                        {role.name}
                        {role.isSystem && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase ml-2">System</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-body-secondary">
                      {role.campusId ? (
                        <span className="bg-surface-container px-2 py-1 rounded text-xs">
                          {campuses.find(c => c.id === role.campusId)?.name || 'Unknown Campus'}
                        </span>
                      ) : (
                        <span className="bg-success/10 text-success px-2 py-1 rounded text-xs">Global Role</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {activeModules.length === 0 ? (
                          <span className="text-[10px] text-body-secondary italic">No permissions set</span>
                        ) : (
                          activeModules.slice(0, 4).map((modId: string) => (
                            <span key={modId} className="text-[10px] border border-border-light text-body-secondary px-1.5 py-0.5 rounded bg-surface">
                              {modId.replace('USERS_', '')}
                            </span>
                          ))
                        )}
                        {activeModules.length > 4 && (
                          <span className="text-[10px] text-primary font-medium px-1.5 py-0.5">+{activeModules.length - 4} more</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!role.isSystem && isSuperAdmin && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditClick(role)} className="text-body-secondary hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container" title="Edit Role">
                            <Settings2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(role.id)} className="text-body-secondary hover:text-error transition-colors p-1.5 rounded-lg hover:bg-error-bg" title="Delete Role">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-4xl my-auto animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-divider flex justify-between items-center sticky top-0 bg-surface z-10 rounded-t-2xl shrink-0">
              <h3 className="text-lg font-bold text-heading-on-light flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> {formData.id ? 'Edit Custom Matrix' : 'Build Custom Matrix'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-body-secondary hover:text-error"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
              <div className="p-5 overflow-y-auto flex-grow space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-surface-container-lowest border border-divider rounded-xl">
                  <div>
                    <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Role Name *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Primary Section Coordinator"
                      className="w-full px-4 py-2 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-body-secondary uppercase tracking-wider mb-1">Target Campus</label>
                    <select value={formData.campusId} onChange={e => setFormData({ ...formData, campusId: e.target.value })}
                      className="w-full px-4 py-2 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
                      <option value="">Global (Available to all)</option>
                      {campuses.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
                    Access Grid (View / Add / Edit / Delete)
                  </h4>
                  <div className="border border-divider rounded-xl overflow-hidden bg-surface shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-body-secondary text-[11px] uppercase tracking-wider border-b border-divider">
                          <th className="py-3 px-4 font-semibold w-1/3 border-r border-divider">Module</th>
                          <th className="py-3 px-4 font-semibold text-center border-r border-divider">View</th>
                          <th className="py-3 px-4 font-semibold text-center border-r border-divider">Add</th>
                          <th className="py-3 px-4 font-semibold text-center border-r border-divider">Edit</th>
                          <th className="py-3 px-4 font-semibold text-center border-r border-divider">Delete</th>
                          <th className="py-3 px-4 font-semibold text-center">Toggle All</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-divider">
                        {formData.matrix.map((row) => (
                          <tr key={row.moduleId} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="py-3 px-4 font-medium text-on-surface border-r border-divider flex items-center gap-2">
                              {row.moduleId.replace('_', ' ')}
                            </td>
                            
                            {(['canView', 'canAdd', 'canEdit', 'canDelete'] as const).map(action => (
                              <td key={action} className="py-3 px-4 text-center border-r border-divider">
                                <label className="inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={row[action]}
                                    onChange={() => handleMatrixChange(row.moduleId, action)}
                                  />
                                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${row[action] ? 'bg-primary border-primary text-white' : 'border-border-light bg-surface hover:border-primary/50'}`}>
                                    {row[action] && <Check className="w-3.5 h-3.5" />}
                                  </div>
                                </label>
                              </td>
                            ))}

                            <td className="py-3 px-4 text-center">
                              <button 
                                type="button"
                                onClick={() => handleRowToggle(row.moduleId, !(row.canView && row.canAdd && row.canEdit && row.canDelete))}
                                className="text-xs font-medium text-primary hover:underline"
                              >
                                {row.canView && row.canAdd && row.canEdit && row.canDelete ? 'Clear All' : 'Select All'}
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
              
              <div className="p-4 flex justify-end gap-3 border-t border-divider sticky bottom-0 bg-surface shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-medium border border-border-light rounded-lg hover:bg-surface-container-lowest">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg shadow-sm hover:bg-primary/90">Save Matrix</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
