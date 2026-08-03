import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('departments')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @RequirePermission(ModuleId.USERS_STAFF, 'ADD')
  @Post()
  create(@Body() createDto: any, @CurrentUser() user: any) {
    return this.departmentsService.create(createDto, user);
  }

  @RequirePermission(ModuleId.USERS_STAFF, 'VIEW')
  @Get()
  findAll(@Query('campusId') campusId: string, @CurrentUser() user: any) {
    return this.departmentsService.findAll(campusId, user);
  }

  @RequirePermission(ModuleId.USERS_STAFF, 'VIEW')
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.departmentsService.findOne(id, user);
  }

  @RequirePermission(ModuleId.USERS_STAFF, 'EDIT')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any, @CurrentUser() user: any) {
    return this.departmentsService.update(id, updateDto, user);
  }

  @RequirePermission(ModuleId.USERS_STAFF, 'DELETE')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.departmentsService.remove(id, user);
  }
}
