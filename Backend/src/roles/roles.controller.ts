import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from './entities/module-permission.entity';

@Controller('roles')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermission(ModuleId.ROLES, 'ADD')
  create(@Body() data: any) {
    return this.rolesService.create(data);
  }

  @Get()
  @RequirePermission(ModuleId.ROLES, 'VIEW')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RequirePermission(ModuleId.ROLES, 'VIEW')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission(ModuleId.ROLES, 'EDIT')
  update(@Param('id') id: string, @Body() data: any) {
    return this.rolesService.update(id, data);
  }

  @Delete(':id')
  @RequirePermission(ModuleId.ROLES, 'DELETE')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
