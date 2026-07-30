import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSION_KEY,
  PermissionRequirement,
} from '../decorators/require-permission.decorator';
import { RolesService } from '../../roles/roles.service';

@Injectable()
export class MatrixGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission =
      this.reflector.getAllAndOverride<PermissionRequirement>(PERMISSION_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredPermission) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('No user found');
    }

    if (user.isSuperAdmin) {
      return true;
    }

    if (!user.roleId) {
      throw new ForbiddenException('User has no role assigned');
    }

    const role = await this.rolesService.findOne(user.roleId);

    if (!role || !role.matrix) {
      throw new ForbiddenException('Role or permissions not found');
    }

    const modulePerm = role.matrix.find(
      (mp) => mp.moduleId === requiredPermission.moduleId,
    );

    if (!modulePerm) {
      throw new ForbiddenException(
        `No permissions for module ${requiredPermission.moduleId}`,
      );
    }

    const hasAccess = (() => {
      switch (requiredPermission.action) {
        case 'VIEW':
          return modulePerm.canView;
        case 'ADD':
          return modulePerm.canAdd;
        case 'EDIT':
          return modulePerm.canEdit;
        case 'DELETE':
          return modulePerm.canDelete;
        default:
          return false;
      }
    })();

    if (!hasAccess) {
      throw new ForbiddenException(
        `Missing ${requiredPermission.action} permission for ${requiredPermission.moduleId}`,
      );
    }

    return true;
  }
}
