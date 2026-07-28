"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { User, Mail, Phone, Lock, Save, Camera, Shield } from 'lucide-react';
import { tokens } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    user?.profilePicture 
      ? (user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:3001${user.profilePicture}`)
      : ''
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image exceeds the 5MB size limit.');
        e.target.value = ''; // Reset input
        return;
      }
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = tokens.getAccessToken();
      const fd = new FormData();
      if (formData.firstName) fd.append('firstName', formData.firstName);
      if (formData.lastName) fd.append('lastName', formData.lastName);
      if (formData.phone) fd.append('phone', formData.phone);
      if (profilePicture) fd.append('profilePicture', profilePicture);

      const res = await fetch('http://localhost:3001/api/v1/users/profile', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      if (res.ok) {
        toast.success('Profile updated successfully!');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to update profile');
      }
    } catch (e) {
      toast.error('Network error. Failed to connect.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      const token = tokens.getAccessToken();
      const res = await fetch('http://localhost:3001/api/v1/users/profile', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      if (res.ok) {
        toast.success('Password updated successfully!');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to update password');
      }
    } catch (e) {
      toast.error('Network error. Failed to connect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-bold text-heading-on-light">Profile Settings</h2>
        <p className="text-sm text-body-secondary mt-1">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-surface-container-low rounded-xl border border-divider shadow-sm p-6 flex flex-col items-center text-center">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-surface shadow-sm" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-primary text-3xl font-heading font-bold border-4 border-white dark:border-surface shadow-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white w-6 h-6" />
              </div>
            </div>
            <h3 className="font-heading font-bold text-lg text-heading-on-light">{user?.firstName} {user?.lastName}</h3>
            <p className="text-sm text-body-secondary">{user?.email}</p>
            <div className="mt-4 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
              {user?.role} ACCOUNT
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Info Form */}
          <div className="bg-white dark:bg-surface-container-low rounded-xl border border-divider shadow-sm overflow-hidden">
            <div className="p-5 border-b border-divider bg-surface-container-lowest flex items-center gap-2">
              <User className="w-5 h-5 text-icon-inactive" />
              <h3 className="font-heading font-semibold text-heading-on-light">Personal Information</h3>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-body-secondary mb-1">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 bg-transparent border border-border-light rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body-secondary mb-1">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 bg-transparent border border-border-light rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body-secondary mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon-inactive" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-border-light rounded-lg text-sm text-on-surface opacity-70 cursor-not-allowed" disabled />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-body-secondary mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon-inactive" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-transparent border border-border-light rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Security Form */}
          <div className="bg-white dark:bg-surface-container-low rounded-xl border border-divider shadow-sm overflow-hidden">
            <div className="p-5 border-b border-divider bg-surface-container-lowest flex items-center gap-2">
              <Shield className="w-5 h-5 text-icon-inactive" />
              <h3 className="font-heading font-semibold text-heading-on-light">Security & Password</h3>
            </div>
            <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-body-secondary mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon-inactive" />
                  <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-transparent border border-border-light rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-body-secondary mb-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon-inactive" />
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-transparent border border-border-light rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-body-secondary mb-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icon-inactive" />
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-transparent border border-border-light rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" required />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-evergreen text-lime-cream px-5 py-2 rounded-lg text-sm font-medium hover:bg-evergreen-light transition-colors disabled:opacity-50">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
