"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { fetchAuthApi as fetchApi } from '@/lib/api';
import { Plus, Pencil, Trash2, LibraryBig } from 'lucide-react';

export default function AcademicGroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', campusId: '' });
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadGroups();
      if (user.role === 'SUPER_ADMIN') {
        import('@/lib/api').then(({ campusesApi }) => {
          campusesApi.list().then(setCampuses).catch(() => {});
        });
      }
    }
  }, [user]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const endpoint = user?.campusId ? `/academic-groups?campusId=${user.campusId}` : `/academic-groups`;
      const data = await fetchApi(endpoint);
      setGroups(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        await fetchApi(`/academic-groups/${editingGroup.id}`, {
          method: 'PATCH',
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi('/academic-groups', {
          method: 'POST',
          body: JSON.stringify({ ...formData, campusId: formData.campusId || user?.campusId || null }),
        });
      }
      setIsModalOpen(false);
      loadGroups();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stream/group?')) return;
    try {
      await fetchApi(`/academic-groups/${id}`, { method: 'DELETE' });
      loadGroups();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openModal = (group: any = null) => {
    setEditingGroup(group);
    setFormData(group ? { name: group.name, campusId: group.campusId || '' } : { name: '', campusId: '' });
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center text-on-surface">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-on-surface flex items-center gap-3">
            <LibraryBig className="w-8 h-8 text-primary" />
            Academic Groups (Streams)
          </h1>
          <p className="text-body-secondary mt-1">Manage academic streams (e.g. Pre-Medical, Computer Science).</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Group
        </button>
      </div>

      {error && <div className="bg-error-bg text-error p-4 rounded-lg mb-6 border border-error/20">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-surface brand-shadow rounded-xl text-body-secondary">
            No academic groups found. Create your first one above!
          </div>
        ) : (
          groups.map(group => (
            <div key={group.id} className="bg-surface brand-shadow rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-on-surface">{group.name}</h3>
                {user?.role === 'SUPER_ADMIN' && group.campusId && (
                  <span className="text-xs font-semibold bg-surface-container text-body-secondary px-2 py-1 rounded-md border border-divider">
                    {campuses.find(c => c.id === group.campusId)?.name || 'Campus'}
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4 border-t border-divider pt-4">
                <button 
                  onClick={() => openModal(group)}
                  className="p-2 text-info hover:bg-info-bg rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(group.id)}
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
                {editingGroup ? 'Edit Group' : 'New Academic Group'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-4">
                <label className="block text-sm font-medium text-on-surface mb-2">Group/Stream Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="e.g. Pre-Engineering"
                  required
                />
              </div>
              {user?.role === 'SUPER_ADMIN' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-on-surface mb-2">Assign to Campus</label>
                  <select 
                    value={formData.campusId}
                    onChange={(e) => setFormData({...formData, campusId: e.target.value})}
                    className="w-full border border-divider rounded-lg px-4 py-2 bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    required
                  >
                    <option value="">-- Select Campus --</option>
                    {campuses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
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
