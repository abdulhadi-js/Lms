import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { Request } from '@nestjs/common';
import { ModuleId } from './entities/module-permission.entity';

@Controller('roles')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermission(ModuleId.ROLES, 'ADD')
  create(@Body() data: any, @Request() req: any) {
    return this.rolesService.create(data, req.user);
  }

  @Get()
  @RequirePermission(ModuleId.ROLES, 'VIEW')
  findAll(@Request() req: any) {
    return this.rolesService.findAll(req.user);
  }

  @Get(':id')
  @RequirePermission(ModuleId.ROLES, 'VIEW')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.rolesService.findOne(id, req.user);
  }

  @Patch(':id')
  @RequirePermission(ModuleId.ROLES, 'EDIT')
  update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.rolesService.update(id, data, req.user);
  }

  @Delete(':id')
  @RequirePermission(ModuleId.ROLES, 'DELETE')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.rolesService.remove(id, req.user);
  }
}
