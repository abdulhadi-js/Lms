"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, Shield, UserX, UserCheck, Edit, Trash2, Loader2, Users, Briefcase } from 'lucide-react';
import { usersApi, rolesApi, campusesApi, hrApi, academicsApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const searchParams = useSearchParams();
  const campusIdFilter = searchParams.get('campusId');
  const queryClient = useQueryClient();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // Pagination
  const [page, setPage] = useState(1);
  const limit = 50;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHrLoading, setIsHrLoading] = useState(false);
  
  const [isHrModalOpen, setIsHrModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [hrFormData, setHrFormData] = useState({
    qualifications: '',
    experience: '',
    appointmentDate: '',
    basicSalary: '',
    allowances: [] as { name: string, amount: string }[],
    deductions: [] as { name: string, amount: string }[],
    bankAccountDetails: ''
  });
  
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
    isSuperAdmin: false,
    familyCode: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    guardianName: '',
    address: '',
    // Pakistani student-specific required fields
    grNumber: '',
    bFormNumber: '',
    dateOfBirth: '',
    gender: '',
    classId: '',
    sectionId: '',
    religion: 'Islam',
    fatherCnic: ''
  });

  const { data: usersData, isLoading: isUsersLoading } = useQuery<any[]>({
    queryKey: ['users', roleFilter, page],
    queryFn: async () => {
      const res = await usersApi.list(
        roleFilter !== 'ALL' ? roleFilter : undefined,
        limit,
        (page - 1) * limit
      );
      return res.data || res || [];
    }
  });

  const { data: roles = [], isLoading: isRolesLoading } = useQuery<any[]>({
    queryKey: ['roles'],
    queryFn: async () => rolesApi.list().catch(() => [])
  });

  const { data: campuses = [], isLoading: isCampusesLoading } = useQuery<any[]>({
    queryKey: ['campuses'],
    queryFn: async () => campusesApi.list().catch(() => [])
  });

  const { data: academicClasses = [], isLoading: isClassesLoading } = useQuery<any[]>({
    queryKey: ['classes'],
    queryFn: async () => academicsApi.listClasses().catch(() => [])
  });

  const users = usersData || [];
  const isLoading = isUsersLoading || isRolesLoading || isCampusesLoading || isClassesLoading;

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
        isSuperAdmin: user.isSuperAdmin || false,
        familyCode: user.family?.familyCode || '',
        fatherName: user.family?.fatherName || '',
        fatherPhone: user.family?.fatherPhone || '',
        motherName: user.family?.motherName || '',
        guardianName: user.family?.guardianName || '',
        address: user.family?.address || '',
        grNumber: user.grNumber || '',
        bFormNumber: user.bFormNumber || user.cnic || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        classId: user.class?.id || user.classId || '',
        sectionId: user.section?.id || user.sectionId || '',
        religion: user.religion || 'Islam',
        fatherCnic: user.family?.father?.cnic || user.parentCnic || ''
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
        isSuperAdmin: false,
        familyCode: '',
        fatherName: '',
        fatherPhone: '',
        motherName: '',
        guardianName: '',
        address: '',
        grNumber: '',
        bFormNumber: '',
        dateOfBirth: '',
        gender: '',
        classId: '',
        sectionId: '',
        religion: 'Islam',
        fatherCnic: ''
      });
    }
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const submitMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (isEditMode) {
        await usersApi.update(formData.id, payload);
      } else {
        await usersApi.create(payload);
      }
    },
    onSuccess: () => {
      toast.success(isEditMode ? 'User updated successfully' : 'User created successfully');
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save user');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditMode && !formData.password) {
      toast.error('Password is required for new users');
      return;
    }

    const isStudentRole = roles.find(r => r.id === formData.roleId)?.name?.toUpperCase() === 'STUDENT';
    if (isStudentRole && !isEditMode) {
      if (!formData.phone) { toast.error('Student phone number is required'); return; }
      if (!formData.dateOfBirth) { toast.error('Date of Birth is required'); return; }
      if (!formData.gender) { toast.error('Gender is required'); return; }
      if (!formData.bFormNumber) { toast.error('B-Form / CNIC is required'); return; }
      if (!formData.classId) { toast.error('Class is required'); return; }
      if (!formData.sectionId) { toast.error('Section is required'); return; }
      if (!formData.fatherName) { toast.error("Father's Name is required"); return; }
      if (!formData.fatherCnic) { toast.error("Father's CNIC is required"); return; }
      if (!formData.fatherPhone) { toast.error("Father's Phone is required"); return; }
      if (!formData.address) { toast.error('Home Address is required'); return; }
    }
    
    const payload: any = {
      email: formData.email,
      roleId: formData.roleId || undefined,
      campusId: formData.campusId || undefined,
      status: formData.status,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || undefined,
      isSuperAdmin: formData.isSuperAdmin,
      familyCode: formData.familyCode || undefined,
      fatherName: formData.fatherName || undefined,
      fatherPhone: formData.fatherPhone || undefined,
      motherName: formData.motherName || undefined,
      guardianName: formData.guardianName || undefined,
      address: formData.address || undefined,
      grNumber: formData.grNumber || undefined,
      bFormNumber: formData.bFormNumber || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender || undefined,
      classId: formData.classId || undefined,
      sectionId: formData.sectionId || undefined,
      religion: formData.religion || undefined,
      fatherCnic: formData.fatherCnic || undefined,
    };
    
    if (formData.password) {
      payload.password = formData.password;
    }

    submitMutation.mutate(payload);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      toast.success('User deactivated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenDropdown(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to deactivate user');
      setOpenDropdown(null);
    }
  });

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this user? (They will be marked as INACTIVE)')) return;
    deleteMutation.mutate(id);
  };

  const handleOpenHrModal = async (userId: string) => {
    setSelectedStaffId(userId);
    setOpenDropdown(null);
    setIsHrLoading(true);
    try {
      const profile = await hrApi.getProfile(userId);
      setHrFormData({
        qualifications: profile?.qualifications || '',
        experience: profile?.experience || '',
        appointmentDate: profile?.appointmentDate ? new Date(profile.appointmentDate).toISOString().split('T')[0] : '',
        basicSalary: profile?.basicSalary || '',
        allowances: profile?.allowances ? Object.entries(profile.allowances).map(([k, v]) => ({ name: k, amount: String(v) })) : [],
        deductions: profile?.deductions ? Object.entries(profile.deductions).map(([k, v]) => ({ name: k, amount: String(v) })) : [],
        bankAccountDetails: profile?.bankAccountDetails || ''
      });
      setIsHrModalOpen(true);
    } catch (error: any) {
      // If profile doesn't exist, it's fine, we will create it
      setHrFormData({
        qualifications: '', experience: '', appointmentDate: '', basicSalary: '', allowances: [], deductions: [], bankAccountDetails: ''
      });
      setIsHrModalOpen(true);
    } finally {
      setIsHrLoading(false);
    }
  };

  const handleHrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;
    setIsSubmitting(true);
    try {
      const allowancesObj = hrFormData.allowances.reduce((acc: any, curr) => {
        if (curr.name && curr.amount) acc[curr.name] = Number(curr.amount);
        return acc;
      }, {});
      
      const deductionsObj = hrFormData.deductions.reduce((acc: any, curr) => {
        if (curr.name && curr.amount) acc[curr.name] = Number(curr.amount);
        return acc;
      }, {});

      const payload = {
        ...hrFormData,
        basicSalary: Number(hrFormData.basicSalary),
        allowances: Object.keys(allowancesObj).length > 0 ? allowancesObj : null,
        deductions: Object.keys(deductionsObj).length > 0 ? deductionsObj : null,
      };
      await hrApi.updateProfile(selectedStaffId, payload);
      toast.success('HR Profile updated successfully');
      setIsHrModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update HR Profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (campusIdFilter && user.campusId !== campusIdFilter && user.campus?.id !== campusIdFilter) {
      return false;
    }
    const query = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) ||
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.id?.toLowerCase().includes(query) ||
      (user.metadata && user.metadata.toLowerCase().includes(query))
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
          className="flex items-center gap-2 primary-gradient text-white px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
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
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" 
              />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={roleFilter}
              disabled={isLoading}
              onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
              className="bg-surface border border-border-light rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            >
              <option value="ALL">{isLoading ? 'Loading Roles...' : 'All Roles'}</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-body-secondary text-[11px] uppercase tracking-wider border-b border-divider">
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Campus</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="border-b border-border-light animate-pulse">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-divider"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-divider rounded"></div>
                          <div className="h-3 w-48 bg-divider rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><div className="h-4 w-24 bg-divider rounded"></div></td>
                    <td className="py-3 px-4"><div className="h-4 w-20 bg-divider rounded"></div></td>
                    <td className="py-3 px-4"><div className="h-6 w-16 bg-divider rounded-full"></div></td>
                    <td className="py-3 px-4 text-right"><div className="h-8 w-8 bg-divider rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12">
                    <div className="flex flex-col justify-center items-center text-body-secondary">
                      <Users className="w-12 h-12 mb-2 opacity-20" />
                      <p>No users found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((row) => (
                  <tr key={row.id} className="border-b border-border-light  hover:bg-surface transition-colors group relative">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container font-bold text-sm">
                          {row.firstName?.[0]}{row.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-on-surface flex items-center gap-2">
                            <Link href={`/admin/users/${row.id}`} className="hover:text-primary hover:underline">
                              {row.firstName} {row.lastName}
                            </Link>
                            {row.isSuperAdmin && <Shield className="w-3.5 h-3.5 text-primary" aria-label="Super Admin" />}
                          </div>
                          <div className="text-xs text-body-secondary">{row.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {row.isSuperAdmin ? (
                        <span className="text-primary font-bold text-xs uppercase tracking-wider">Super Admin</span>
                      ) : (
                        <span className="text-body-secondary">{row.role?.name || 'No Role Assigned'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {row.campus ? (
                        <span className="bg-surface-container px-2 py-1 rounded text-xs text-body-secondary border border-border-light">
                          {row.campus.name}
                        </span>
                      ) : (
                        <span className="text-body-secondary text-xs italic">Global / Not Assigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {row.status === 'ACTIVE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20"><UserCheck className="w-3 h-3 mr-1" /> Active</span>}
                      {row.status === 'PENDING' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-bg text-warning border border-warning/20">Pending</span>}
                      {row.status === 'INACTIVE' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-bg text-error border border-error/20"><UserX className="w-3 h-3 mr-1" /> Inactive</span>}
                    </td>
                    <td className="py-3 px-4 text-right relative actions-dropdown">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === row.id ? null : row.id)}
                        className="text-icon-inactive hover:text-primary transition-colors p-1.5 rounded-md hover:bg-surface-container"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {openDropdown === row.id && (
                        <div className="absolute right-6 top-10 w-48 bg-surface rounded-lg shadow-xl border border-divider py-1 z-50 animate-in fade-in zoom-in duration-200">
                          <button 
                            onClick={() => handleOpenModal(row)}
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4 text-icon-inactive" /> Edit User
                          </button>
                          {row.role?.name?.toUpperCase() !== 'STUDENT' && (
                            <button 
                              onClick={() => handleOpenHrModal(row.id)}
                              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary-container/20 flex items-center gap-2"
                            >
                              <Briefcase className="w-4 h-4" /> Manage HR Profile
                            </button>
                          )}
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
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="p-4 border-t border-divider flex items-center justify-between bg-surface">
          <div className="text-sm text-body-secondary">
            Showing page {page}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="px-3 py-1 text-sm bg-surface-container rounded-md hover:bg-surface-container-high disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={users.length < limit || isLoading}
              className="px-3 py-1 text-sm bg-surface-container rounded-md hover:bg-surface-container-high disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light flex items-center gap-2">
                {isEditMode ? 'Edit User' : 'Add New User'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors">
                <Trash2 className="h-5 w-5 hidden" />
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">First Name</label>
                  <input 
                    type="text" required
                    value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Last Name</label>
                  <input 
                    type="text" required
                    value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Email Address</label>
                <input 
                  type="email" required
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
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
                  className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Role Assignment</label>
                    <select 
                      name="role"
                      required
                      disabled={isLoading || roles.length === 0}
                      value={formData.roleId} onChange={e => setFormData({...formData, roleId: e.target.value})}
                      className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    >
                      <option value="" disabled>{(isLoading || roles.length === 0) ? 'Loading roles...' : 'Select a Role'}</option>
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
                        disabled={isLoading || campuses.length === 0}
                        value={formData.campusId} onChange={e => setFormData({...formData, campusId: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                      >
                        <option value="" disabled>{(isLoading || campuses.length === 0) ? 'Loading campuses...' : 'Select a Campus'}</option>
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
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                    className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              )}

              {roles.find(r => r.id === formData.roleId)?.name?.toUpperCase() === 'STUDENT' && (
                <div className="pt-4 border-t border-divider space-y-4">
                  <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                    <Users className="w-4 h-4" /> Student Details
                    <span className="ml-auto text-xs font-normal text-body-secondary">Fields marked * are required</span>
                  </h4>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">Phone / Contact No. <span className="text-error">*</span></label>
                      <input
                        type="tel" required placeholder="03XX-XXXXXXX"
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">Date of Birth <span className="text-error">*</span></label>
                      <input
                        type="date" required
                        value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">Gender <span className="text-error">*</span></label>
                      <select
                        required
                        value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">Religion</label>
                      <select
                        value={formData.religion} onChange={e => setFormData({...formData, religion: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      >
                        <option value="Islam">Islam</option>
                        <option value="Christianity">Christianity</option>
                        <option value="Hinduism">Hinduism</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Official Record */}
                  <h4 className="text-xs font-bold text-body-secondary uppercase tracking-wide pt-2">Official School Record</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">GR Number</label>
                      <input
                        name="grNumber"
                        type="text" placeholder="Auto-generated if blank"
                        value={formData.grNumber} onChange={e => setFormData({...formData, grNumber: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">B-Form / CNIC No. <span className="text-error">*</span></label>
                      <input
                        name="bFormNumber"
                        type="text" required placeholder="XXXXX-XXXXXXX-X"
                        value={formData.bFormNumber} onChange={e => setFormData({...formData, bFormNumber: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">Class <span className="text-error">*</span></label>
                      <select
                        name="classId"
                        required
                        value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value, sectionId: ''})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      >
                        <option value="">Select Class</option>
                        {academicClasses.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">Section <span className="text-error">*</span></label>
                      <select
                        name="sectionId"
                        required
                        disabled={!formData.classId}
                        value={formData.sectionId} onChange={e => setFormData({...formData, sectionId: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:opacity-50"
                      >
                        <option value="">Select Section</option>
                        {(academicClasses.find(c => c.id === formData.classId)?.sections || []).map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guardian Info */}
                  <h4 className="text-xs font-bold text-body-secondary uppercase tracking-wide pt-2">Family / Guardian Info</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-xs font-semibold text-on-surface mb-1">Family Code <span className="text-body-secondary font-normal">(Link siblings)</span></label>
                      <input
                        type="text" placeholder="e.g. FAM-1234"
                        value={formData.familyCode} onChange={e => setFormData({...formData, familyCode: e.target.value})}
                        className="w-full px-3 py-2 bg-surface-container text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">Father&apos;s Name <span className="text-error">*</span></label>
                      <input
                        type="text" required placeholder="Full Name"
                        value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">Father&apos;s Phone <span className="text-error">*</span></label>
                      <input
                        type="tel" required placeholder="03XX-XXXXXXX"
                        value={formData.fatherPhone} onChange={e => setFormData({...formData, fatherPhone: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-xs font-semibold text-on-surface mb-1">Father&apos;s CNIC <span className="text-error">*</span></label>
                      <input
                        type="text" required placeholder="XXXXX-XXXXXXX-X"
                        value={formData.fatherCnic} onChange={e => setFormData({...formData, fatherCnic: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">Mother&apos;s Name</label>
                      <input
                        type="text"
                        value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">Guardian&apos;s Name</label>
                      <input
                        type="text"
                        value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-xs font-semibold text-on-surface mb-1">Home Address <span className="text-error">*</span></label>
                      <input
                        type="text" required placeholder="Street, City"
                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    </div>
                  </div>
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
                  type="submit" disabled={submitMutation.isPending}
                  className="px-4 py-2 text-sm font-semibold text-white primary-gradient rounded-lg hover:shadow-md transition-shadow disabled:opacity-70 flex items-center"
                >
                  {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isEditMode ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* HR Modal */}
      {isHrModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Staff HR Profile
              </h3>
              <button onClick={() => setIsHrModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors">&times;</button>
            </div>
            <form onSubmit={handleHrSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Qualifications</label>
                <input 
                  type="text" value={hrFormData.qualifications} onChange={e => setHrFormData({...hrFormData, qualifications: e.target.value})}
                  placeholder="e.g. MS Computer Science"
                  className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Experience</label>
                <input 
                  type="text" value={hrFormData.experience} onChange={e => setHrFormData({...hrFormData, experience: e.target.value})}
                  placeholder="e.g. 5 Years Teaching"
                  className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Appointment Date</label>
                  <input 
                    type="date" value={hrFormData.appointmentDate} onChange={e => setHrFormData({...hrFormData, appointmentDate: e.target.value})}
                    className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Basic Salary ($)</label>
                  <input 
                    type="number" step="0.01" required value={hrFormData.basicSalary} onChange={e => setHrFormData({...hrFormData, basicSalary: e.target.value})}
                    className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 border border-divider rounded-lg p-3 bg-surface-container-low">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-on-surface">Allowances</label>
                    <button type="button" onClick={() => setHrFormData(prev => ({...prev, allowances: [...prev.allowances, {name: '', amount: ''}]}))} className="text-xs text-primary hover:underline font-medium">+ Add</button>
                  </div>
                  {hrFormData.allowances.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input type="text" placeholder="Name (e.g. Housing)" value={item.name} onChange={e => { const newArr = [...hrFormData.allowances]; newArr[idx].name = e.target.value; setHrFormData({...hrFormData, allowances: newArr}) }} className="w-full px-2 py-1.5 bg-surface text-on-surface border border-divider rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs" />
                      <input type="number" placeholder="Amount" value={item.amount} onChange={e => { const newArr = [...hrFormData.allowances]; newArr[idx].amount = e.target.value; setHrFormData({...hrFormData, allowances: newArr}) }} className="w-20 px-2 py-1.5 bg-surface text-on-surface border border-divider rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs" />
                      <button type="button" onClick={() => { const newArr = [...hrFormData.allowances]; newArr.splice(idx, 1); setHrFormData({...hrFormData, allowances: newArr}) }} className="text-error hover:text-error/80 px-1 font-bold">&times;</button>
                    </div>
                  ))}
                  {hrFormData.allowances.length === 0 && <div className="text-xs text-body-secondary italic">No allowances added</div>}
                </div>
                <div className="space-y-2 border border-divider rounded-lg p-3 bg-surface-container-low">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-on-surface">Deductions</label>
                    <button type="button" onClick={() => setHrFormData(prev => ({...prev, deductions: [...prev.deductions, {name: '', amount: ''}]}))} className="text-xs text-primary hover:underline font-medium">+ Add</button>
                  </div>
                  {hrFormData.deductions.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input type="text" placeholder="Name (e.g. Tax)" value={item.name} onChange={e => { const newArr = [...hrFormData.deductions]; newArr[idx].name = e.target.value; setHrFormData({...hrFormData, deductions: newArr}) }} className="w-full px-2 py-1.5 bg-surface text-on-surface border border-divider rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs" />
                      <input type="number" placeholder="Amount" value={item.amount} onChange={e => { const newArr = [...hrFormData.deductions]; newArr[idx].amount = e.target.value; setHrFormData({...hrFormData, deductions: newArr}) }} className="w-20 px-2 py-1.5 bg-surface text-on-surface border border-divider rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs" />
                      <button type="button" onClick={() => { const newArr = [...hrFormData.deductions]; newArr.splice(idx, 1); setHrFormData({...hrFormData, deductions: newArr}) }} className="text-error hover:text-error/80 px-1 font-bold">&times;</button>
                    </div>
                  ))}
                  {hrFormData.deductions.length === 0 && <div className="text-xs text-body-secondary italic">No deductions added</div>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Bank Account Details</label>
                <input 
                  type="text" value={hrFormData.bankAccountDetails} onChange={e => setHrFormData({...hrFormData, bankAccountDetails: e.target.value})}
                  placeholder="Bank Name, IBAN..."
                  className="w-full px-3 py-2 bg-surface text-on-surface border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-divider">
                <button type="button" onClick={() => setIsHrModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-body-secondary hover:bg-surface-container-low rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-shadow disabled:opacity-70 flex items-center">
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save HR Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
