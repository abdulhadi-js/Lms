"use client";
import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, ShieldCheck, Users, Shield, UserCircle, Settings2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { rolesApi, usersApi } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function RoleDetails() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [role, setRole] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roleData, usersData] = await Promise.all([
        rolesApi.get(id),
        usersApi.list(id, 5000, 0).catch(() => []) // fetch up to 5k users
      ]);
      setRole(roleData);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch role details');
      router.push('/admin/roles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!role) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-surface p-6 rounded-2xl border border-divider brand-shadow">
        <div className="flex items-center gap-4">
          <Link href="/admin/roles" className="p-2 hover:bg-surface-container rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-body-secondary" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-heading-on-light flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-primary" />
                {role.name}
              </h1>
              {role.isSystem && (
                <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" /> System Role
                </span>
              )}
            </div>
            <p className="text-body-secondary mt-1">
              {role.campusId ? `Assigned to campus ID: ${role.campusId}` : 'Global Role (Applies to all campuses)'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-divider brand-shadow overflow-hidden">
        <div className="p-6 border-b border-divider flex items-center justify-between">
          <h2 className="text-lg font-bold text-heading-on-light flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Users with this Role
            <span className="ml-2 bg-surface-container text-body-secondary text-xs px-2 py-1 rounded-full font-medium">
              {users.length} Users
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="text-center p-12 text-body-secondary">
              No users are currently assigned to this role.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                  <th className="py-4 px-6 font-semibold w-1/4">User Name</th>
                  <th className="py-4 px-6 font-semibold w-1/3">Email</th>
                  <th className="py-4 px-6 font-semibold w-1/4">Campus</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {users.map(user => {
                  const roleName = (user.role?.name || role.name || '').toUpperCase();
                  const profileLink = roleName === 'STUDENT' ? `/admin/students/${user.id}` : `/admin/users/${user.id}`;
                  
                  return (
                    <tr key={user.id} className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <UserCircle className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-heading-on-light text-sm">{user.firstName} {user.lastName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-body-secondary">
                        {user.email}
                      </td>
                      <td className="py-4 px-6">
                        {user.campus ? (
                          <span className="text-xs bg-surface-container text-body-secondary px-2 py-1 rounded border border-border-light">
                            {user.campus.name}
                          </span>
                        ) : (
                          <span className="text-xs text-body-secondary italic">Global / None</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link href={profileLink} className="text-primary hover:underline text-sm font-medium">
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
