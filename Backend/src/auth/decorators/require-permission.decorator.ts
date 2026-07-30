import { SetMetadata } from '@nestjs/common';
import { ModuleId } from '../../roles/entities/module-permission.entity';

export const PERMISSION_KEY = 'require_permission';

export interface PermissionRequirement {
  moduleId: ModuleId;
  action: 'VIEW' | 'ADD' | 'EDIT' | 'DELETE';
}

export const RequirePermission = (moduleId: ModuleId, action: 'VIEW' | 'ADD' | 'EDIT' | 'DELETE') =>
  SetMetadata(PERMISSION_KEY, { moduleId, action });
