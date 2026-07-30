"use client";
import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';

type RequireAccessProps = {
  module: 'DASHBOARD' | 'CAMPUSES' | 'ROLES' | 'ACADEMICS' | 'USERS_STAFF' | 'USERS_STUDENTS' | 'FEES' | 'ACCOUNTS' | 'ATTENDANCE' | 'EXAMS' | 'REPORTS' | 'MESSAGING';
  action: 'canView' | 'canAdd' | 'canEdit' | 'canDelete';
  children: ReactNode;
  fallback?: ReactNode;
};

export function RequireAccess({ module, action, children, fallback = null }: RequireAccessProps) {
  const { user } = useAuth();

  // If loading or no user, show fallback
  if (!user) return <>{fallback}</>;

  // SuperAdmin gets God Mode bypass
  if (user.isSuperAdmin) return <>{children}</>;

  // Extract matrix
  const matrix = user.matrix || [];

  // Find permissions for this specific module
  const modulePerms = matrix.find(m => m.moduleId === module);

  if (!modulePerms) {
    // Role has no permissions configured for this module at all
    return <>{fallback}</>;
  }

  // Check if the specific action is allowed
  const isAllowed = !!modulePerms[action];

  if (isAllowed) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
