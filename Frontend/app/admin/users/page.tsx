"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, Shield, UserX, UserCheck, Edit, Trash2, Loader2, Users } from 'lucide-react';
import { usersApi, rolesApi, campusesApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    password: '',
    roleId: '',
    campusId: '',
    status: 'ACTIVE',
    firstName: '',
    lastName: '',
    phone: '',
    isSuperAdmin: false
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersData, rolesData, campusesData] = await Promise.all([
        usersApi.list(roleFilter !== 'ALL' ? roleFilter : undefined),
        rolesApi.list().catch(() => []),
        campusesApi.list().catch(() => [])
      ]);
      setUsers(usersData.data || usersData || []);
      setRoles(rolesData);
      setCampuses(campusesData);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleFilter]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as Element).closest('.actions-dropdown')) return;
      setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleOpenModal = (user?: any) => {
    if (user) {
      setIsEditMode(true);
      setFormData({
        id: user.id,
        email: user.email || '',
        password: '', // Don't populate password on edit
        roleId: user.role?.id || '',
        campusId: user.campus?.id || '',
        status: user.status || 'ACTIVE',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        isSuperAdmin: user.isSuperAdmin || false
      });
    } else {
      setIsEditMode(false);
      setFormData({
        id: '',
        email: '',
        password: '',
        roleId: roles.length > 0 ? roles[0].id : '',
        campusId: currentUser?.isSuperAdmin ? '' : (currentUser?.campusId || ''),
        status: 'ACTIVE',
        firstName: '',
        lastName: '',
        phone: '',
        isSuperAdmin: false
      });
    }
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = {
        email: formData.email,
        roleId: formData.roleId || undefined,
        campusId: formData.campusId || undefined,
        status: formData.status,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        isSuperAdmin: formData.isSuperAdmin
      };
      
      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditMode) {
        await usersApi.update(formData.id, payload);
        toast.success('User updated successfully');
      } else {
        if (!formData.password) throw new Error("Password is required for new users");
        await usersApi.create(payload);
        toast.success('User created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? (They will be marked as INACTIVE)')) return;
    try {
      await usersApi.remove(id);
      toast.success('User deactivated successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to deactivate user');
    }
    setOpenDropdown(null);
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) ||
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">User Management</h2>
          <p className="text-sm text-body-secondary mt-1">Manage staff, students, roles, and campus assignments.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 primary-gradient text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-icon-inactive" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" 
              />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-surface border border-border-light rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Roles</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
             <div className="flex justify-center items-center h-64">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
          ) : filteredUsers.length === 0 ? (
             <div className="flex flex-col justify-center items-center h-64 text-body-secondary">
               <Users className="w-12 h-12 mb-2 opacity-20" />
               <p>No users found.</p>
             </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-6 font-semibold">Role</th>
                  <th className="py-4 px-6 font-semibold">Campus</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map((row) => (
                  <tr key={row.id} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors group relative">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container font-bold text-sm">
                          {row.firstName?.[0]}{row.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-on-surface flex items-center gap-2">
                            {row.firstName} {row.lastName}
                            {row.isSuperAdmin && <Shield className="w-3.5 h-3.5 text-primary" title="Super Admin" />}
                          </div>
                          <div className="text-xs text-body-secondary">{row.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">
                      {row.isSuperAdmin ? (
                        <span className="text-primary font-bold text-xs uppercase tracking-wider">Super Admin</span>
                      ) : (
                        <span className="text-body-secondary">{row.role?.name || 'No Role Assigned'}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {row.campus ? (
                        <span className="bg-surface-container px-2 py-1 rounded text-xs text-body-secondary border border-border-light">
                          {row.campus.name}
                        </span>
                      ) : (
                        <span className="text-body-secondary text-xs italic">Global / Not Assigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {row.status === 'ACTIVE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20"><UserCheck className="w-3 h-3 mr-1" /> Active</span>}
                      {row.status === 'PENDING' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-bg text-warning border border-warning/20">Pending</span>}
                      {row.status === 'INACTIVE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20"><UserX className="w-3 h-3 mr-1" /> Inactive</span>}
                    </td>
                    <td className="py-4 px-6 text-right relative actions-dropdown">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === row.id ? null : row.id)}
                        className="text-icon-inactive hover:text-primary transition-colors p-1.5 rounded-md hover:bg-surface-container"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {openDropdown === row.id && (
                        <div className="absolute right-6 top-10 w-40 bg-surface rounded-lg shadow-xl border border-divider py-1 z-50 animate-in fade-in zoom-in duration-200">
                          <button 
                            onClick={() => handleOpenModal(row)}
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4 text-icon-inactive" /> Edit User
                          </button>
                          <hr className="my-1 border-divider" />
                          <button 
                            onClick={() => handleDelete(row.id)}
                            className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-bg flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Deactivate
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </>
          )}
        </div>
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light flex items-center gap-2">
                {isEditMode ? 'Edit User' : 'Add New User'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors">
                <Trash2 className="h-5 w-5 hidden" />
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">First Name</label>
                  <input 
                    type="text" required
                    value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Last Name</label>
                  <input 
                    type="text" required
                    value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Email Address</label>
                <input 
                  type="email" required
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Password {isEditMode && <span className="text-xs font-normal text-body-secondary">(Leave blank to keep current)</span>}
                </label>
                <input 
                  type="password" 
                  required={!isEditMode}
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>

              {currentUser?.isSuperAdmin && (
                <div className="flex items-center gap-2 p-3 bg-surface-container-lowest border border-border-light rounded-lg">
                  <input 
                    type="checkbox" 
                    id="isSuperAdmin"
                    checked={formData.isSuperAdmin} 
                    onChange={e => setFormData({...formData, isSuperAdmin: e.target.checked})}
                    className="w-4 h-4 text-primary rounded border-border-light focus:ring-primary"
                  />
                  <label htmlFor="isSuperAdmin" className="text-sm font-medium text-on-surface cursor-pointer flex items-center gap-1">
                    Grant Global Super Admin Privileges <Shield className="w-3.5 h-3.5 text-primary" />
                  </label>
                </div>
              )}

              {!formData.isSuperAdmin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Role Assignment</label>
                    <select 
                      required
                      value={formData.roleId} onChange={e => setFormData({...formData, roleId: e.target.value})}
                      className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="" disabled>Select a Role</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  {currentUser?.isSuperAdmin ? (
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1">Assign to Campus</label>
                      <select 
                        required
                        value={formData.campusId} onChange={e => setFormData({...formData, campusId: e.target.value})}
                        className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="" disabled>Select a Campus</option>
                        {campuses.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1">Status</label>
                      <select 
                        value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="PENDING">Pending</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
              
              {(!formData.isSuperAdmin && currentUser?.isSuperAdmin) && (
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Status</label>
                  <select 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-divider">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-body-secondary hover:bg-surface-container-low rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-white primary-gradient rounded-lg hover:shadow-md transition-shadow disabled:opacity-70 flex items-center"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isEditMode ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
