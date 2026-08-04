"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { fetchAuthApi as fetchApi } from '@/lib/api';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';

export default function DepartmentsPage() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadDepartments();
    }
  }, [user]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const endpoint = user?.campusId ? `/departments?campusId=${user.campusId}` : `/departments`;
      const data = await fetchApi(endpoint);
      setDepartments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await fetchApi(`/departments/${editingDept.id}`, {
          method: 'PATCH',
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi('/departments', {
          method: 'POST',
          body: JSON.stringify({ ...formData, campusId: user?.campusId || null }),
        });
      }
      setIsModalOpen(false);
      loadDepartments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      await fetchApi(`/departments/${id}`, { method: 'DELETE' });
      loadDepartments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openModal = (dept: any = null) => {
    setEditingDept(dept);
    setFormData(dept ? { name: dept.name } : { name: '' });
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center text-on-surface">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-on-surface flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            Departments
          </h1>
          <p className="text-body-secondary mt-1">Manage staff departments for your campus.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Department
        </button>
      </div>

      {error && <div className="bg-error-bg text-error p-4 rounded-lg mb-6 border border-error/20">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-surface brand-shadow rounded-xl text-body-secondary">
            No departments found. Create your first one above!
          </div>
        ) : (
          departments.map(dept => (
            <div key={dept.id} className="bg-surface brand-shadow rounded-xl p-5 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-on-surface mb-4">{dept.name}</h3>
              <div className="flex justify-end gap-2 mt-4 border-t border-divider pt-4">
                <button 
                  onClick={() => openModal(dept)}
                  className="p-2 text-info hover:bg-info-bg rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(dept.id)}
                  className="p-2 text-error hover:bg-error-bg rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full brand-shadow overflow-hidden">
            <div className="p-5 border-b border-divider">
              <h2 className="text-2xl font-bold text-on-surface">
                {editingDept ? 'Edit Department' : 'New Department'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-4">
                <label className="block text-sm font-medium text-on-surface mb-2">Department Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="e.g. Science Department"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-body-secondary hover:bg-surface-container rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
