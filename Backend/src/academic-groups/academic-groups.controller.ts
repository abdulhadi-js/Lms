import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AcademicGroupsService } from './academic-groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('academic-groups')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class AcademicGroupsController {
  constructor(private readonly groupsService: AcademicGroupsService) {}

  @RequirePermission(ModuleId.ACADEMICS, 'ADD')
  @Post()
  create(@Body() createDto: any, @CurrentUser() user: any) {
    return this.groupsService.create(createDto, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'VIEW')
  @Get()
  findAll(@Query('campusId') campusId: string, @CurrentUser() user: any) {
    return this.groupsService.findAll(campusId, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'VIEW')
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.groupsService.findOne(id, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'EDIT')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any, @CurrentUser() user: any) {
    return this.groupsService.update(id, updateDto, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'DELETE')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.groupsService.remove(id, user);
  }
}
