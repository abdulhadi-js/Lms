"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, Shield, UserX, UserCheck, Edit, Trash2, Loader2, Users } from 'lucide-react';
import { usersApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
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
    role: 'STUDENT',
    status: 'ACTIVE',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await usersApi.list(roleFilter !== 'ALL' ? roleFilter : undefined);
      setUsers(data.data || data || []);
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
        role: user.role || 'STUDENT',
        status: user.status || 'ACTIVE',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      });
    } else {
      setIsEditMode(false);
      setFormData({
        id: '',
        email: '',
        password: '',
        role: 'STUDENT',
        status: 'ACTIVE',
        firstName: '',
        lastName: '',
        phone: ''
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
        role: formData.role,
        status: formData.status,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined
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
          <p className="text-sm text-body-secondary mt-1">Manage system accounts, enrollments, and statuses.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 primary-gradient text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-divider brand-shadow overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-icon-inactive" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" 
              />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="TEACHER">Teachers</option>
              <option value="ADMIN">Admins</option>
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-6 font-semibold">Role</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Joined Date</th>
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
                          <div className="font-medium text-on-surface">{row.firstName} {row.lastName}</div>
                          <div className="text-xs text-body-secondary">{row.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-body-secondary font-medium">
                      {row.role === 'ADMIN' && <span className="flex items-center gap-1 text-primary"><Shield className="w-3 h-3" /> Admin</span>}
                      {row.role === 'TEACHER' && <span className="text-info">Teacher</span>}
                      {row.role === 'STUDENT' && <span className="text-body-secondary">Student</span>}
                    </td>
                    <td className="py-4 px-6">
                      {row.status === 'ACTIVE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20"><UserCheck className="w-3 h-3 mr-1" /> Active</span>}
                      {row.status === 'PENDING' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-bg text-warning border border-warning/20">Pending</span>}
                      {row.status === 'INACTIVE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20"><UserX className="w-3 h-3 mr-1" /> Inactive</span>}
                    </td>
                    <td className="py-4 px-6 text-body-secondary">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right relative actions-dropdown">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === row.id ? null : row.id)}
                        className="text-icon-inactive hover:text-primary transition-colors p-1.5 rounded-md hover:bg-surface-container"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {openDropdown === row.id && (
                        <div className="absolute right-6 top-10 w-40 bg-white rounded-lg shadow-xl border border-divider py-1 z-50 animate-in fade-in zoom-in duration-200">
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
          )}
        </div>
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Role</label>
                  <select 
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
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
              </div>

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
